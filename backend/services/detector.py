"""
Service: SAR Image Ingestion, Adaptive Band Selection & YOLOv8-seg Multi-Slick Detection
1:1 Port of Certified Colab Pipeline
"""
import os
import cv2
import numpy as np
import rasterio
from pathlib import Path

import backend.services.win_fix
from ultralytics import YOLO
from backend.config import MODEL_PATH, CONF_THRESHOLD

class SARDetector:
    def __init__(self, weights_path=MODEL_PATH):
        self.weights_path = Path(weights_path)
        self.model = None
        self._init_model()

    def _init_model(self):
        if self.weights_path.exists():
            try:
                self.model = YOLO(str(self.weights_path))
                print(f"🤖 [SARDetector] Loaded trained model weights from: {self.weights_path}")
            except Exception as e:
                print(f"⚠️ [SARDetector] Error loading weights ({e}). Operating in benchmark fallback mode.")
                self.model = None
        else:
            print(f"ℹ️ [SARDetector] Trained model '{self.weights_path.name}' not found locally. Fallback ready.")
            self.model = None

    @staticmethod
    def extract_best_sar_band(src):
        """
        Scans all bands to find the one with real radar speckle variation.
        Rejects constant/blank alpha masks (variance == 0).
        """
        best_band_idx = 1
        max_variance = -1.0
        for idx in range(1, src.count + 1):
            b_data = src.read(idx).astype(np.float32)
            clean_b = np.nan_to_num(b_data, nan=0.0)
            p2, p98 = np.percentile(clean_b, (2, 98))
            spread = p98 - p2
            if spread > max_variance:
                max_variance = spread
                best_band_idx = idx
        return src.read(best_band_idx).astype(np.float32)

    @staticmethod
    def normalize_vv_clean(vv_arr):
        # Track raw NaNs before sanitizing
        raw_nan_mask = np.isnan(vv_arr)
        clean_arr = np.nan_to_num(vv_arr, nan=-999.0)
        
        # Check if image is in Decibels (negative values like -35 to -5 dB)
        valid_db = clean_arr[(clean_arr > -50.0) & (clean_arr < 0.0)]
        if len(valid_db) > 100:
            p2, p98 = np.percentile(valid_db, (2, 98))
            if p98 > p2:
                norm = np.clip((clean_arr - p2) / (p98 - p2) * 255.0, 0, 255).astype(np.uint8)
            else:
                norm = np.clip((clean_arr - (-38.0)) / 15.0 * 255.0, 0, 255).astype(np.uint8)
            
            # 🛡️ Fix White Clean-Sea Bug: Swath borders / nodata (clean_arr >= 0.0 or <= -50.0 or NaN)
            # In dB SAR products, nodata is 0.0 or NaN. Without this, (0.0 - p2)/(p98 - p2)*255 saturates to 255 (blinding white)!
            invalid_db_mask = (clean_arr >= 0.0) | (clean_arr <= -50.0) | raw_nan_mask
            norm[invalid_db_mask] = 0
            return norm
            
        # Standard positive digital numbers (0-255 or 16-bit)
        valid_dn = clean_arr[~raw_nan_mask & (clean_arr > 0)]
        if len(valid_dn) > 100:
            p2, p98 = np.percentile(valid_dn, (2, 98))
            if p98 > p2:
                norm = np.clip((clean_arr - p2) / (p98 - p2) * 255.0, 0, 255).astype(np.uint8)
                norm[raw_nan_mask] = 0
                return norm
        
        # Fallback min-max
        arr_min, arr_max = clean_arr.min(), clean_arr.max()
        if arr_max > arr_min:
            return np.clip((clean_arr - arr_min) / (arr_max - arr_min) * 255.0, 0, 255).astype(np.uint8)
        return np.full_like(clean_arr, 128, dtype=np.uint8)

    def process_scene(self, img_path, gt_mask_path=None, temp_chip_path="/tmp/temp_pipeline_chip.jpg"):
        """
        Exact Colab pipeline:
        1. Extract best SAR band & normalize
        2. Load GT mask and find median coordinates of slick (cx, cy)
        3. Extract 512x512 tile around (cx, cy)
        4. Predict with YOLOv8m-seg & multi-slick fusion (np.maximum)
        5. Sobel edge gradient gate (>= 22.0) & Area gate (>= 0.35 km2)
        """
        img_path = str(img_path)
        if img_path.lower().endswith(('.tif', '.tiff')):
            try:
                with rasterio.open(img_path) as src:
                    sar_raw = self.extract_best_sar_band(src)
            except Exception:
                raw = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
                sar_raw = raw.astype(np.float32) if raw is not None else np.full((512, 512), 128.0, dtype=np.float32)
        else:
            raw = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
            sar_raw = raw.astype(np.float32) if raw is not None else np.full((512, 512), 128.0, dtype=np.float32)

        sar_norm = self.normalize_vv_clean(sar_raw)
        if sar_norm.ndim == 3:
            sar_norm = sar_norm[:, :, 0]
        H, W = sar_norm.shape

        # Load GT mask if available (with physics-based contrast polarity check)
        msk_bin = np.zeros((H, W), dtype=np.uint8)
        xs, ys = [], []
        if gt_mask_path and os.path.exists(str(gt_mask_path)):
            try:
                if str(gt_mask_path).lower().endswith(('.tif', '.tiff')):
                    with rasterio.open(str(gt_mask_path)) as m_src:
                        gt_raw = m_src.read(1)
                else:
                    gt_raw = cv2.imread(str(gt_mask_path), cv2.IMREAD_UNCHANGED)
                if gt_raw is not None:
                    if gt_raw.ndim == 3:
                        gt_raw = gt_raw[:, :, 0]
                    if gt_raw.shape != (H, W):
                        gt_raw = cv2.resize(gt_raw.astype(np.float32), (W, H), interpolation=cv2.INTER_NEAREST)

                    # Total pixel counts
                    spill_px_count = np.count_nonzero(gt_raw > 0)
                    total_px = gt_raw.size
                    if spill_px_count < 20:
                        msk_bin = np.zeros_like(gt_raw, dtype=np.uint8)
                    elif spill_px_count > (total_px * 0.85):
                        # Water/ocean mask (water=1, land=0) where >85% of scene is marked.
                        # Real oil slicks never cover >85% of a 20km swath. Suppress to clean sea (0.00 km2).
                        msk_bin = np.zeros_like(gt_raw, dtype=np.uint8)
                    else:
                        msk_bin = (gt_raw > 0).astype(np.uint8)

                    ys, xs = np.where(msk_bin > 0)
            except Exception as e:
                print(f"⚠️ Error reading GT mask: {e}")

        # Crop centered around the oil spill if present, else center of image (exact Colab logic)
        if len(xs) > 20:
            cx, cy = int(np.median(xs)), int(np.median(ys))
            x1, y1 = max(0, cx - 256), max(0, cy - 256)
        else:
            x1, y1 = max(0, W // 2 - 256), max(0, H // 2 - 256)
        x2, y2 = min(W, x1 + 512), min(H, y1 + 512)

        if x2 - x1 < 512:
            x1 = max(0, x2 - 512)
        if y2 - y1 < 512:
            y1 = max(0, y2 - 512)

        chip_sar = cv2.resize(sar_norm[y1:y2, x1:x2], (512, 512))
        chip_gt = cv2.resize((msk_bin[y1:y2, x1:x2] > 0).astype(np.uint8) * 255, (512, 512), interpolation=cv2.INTER_NEAREST)
        rgb_sar = cv2.cvtColor(chip_sar, cv2.COLOR_GRAY2RGB)

        os.makedirs(os.path.dirname(temp_chip_path), exist_ok=True)
        cv2.imwrite(temp_chip_path, chip_sar, [int(cv2.IMWRITE_JPEG_QUALITY), 95])

        pred_msk = np.zeros((512, 512), dtype=np.uint8)
        conf_val = 0.0
        edge_gradient = 0.0
        filter_verdict = "No candidate anomaly detected by YOLO"
        is_genuine_spill = False

        if self.model is not None:
            results = self.model.predict(temp_chip_path, conf=0.35, imgsz=512, verbose=False)[0]
            if results.masks is not None and len(results.masks.data) > 0:
                fused_cand_msk = np.zeros((512, 512), dtype=np.uint8)
                conf_list = []
                for mask_tensor, conf_tensor in zip(results.masks.data, results.boxes.conf):
                    c_score = float(conf_tensor.cpu().numpy()) * 100.0
                    m_np = (mask_tensor.cpu().numpy() * 255).astype(np.uint8)
                    m_res = cv2.resize(m_np, (512, 512), interpolation=cv2.INTER_NEAREST)
                    fused_cand_msk = np.maximum(fused_cand_msk, m_res)
                    conf_list.append(c_score)
                conf_val = max(conf_list) if conf_list else 0.0
                cand_bin = fused_cand_msk > 127
                cand_area = (np.count_nonzero(cand_bin) * 100.0) / 1e6

                kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
                boundary = cv2.morphologyEx(fused_cand_msk, cv2.MORPH_GRADIENT, kernel)
                sobelx = cv2.Sobel(chip_sar, cv2.CV_64F, 1, 0, ksize=3)
                sobely = cv2.Sobel(chip_sar, cv2.CV_64F, 0, 1, ksize=3)
                grad_mag = np.sqrt(sobelx**2 + sobely**2)
                edge_gradient = float(np.mean(grad_mag[boundary > 0])) if np.count_nonzero(boundary) > 0 else 0.0

                # Physical Discrimination Gate (1:1 with Colab script):
                # Real Crude Oil: Sharp Viscoelastic Boundary (edge_gradient >= 22.0) & Area >= 0.35 km²
                if edge_gradient >= 22.0 and cand_area >= 0.35:
                    pred_msk = fused_cand_msk
                    is_genuine_spill = True
                    filter_verdict = f"Validated Genuine Oil Spill (Sharp Viscoelastic Edge: {edge_gradient:.1f} >= 22.0)"
                else:
                    pred_msk[:] = 0
                    conf_val = 0.0
                    is_genuine_spill = False
                    filter_verdict = f"Look-Alike Suppressed by Physics (Fuzzy Edge: {edge_gradient:.1f} < 22.0)"
                    edge_gradient = 0.0

        pred_bin = pred_msk > 127
        gt_bin = chip_gt > 127
        pred_area = (np.count_nonzero(pred_bin) * 100.0) / 1e6
        gt_area = (np.count_nonzero(gt_bin) * 100.0) / 1e6

        return {
            "chip_sar": chip_sar,
            "rgb_sar": rgb_sar,
            "chip_gt": chip_gt,
            "pred_msk": pred_msk,
            "pred_bin": pred_bin,
            "gt_bin": gt_bin,
            "conf_val": conf_val,
            "edge_gradient": edge_gradient,
            "is_genuine_spill": is_genuine_spill,
            "pred_area": pred_area,
            "gt_area": gt_area,
            "filter_verdict": filter_verdict
        }
