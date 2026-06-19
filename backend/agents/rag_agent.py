import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class RAGAgent:
    def __init__(self):
        # We will store the vector db locally in backend/chroma_db
        self.persist_directory = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001", 
                google_api_key=api_key
            )
            # Initialize ChromaDB without strictly requiring it to be populated initially
            self.vector_store = Chroma(
                persist_directory=self.persist_directory,
                embedding_function=self.embeddings,
                collection_name="ecommerce_products"
            )
        else:
            self.embeddings = None
            self.vector_store = None

    def retrieve_similar_products(self, query: str, k: int = 3) -> str:
        """Searches the vector store for similar products and formats them as context."""
        if not self.vector_store:
            return "No RAG database available (missing API key or not initialized)."

        try:
            # Check if there are any documents in the DB
            if self.vector_store._collection.count() == 0:
                return "RAG database is empty. Please run the ingestion script first."

            docs = self.vector_store.similarity_search(query, k=k)
            
            if not docs:
                return "No similar products found in database."

            context = "SIMILAR MARKET PRODUCTS (From RAG Database):\n"
            for i, doc in enumerate(docs):
                context += f"--- Product {i+1} ---\n"
                context += f"Name: {doc.metadata.get('product_name', 'Unknown')}\n"
                context += f"Brand: {doc.metadata.get('brand', 'Unknown')}\n"
                context += f"Retail Price: {doc.metadata.get('retail_price', 'Unknown')}\n"
                context += f"Discounted Price: {doc.metadata.get('discounted_price', 'Unknown')}\n"
                context += f"Description: {doc.page_content}\n\n"
            
            return context
        except Exception as e:
            return f"Error retrieving from RAG database: {str(e)}"
