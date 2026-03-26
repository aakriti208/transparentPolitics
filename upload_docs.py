import boto3
import os

BUCKET_NAME = "transparent-politics-docs-knowledgebase"  
DOCS_FOLDER = "political_docs"

s3 = boto3.client("s3", region_name="us-east-1")

def upload_all_docs():
    uploaded = []
    for root, dirs, files in os.walk(DOCS_FOLDER):
        for filename in files:
            if filename.endswith(".txt") or filename.endswith(".pdf"):
                local_path = os.path.join(root, filename)
                # preserve subfolder structure in S3
                s3_key = local_path.replace("\\", "/")
                s3.upload_file(local_path, BUCKET_NAME, s3_key)
                uploaded.append(s3_key)
                print(f"Uploaded: {s3_key}")
    print(f"\nDone. {len(uploaded)} files uploaded.")

upload_all_docs()