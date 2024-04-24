import chromadb
from llama_index.core import (
  VectorStoreIndex, 
  StorageContext,
)
from llama_index.readers.pdf_table import PDFTableReader
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.chroma import ChromaVectorStore
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

llm = OpenAI(temperature=0, model="gpt-4-turbo")

reader = PDFTableReader()
pdf_path = Path("./data/syllabus.pdf")
documents = reader.load_data(file=pdf_path, pages="all")

db = chromadb.PersistentClient(path="./chroma_db")
chroma_collection = db.get_or_create_collection("quickstart")

vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

if Path("./chroma_db").exists():
    index = VectorStoreIndex.from_vector_store(
        vector_store, storage_context=storage_context
    )
    print("Loaded index from storage.")
else:
    index = VectorStoreIndex.from_documents(
        documents, storage_context=storage_context
    )

query_engine = index.as_query_engine(streaming=True, similarity_top_k=10)


@app.route("/", methods=["POST"])
def query():
    if request.is_json:
        content = request.get_json()
        query = content["query"]
        response = query_engine.query(query + "日本語で回答してください。")
        response.print_response_stream()
        print("\n")

        for node in response.source_nodes:
            print("------")
            text_fmt = node.node.get_content().strip().replace("\n", " ")[:1000]
            print(f"Text:\t {text_fmt} ...")
            print(f"Metadata:\t {node.node.metadata}")
            print(f"Score:\t {node.score:.3f}")

        return str(response), 200
    else:
        return "Request was not JSON", 400


if __name__ == "__main__":
    app.run()
