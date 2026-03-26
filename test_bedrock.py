import boto3

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
modelId="us.anthropic.claude-sonnet-4-6",
messages=[{"role": "user", "content": [{"text": "Say hello in one sentence."}]}]
)

print(response["output"]["message"]["content"][0]["text"])