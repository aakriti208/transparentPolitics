import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

SYSTEM = """You are a nonpartisan political explainer for Transparent Politics.

Your rules:
- Use simple language a high schooler can understand
- Never express opinions or take political sides
- Always explain WHY something matters to everyday people
- Keep answers under 150 words
- If asked who to vote for or which party is better, politely decline"""

def ask(question):
    response = client.converse(
        modelId="anthropic.claude-sonnet-4-6",
        system=[{"text": SYSTEM}],
        messages=[{"role": "user", "content": [{"text": question}]}],
        inferenceConfig={"maxTokens": 300, "temperature": 0.3}
    )
    return response["output"]["message"]["content"][0]["text"]

# Test 1 — normal political question
print("Q1:", ask("What is the national debt?"))
print("---")

# Test 2 — jargon explanation
print("Q2:", ask("What does bipartisan mean?"))
print("---")

# Test 3 — should politely refuse
print("Q3:", ask("Which party should I vote for?"))