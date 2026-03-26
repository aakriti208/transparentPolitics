import boto3
import json

client = boto3.client("bedrock-runtime", region_name="us-east-1")

SYSTEM = """You are a nonpartisan political explainer for Transparent Politics.

Always respond in valid JSON with exactly these keys:
- summary: a 2-3 sentence plain English explanation
- why_it_matters: one sentence on how this affects everyday people
- key_terms: list of 2-3 important words from your answer with one-line definitions
- confidence: "high", "medium", or "low" based on how well-documented the topic is

Return ONLY the JSON object. No intro text, no markdown, no code blocks."""

def ask(question):
    response = client.converse(
        modelId="us.anthropic.claude-sonnet-4-6",
        system=[{"text": SYSTEM}],
        messages=[{"role": "user", "content": [{"text": question}]}],
        inferenceConfig={"maxTokens": 400, "temperature": 0.1}
    )
    raw = response["output"]["message"]["content"][0]["text"]
    
    # parse and pretty print
    parsed = json.loads(raw)
    return parsed

# Test it
result = ask("What is the War Powers Resolution of 1973?")

print("Summary:", result["summary"])
print("Why it matters:", result["why_it_matters"])
print("Key terms:")
for term in result["key_terms"]:
    print(" -", term)
print("Confidence:", result["confidence"])