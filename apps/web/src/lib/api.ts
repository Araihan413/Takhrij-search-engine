const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function searchHadis(query: string, page = 1, hitsPerPage = 20, kitab?: string) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    hitsPerPage: hitsPerPage.toString(),
  });
  
  if (kitab) params.append('kitab', kitab);

  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function getSimilarHadis(docId: string) {
  const res = await fetch(`${API_BASE_URL}/similar/${docId}`);
  if (!res.ok) throw new Error('Failed to fetch similar hadis');
  return res.json();
}
