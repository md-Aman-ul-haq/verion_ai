import os
import requests

api_key = os.environ.get('GROQ_API_KEY')
if not api_key:
    # Try reading from .env
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get('GROQ_API_KEY')

headers = {'Authorization': f'Bearer {api_key}'}
res = requests.get('https://api.groq.com/openai/v1/models', headers=headers).json()

models = [m['id'] for m in res.get('data', [])]
print("Available models:", models)
