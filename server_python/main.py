from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Add CORS middleware to allow cross-origin requests for permissions to test
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Retrieve the API key from environment variables
api_key = os.getenv("HF_API_KEY")
if not api_key:
    raise ValueError("HF_API_KEY not found in environment variables. Please set it in the .env file.")

# Initialize the Hugging Face Inference Client
client = InferenceClient(
    provider="cerebras",
    api_key=api_key,
)

# Define a Pydantic model for the request body
class TextPrompt(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Hugging Face Inference API! Use POST /generate to generate text."}

@app.post("/generate")
async def generate_text(request: TextPrompt):
    # Make a request to the Hugging Face Inference API
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct",
        messages=[
            {
                "role": "user",
                "content": request.prompt
            }
        ],
        max_tokens=512,
    )
    # Extract the generated text from the response
    generated_text = completion.choices[0].message.content
    return {"generated_text": generated_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)