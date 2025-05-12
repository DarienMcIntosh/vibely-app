from app.utils.certificate_utils import extract_business_name_and_reg_no

if __name__ == "__main__":
    image_path = "sample_cert.png"
    result = extract_business_name_and_reg_no(image_path)
    print("Extracted Business Info:")
    print("Business Name:", result.get("business_name"))
    print("Registration Number:", result.get("registration_number"))
