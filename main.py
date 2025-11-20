from dotenv import load_dotenv
import os

load_dotenv()  # loads your .env file

deepseek_key = os.getenv("DEEPSEEK_API_KEY")
print("API key loaded:", deepseek_key is not None)
