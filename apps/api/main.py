import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from whoosh.index import open_dir, exists_in
from whoosh.qparser import MultifieldParser, OrGroup
from whoosh.highlight import HtmlFormatter, ContextFragmenter
from analyzers import IndonesianStemFilter

app = FastAPI(title="Takhrij API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

INDEX_DIR = os.getenv("INDEX_DIR", "../../data/index")

def get_index():
    if not exists_in(INDEX_DIR):
        return None
    return open_dir(INDEX_DIR)

@app.get("/")
async def root():
    return {"message": "Takhrij API is running"}

@app.get("/search")
async def search(
    q: str = Query(..., min_length=1),
    kitab: str = None,
    page: int = 1,
    hitsPerPage: int = 20
):
    ix = get_index()
    if not ix:
        return {"hits": [], "total": 0, "error": "Index not found"}

    with ix.searcher() as searcher:
        # Menggunakan OrGroup agar pencarian lebih fleksibel (tidak harus semua kata cocok)
        parser = MultifieldParser(["arab", "terjemahan"], ix.schema, group=OrGroup)
        query = parser.parse(q)
        
        # Add filter for kitab if provided
        filter_obj = None
        if kitab:
            from whoosh.query import Term
            filter_obj = Term("kitab", kitab)

        results = searcher.search_page(query, page, pagelen=hitsPerPage, filter=filter_obj)
        
        # Calculate facet counts for 'kitab'
        from whoosh.searching import ResultsPage
        # Whoosh doesn't return facet counts in search_page easily, so we do a quick count search
        facet_counts = {}
        if page == 1: # Only calculate facets on the first page or once
            from whoosh import sorting
            all_results = searcher.search(query, groupedby=sorting.FieldFacet("kitab"))
            facet_counts = all_results.groups("kitab")
            facet_counts = {k.decode('utf-8') if isinstance(k, bytes) else k: len(v) for k, v in facet_counts.items()}

        # Highlighting setup
        results.formatter = HtmlFormatter(tagname="mark")
        results.fragmenter = ContextFragmenter(surround=30)

        hits = []
        for hit in results:
            hits.append({
                "id": hit["id"],
                "kitab": hit["kitab"],
                "bab": hit.get("bab", ""),
                "nomor": hit["nomor"],
                "arab": hit.highlights("arab") or hit["arab"][:100],
                "terjemahan": hit.highlights("terjemahan") or hit["terjemahan"][:100],
                "derajat": hit.get("derajat", "")
            })

        # Suggestion (Did you mean?)
        suggestion = None
        try:
            corrected = searcher.correct_query(query, q)
            if corrected.query != query:
                suggestion = corrected.string
        except:
            pass

        return {
            "hits": hits,
            "total": results.total,
            "page": page,
            "hitsPerPage": hitsPerPage,
            "facets": {
                "kitab": facet_counts
            },
            "suggestion": suggestion
        }

@app.get("/similar/{doc_id}")
async def similar(doc_id: str):
    ix = get_index()
    if not ix:
        return {"hits": []}

    with ix.searcher() as searcher:
        try:
            # Find the original document
            from whoosh.query import Term
            doc_num = searcher.document_number(id=doc_id)
            if doc_num is None:
                return {"hits": []}
            
            # Use MoreLikeThis
            results = searcher.more_like(doc_num, "terjemahan", top=5)
            
            hits = []
            for hit in results:
                hits.append({
                    "id": hit["id"],
                    "kitab": hit["kitab"],
                    "bab": hit.get("bab", ""),
                    "nomor": hit["nomor"],
                    "arab": hit["arab"],
                    "terjemahan": hit["terjemahan"],
                    "derajat": hit.get("derajat", "")
                })
            return {"hits": hits}
        except Exception as e:
            return {"hits": [], "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
