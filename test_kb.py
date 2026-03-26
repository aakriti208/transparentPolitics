import boto3
import json
from dotenv import load_dotenv
import os

load_dotenv()

AWS_REGION     = os.getenv("AWS_REGION")
KB_ID          = os.getenv("BEDROCK_KB_ID")
MODEL_ID       = os.getenv("BEDROCK_MODEL_ID")

agent_client = boto3.client("bedrock-agent-runtime", region_name=AWS_REGION)

SYSTEM_PROMPT = """You are a nonpartisan political explainer for Transparent Politics.
Answer ONLY based on the provided documentation.
Use simple language a high schooler can understand.
Never take political sides or tell users who to vote for.
If the answer is not in the documentation, say: "I don't have that information yet."
Keep answers under 150 words."""

bedrock_client = boto3.client("bedrock-runtime", region_name=AWS_REGION)

def ask_politics(question):
    # Step 1 — retrieve relevant chunks from KB
    retrieval = agent_client.retrieve(
        knowledgeBaseId=KB_ID,
        retrievalQuery={"text": question},
        retrievalConfiguration={
            "vectorSearchConfiguration": {"numberOfResults": 3}
        }
    )

    # Build context from retrieved chunks
    chunks = retrieval.get("retrievalResults", [])
    context = "\n\n".join([
        f"Source: {r['location']['s3Location']['uri']}\n{r['content']['text']}"
        for r in chunks
    ])

    # Step 2 — send context + question to Claude
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
    sources = list(set([r["location"]["s3Location"]["uri"] for r in chunks]))

    return {"answer": answer, "sources": sources}

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