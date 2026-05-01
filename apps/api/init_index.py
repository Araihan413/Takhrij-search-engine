import os
from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, ID, NUMERIC
from whoosh.analysis import StemmingAnalyzer

# Simple schema
schema = Schema(
    id=ID(stored=True, unique=True),
    kitab=ID(stored=True),
    bab=TEXT(stored=True),
    nomor=NUMERIC(stored=True),
    arab=TEXT(stored=True),
    terjemahan=TEXT(stored=True, analyzer=StemmingAnalyzer()),
    derajat=ID(stored=True)
)

INDEX_DIR = "../../data/index"

def init_index():
    if not os.path.exists(INDEX_DIR):
        os.makedirs(INDEX_DIR)
    
    create_in(INDEX_DIR, schema)
    print(f"Index initialized in {INDEX_DIR}")

if __name__ == "__main__":
    init_index()
