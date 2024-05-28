import chromadb
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from llama_index.readers.pdf_table import PDFTableReader
from llama_index.llms.openai import OpenAI
from llama_index.vector_stores.chroma import ChromaVectorStore
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client
import os

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

app = Flask(__name__)
CORS(app)

llm = OpenAI(temperature=0, model="gpt-4-turbo")

syllabus_db = chromadb.PersistentClient(path="./syllabus_db")
syllabus_chroma_collection = syllabus_db.get_or_create_collection("quickstart")
course_guide_db = chromadb.PersistentClient(path="./course_guide_db")
course_guide_chroma_collection = course_guide_db.get_or_create_collection("quickstart")

syllabus_vector_store = ChromaVectorStore(
    chroma_collection=syllabus_chroma_collection
)
syllabus_storage_context = StorageContext.from_defaults(
    vector_store=syllabus_vector_store
)
course_guide_vector_store = ChromaVectorStore(
    chroma_collection=course_guide_chroma_collection
)
course_guide_storage_context = StorageContext.from_defaults(
    vector_store=course_guide_vector_store
)

if True:
    syllabus_index = VectorStoreIndex.from_vector_store(
        syllabus_vector_store, storage_context=syllabus_storage_context
    )
    course_guide_index = VectorStoreIndex.from_vector_store(
        course_guide_vector_store, storage_context=course_guide_storage_context
    )
    print("Loaded index from storage.")
else:
    reader = PDFTableReader()
    syllabus_path = Path("./data/syllabus.pdf")
    syllabus = reader.load_data(file=syllabus_path, pages="5-477")

    reader = SimpleDirectoryReader(input_files=["./data/rishu-tebiki.pdf"])
    course_guide_path = Path("./data/rishu-tebiki.pdf")
    course_guide = reader.load_data()

    syllabus_index = VectorStoreIndex.from_documents(
        syllabus, storage_context=syllabus_storage_context
    )
    course_guide_index = VectorStoreIndex.from_documents(
        course_guide, storage_context=course_guide_storage_context
    )
    print("Created index from documents.")

syllabus_query_engine = syllabus_index.as_query_engine(
    streaming=True,
    similarity_top_k=1
)

course_guide_query_engine = course_guide_index.as_query_engine(
    streaming=True,
    similarity_top_k=1
)


@app.route("/syllabus", methods=["POST"])
def syllabus():
    if request.is_json:
        content = request.get_json()
        user_id = content["user_id"]
        query = content["query"]
        response = syllabus_query_engine.query(query + "日本語で回答してください。")
        response.print_response_stream()
        print("\n")

        for node in response.source_nodes:
            print("------")
            text_fmt = node.node.get_content().strip().replace("\n", " ")[:1000]
            print(f"Text:\t {text_fmt} ...")
            print(f"Metadata:\t {node.node.metadata}")
            print(f"Score:\t {node.score:.3f}")

        if user_id:
            supabase.table('histories').insert({
                'user_id': user_id,
                'query': query,
                'response': str(response),
                'page': "",
                'score': node.score,
            }).execute()

        result = {
            "response": str(response),
            "page": "",
            "score": node.score,
        }

        return jsonify(result), 200
    else:
        return "Request was not JSON", 400


@app.route("/course_guide", methods=["POST"])
def course_guide():
    if request.is_json:
        content = request.get_json()
        user_id = content["user_id"]
        query = content["query"]
        response = course_guide_query_engine.query(query + "日本語で回答してください。")
        response.print_response_stream()
        print("\n")

        for node in response.source_nodes:
            print("------")
            text_fmt = node.node.get_content().strip().replace("\n", " ")[:1000]
            print(f"Text:\t {text_fmt} ...")
            print(f"Metadata:\t {node.node.metadata}")
            print(f"Score:\t {node.score:.3f}")

        if user_id:
            supabase.table('histories').insert({
                'user_id': user_id,
                'query': query,
                'response': str(response),
                'page': node.node.metadata["page_label"],
                'score': node.score,
            }).execute()

        result = {
            "response": str(response),
            "page": node.node.metadata["page_label"],
            "score": node.score,
        }

        return jsonify(result), 200
    else:
        return "Request was not JSON", 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
