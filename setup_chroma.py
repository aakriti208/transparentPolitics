import chromadb
import os

# Create a local persistent ChromaDB database
client = chromadb.PersistentClient(path="./chroma_db")

# Create a collection for your political docs
collection = client.get_or_create_collection(name="transparent_politics")

def load_docs(folder="political_docs"):
    docs, ids, metadatas = [], [], []
    for root, dirs, files in os.walk(folder):
        for filename in files:
            if filename.endswith(".txt"):
                filepath = os.path.join(root, filename)
                with open(filepath, "r") as f:
                    text = f.read()
                # Split into chunks of ~500 characters
                chunks = [text[i:i+500] for i in range(0, len(text), 500)]
                for i, chunk in enumerate(chunks):
                    docs.append(chunk)
                    ids.append(f"{filename}-chunk-{i}")
                    metadatas.append({"source": filepath})
    return docs, ids, metadatas

docs, ids, metadatas = load_docs()
collection.upsert(documents=docs, ids=ids, metadatas=metadatas)
print(f"Indexed {len(docs)} chunks from your political docs.")