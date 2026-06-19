import os
import sys
import pandas as pd
from dotenv import load_dotenv

# Ensure we can import from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

from langchain_core.documents import Document
from agents.rag_agent import RAGAgent

def ingest_kaggle_csv(csv_path: str, max_rows: int = 100):
    """
    Ingests a CSV dataset into the ChromaDB vector store.
    Designed for the 'Flipkart E-Commerce Dataset' or similar Kaggle datasets.
    """
    if not os.path.exists(csv_path):
        print(f"Error: Could not find {csv_path}")
        print("Please download the dataset from Kaggle (e.g., 'Flipkart E-Commerce Dataset') and place it here.")
        return

    print(f"Loading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # Clean up and limit rows for prototyping speed
    # Assuming columns like: product_name, description, retail_price, discounted_price, brand
    df = df.dropna(subset=['description']).head(max_rows)
    
    rag_agent = RAGAgent()
    if not rag_agent.vector_store:
        print("Error: Could not initialize RAG Agent. Check your GEMINI_API_KEY in .env")
        return

    docs = []
    for _, row in df.iterrows():
        # Fallbacks in case the CSV has slightly different column names
        name = row.get('product_name', row.get('title', 'Unknown Product'))
        desc = str(row.get('description', ''))
        brand = str(row.get('brand', 'Unknown'))
        retail_price = str(row.get('retail_price', row.get('price', 'Unknown')))
        discounted_price = str(row.get('discounted_price', 'Unknown'))
        
        metadata = {
            "product_name": str(name),
            "brand": brand,
            "retail_price": retail_price,
            "discounted_price": discounted_price
        }
        
        # We embed the description and name
        page_content = f"{name}\n{desc}"
        docs.append(Document(page_content=page_content, metadata=metadata))

    print(f"Adding {len(docs)} products to ChromaDB...")
    rag_agent.vector_store.add_documents(docs)
    print("Ingestion complete! The RAG database is ready.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Ingest Kaggle E-Commerce CSV into ChromaDB")
    parser.add_argument("csv_path", help="Path to the dataset CSV file")
    parser.add_argument("--rows", type=int, default=100, help="Number of rows to ingest")
    args = parser.parse_args()
    
    ingest_kaggle_csv(args.csv_path, max_rows=args.rows)
