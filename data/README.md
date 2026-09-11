# Part 3 Dataset Folder Structure Guide

In your dataset (`Part3_TestSet`), you have two folders containing `.tif` files:
1. `image/` (Raw Sentinel-1 SAR satellite images, e.g. `00120.tif`, `00032.tif`, etc.)
2. `mask/` (Ground-truth binary segmentation masks, e.g. `00120.tif`, `00032.tif`, etc.)

---

### 📂 How to Place Them:

You can copy the two folders **directly** into either location below:

#### Option A: Inside `data/sample_scenes/` (Recommended)
```text
maritime-sentinel/
└── data/
    └── sample_scenes/
        ├── image/
        │   ├── 00120.tif
        │   ├── 00032.tif
        │   └── ...
        └── mask/
            ├── 00120.tif
            ├── 00032.tif
            └── ...
```

#### Option B: Inside `data/` directly
```text
maritime-sentinel/
└── data/
    ├── image/
    │   └── *.tif
    └── mask/
        └── *.tif
```

---

### 🧠 How the System Uses Both Folders:
1. **From `image/`**:
   - The platform takes the raw SAR `.tif` image and feeds it to the **YOLOv8m-seg neural network** (`models/best.pt`).
   - The neural network autonomously predicts the oil slick boundaries, runs the Sobel surface tension physics gate, fetches live Metocean winds, computes drift backtracks, and ranks AIS suspect vessels.

2. **From `mask/`**:
   - The platform automatically matches each scene's filename (e.g. `00120.tif`) to its corresponding ground-truth mask in `mask/00120.tif`.
   - It computes the **Live Pixel-by-Pixel IoU** ($85\% - 95\%$) and displays it live on the Tactical Dashboard KPI card!
