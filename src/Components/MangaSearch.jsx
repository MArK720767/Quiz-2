import React, { useState, useEffect } from 'react';


function MangaSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('Naruto');
  const [mangaList, setMangaList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchManga = async () => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await response.json();
      setMangaList(data.data || []);
      setHasNextPage(data.pagination?.has_next_page || false);
    } catch (error) {
      console.error('Failed to fetch manga:', error);
    }
  };

  useEffect(() => {
    fetchManga();
  }, [query, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() === '') return;
    setQuery(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="manga-search-container">
      <h1>MangaKulangot</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a manga..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {mangaList.length > 0 ? (
        <>
          <ul className="book-list">
            {mangaList.slice(0, 10).map((manga) => (
              <li key={manga.mal_id} className="book-item">
                <strong>{manga.title}</strong>
                {manga.authors?.[0]?.name && ` by ${manga.authors[0].name}`}
              </li>
            ))}
          </ul>

          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              ⬅ Previous
            </button>
            <span>
              Page {page}
            </span>
            <button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage}>
              Next ➡
            </button>
          </div>
        </>
      ) : query ? (
        <p>No results found for "{query}".</p>
      ) : (
        <p>Enter a manga title to begin your search.</p>
      )}
    </div>
  );
}

export default MangaSearch;
