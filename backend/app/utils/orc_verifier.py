from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def verify_with_orc(business_name: str, reg_no: str) -> bool:
    try:
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(options=options)
        driver.get("https://www.orcjamaica.com/CompanySearch.aspx")

        # Fill in the registration number
        input_box = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//input[@name="ctl00$Space$org_name"]'))
        )
        input_box.clear()
        input_box.send_keys(reg_no)

        # Click the search button
        search_button = driver.find_element(By.XPATH, '//button[text()=" Start Search"]')
        search_button.click()

        # Wait for results to appear
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//table[contains(@class, "dataTable")]//tr'))
        )

        # Locate the first row in the result table
        row = driver.find_element(By.XPATH, '//table[contains(@class, "dataTable")]//tbody/tr')

        # Extract individual columns
        cells = row.find_elements(By.TAG_NAME, 'td')
        reg_value = cells[0].text.strip()
        status_value = cells[3].text.strip().lower()

        print(f"Registration match: {reg_value == reg_no}, Status: {status_value}")

        driver.quit()
        return reg_value == reg_no and status_value == "registered"

    except Exception as e:
        print("Selenium ORC verification error:", e)
        driver.quit()
        return False
