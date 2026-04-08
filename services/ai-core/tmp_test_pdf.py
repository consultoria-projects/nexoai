import pdfplumber
import json

pdf_path = "data_extraction_lab/docs-to-analisys/DETALLES CONSTRUCTIVOS (3).pdf"

with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[0]
    
    lines = page.lines
    rects = page.rects
    curves = page.curves
    texts = page.extract_words()
    
    print("--- PDF VECTOR ANALYSIS ---")
    print(f"Total Pages: {len(pdf.pages)}")
    print(f"Page Width: {page.width}, Page Height: {page.height}")
    print(f"Lines found: {len(lines)}")
    print(f"Rectangles found: {len(rects)}")
    print(f"Curves found: {len(curves)}")
    print(f"Text words found: {len(texts)}")
    
    print("\n--- SAMPLE TEXTS ---")
    for t in texts[:10]:
        # pdfplumber extract_words returns x0, top, x1, bottom
        print(f"Text: '{t['text']}' at (x0: {t['x0']:.2f}, top: {t['top']:.2f})")
        
    print("\n--- SEARCHING FOR MEASUREMENT TEXTS (m2, cm, m) ---")
    measure_texts = [t for t in texts if 'm2' in t['text'].lower() or ' m ' in t['text'].lower() or 'cm' in t['text'].lower()]
    for t in measure_texts[:10]:
        print(f"Match: '{t['text']}' at (x0: {t['x0']:.2f}, top: {t['top']:.2f})")
        
    print("\n--- SAMPLE LINES ---")
    for l in lines[:5]:
        print(f"Line from ({l['x0']:.2f}, {l['y0']:.2f}) to ({l['x1']:.2f}, {l['y1']:.2f})")
