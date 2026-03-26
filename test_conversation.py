import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

SYSTEM = "You are a nonpartisan political explainer. Use simple, clear language. Never take sides."

history = []

def chat(user_message):
    history.append({
        "role": "user",
        "content": [{"text": user_message}]
    })
    
    response = client.converse(
        modelId="us.anthropic.claude-sonnet-4-6",
        system=[{"text": SYSTEM}],
        messages=history,
        inferenceConfig={"maxTokens": 500, "temperature": 0.3}
    )
    
    reply = response["output"]["message"]["content"][0]["text"]
    history.append({
        "role": "assistant",
        "content": [{"text": reply}]
    })
    return reply

# Test a 3-turn political conversation
print(chat("What is the filibuster?"))
print("---")
print(chat("How is it used in modern politics?"))
print("---")
print(chat("Can it be removed?"))