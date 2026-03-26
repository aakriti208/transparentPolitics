import boto3
import chromadb
from dotenv import load_dotenv
import os

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
MODEL_ID   = os.getenv("BEDROCK_MODEL_ID")

# Local ChromaDB instead of Bedrock KB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection     = chroma_client.get_collection("transparent_politics")

# Bedrock for generating answers (still uses AWS)
bedrock_client = boto3.client("bedrock-runtime", region_name=AWS_REGION)

SYSTEM_PROMPT = """You are a nonpartisan political explainer for Transparent Politics.
Answer ONLY based on the provided documentation.
Use simple language a high schooler can understand.
Never take political sides or tell users who to vote for.
If the answer is not in the documentation, say: "I don't have that information yet."
Keep answers under 150 words."""

def ask_politics(question):
    # Step 1 — retrieve from local ChromaDB
    results = collection.query(
        query_texts=[question],
        n_results=3
    )

    chunks    = results["documents"][0]
    sources   = [m["source"] for m in results["metadatas"][0]]
    context   = "\n\n".join(chunks)

    # Step 2 — send to Claude via Bedrock
    response = bedrock_client.converse(
        modelId=MODEL_ID,
        system=[{"text": SYSTEM_PROMPT}],
        messages=[{
            "role": "user",
            "content": [{"text": f"Context:\n{context}\n\nQuestion: {question}"}]
        }],
        inferenceConfig={"maxTokens": 300, "temperature": 0.3}
    )

    answer = response["output"]["message"]["content"][0]["text"]

    return {
        "answer":  answer,
        "sources": list(set(sources))
    }

# Test questions
questions = [
    "What is the filibuster?",
    "What did the Inflation Reduction Act do for healthcare?",
    "How does a bill become law?",
    "Who should I vote for?"
]

for q in questions:
    print(f"\nQ: {q}")
    result = ask_politics(q)
    print(f"A: {result['answer']}")
    print(f"Sources: {result['sources']}")
    print("-" * 50)