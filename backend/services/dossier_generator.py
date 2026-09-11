"""
Service: Court-Admissible MARPOL Evidentiary Dossier PDF Generator
"""
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class DossierGenerator:
    @staticmethod
    def generate_pdf(output_path, forensic_data, dashboard_img_path):
        """
        Builds an official, court-ready forensic incident report PDF.
        """
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        styles = getSampleStyleSheet()

        header_style = ParagraphStyle('Head', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, textColor=colors.HexColor("#0f2a4a"), alignment=1)
        sub_style = ParagraphStyle('Sub', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, textColor=colors.HexColor("#4a5568"), alignment=1)
        h2_style = ParagraphStyle('H2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10.5, textColor=colors.HexColor("#0f2a4a"), spaceBefore=7, spaceAfter=3)
        body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor("#1a202c"))

        is_genuine = forensic_data["is_genuine"]
        doc_title = "MARITIME SENTINEL | FORENSIC EVIDENTIARY DOSSIER" if is_genuine else "MARITIME SENTINEL | SECTOR RECONNAISSANCE AUDIT"
        doc_sub = "SMART INDIA HACKATHON 2026 • NTRO PROBLEM STATEMENT 26143 • ADMISSIBLE MARPOL RECORD" if is_genuine else "SMART INDIA HACKATHON 2026 • NTRO PROBLEM STATEMENT 26143 • NATURAL LOOK-ALIKE FILTER AUDIT"

        story = [
            Paragraph(doc_title, header_style),
            Paragraph(doc_sub, sub_style),
            Spacer(1, 8),
            Table([
                [Paragraph(f"<b>Dossier ID:</b> MS-2026-IND-{forensic_data.get('seed', 101):04d}", body_style), Paragraph("<b>Issuing Authority:</b> Indian Coast Guard & NTRO", body_style)],
                [Paragraph(f"<b>SAR Scene ID:</b> {forensic_data['scene_id']}", body_style), Paragraph("<b>Sensor:</b> Sentinel-1 C-SAR (VV Co-pol)", body_style)],
                [Paragraph(f"<b>Maritime Sector:</b> {forensic_data['corridor_name']}", body_style), Paragraph(f"<b>Sighting Coords:</b> {forensic_data['sighting_coords']['lat']}°N, {forensic_data['sighting_coords']['lon']}°E", body_style)],
                [Paragraph(f"<b>Metocean Source:</b> {forensic_data['metocean_source']}", body_style), Paragraph(f"<b>Drift Vector:</b> ({forensic_data['u_drift']:+.2f}, {forensic_data['v_drift']:+.2f}) m/s (-{forensic_data['drift_hours']}h)", body_style)],
                [Paragraph(f"<b>Classification:</b> {'Genuine Oil Spill' if is_genuine else 'Natural Look-Alike (Suppressed)'}", body_style),
                 Paragraph(f"<b>Surface Extent:</b> {forensic_data['area_km2']:.2f} km²" if is_genuine else "<b>Surface Extent:</b> 0.00 km² (Clean Sea)", body_style)]
            ], colWidths=[270, 270], style=[
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#edf2f7")),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e0")),
                ('TOPPADDING', (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3)
            ]),
            Spacer(1, 6),
            Paragraph("SECTION 1: SATELLITE & SENSOR ATTRIBUTION MATRIX", h2_style)
        ]

        if os.path.exists(dashboard_img_path):
            story.append(RLImage(dashboard_img_path, width=540, height=315))
            story.append(Spacer(1, 6))

        story.append(Paragraph("SECTION 2: AIS CANDIDATE FLEET SURVEILLANCE MATRIX", h2_style))

        fleet_table_data = [["Rank & Status", "Vessel Name", "IMO / MMSI", "Type", "Speed", "Dist to Origin", "Guilt %"]]
        if is_genuine:
            culprit = forensic_data["culprit"]
            fleet_table_data.append([
                "🚨 PRIMARY OFFENDER",
                culprit["vessel_name"],
                f"{culprit['imo']} / {culprit['mmsi']}",
                culprit["type"],
                f"{culprit['sog_knots']} kn",
                f"{culprit['dist_km']:.2f} km",
                f"{culprit['guilt_probability']}%"
            ])
            for idx, ship in enumerate(forensic_data["innocent_vessels"], 2):
                fleet_table_data.append([
                    f"Passer #{idx} (Clear)",
                    ship["vessel_name"],
                    f"{ship['imo']} / {ship['mmsi']}",
                    ship["type"],
                    f"{ship['sog_knots']} kn",
                    f"{ship['dist_km']:.1f} km",
                    f"{ship['guilt_probability']}%"
                ])
        else:
            for idx, ship in enumerate(forensic_data["all_vessels"], 1):
                fleet_table_data.append([
                    f"Vessel #{idx} (Cleared)",
                    ship["vessel_name"],
                    f"{ship['imo']} / {ship['mmsi']}",
                    ship["type"],
                    f"{ship['sog_knots']} kn",
                    f"{ship['dist_km']:.1f} km",
                    "0.0%"
                ])

        t_fleet = Table(fleet_table_data, colWidths=[100, 110, 95, 60, 50, 65, 60])
        t_fleet.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f2a4a")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 7.5),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e0")),
            ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#fee2e2" if is_genuine else "#f0fdf4")),
            ('TEXTCOLOR', (0,1), (-1,1), colors.HexColor("#991b1b" if is_genuine else "#166534")),
            ('FONTNAME', (0,1), (-1,1), 'Helvetica-Bold'),
            ('ROWBACKGROUNDS', (0,2), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3)
        ]))
        story.append(t_fleet)

        doc.build(story)
        return output_path
