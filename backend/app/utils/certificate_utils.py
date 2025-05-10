import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import re

pytesseract.pytesseract.tesseract_cmd = r"C:\Users\rjennings\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"

def extract_business_name_and_reg_no(image_path: str) -> dict:
    try:
        # Preprocess image
        image = Image.open(image_path).convert("L")
        image = image.filter(ImageFilter.SHARPEN)
        image = ImageEnhance.Contrast(image).enhance(2)

        text = pytesseract.image_to_string(image)
        text = text.replace("\n", " ").lower()

        #print("\n[OCR RAW TEXT]\n", text, "\n")

        details = {
            "business_name": None,
            "registration_number": None
        }

        # Match reg number like 4913/2015
        reg_match = re.search(r"(registration|reg)\s*no\.?\s*[:\-]?\s*(\d{3,6}/\d{2,4})", text)
        if reg_match:
            details["registration_number"] = reg_match.group(2).strip()

        # Match phrase after "the business name:"
        name_match = re.search(
            r"the\s+business\s+name\s*[:\-]?\s*[\"'“”‘’]?([a-z0-9\s&.,'\"-]{3,})[\"'“”‘’]?",
            text
        )
        if name_match:
            details["business_name"] = name_match.group(1).strip().title()

        return details

    except Exception as e:
        print("OCR extraction error:", e)
        return {"business_name": None, "registration_number": None}
