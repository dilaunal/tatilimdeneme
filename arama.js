```jsx
// Arama bileşeni
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Otel veya şehir ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Ara</button>
      </form>
    </div>
  );
};

// Arama sonuçları filtresi
const filterSearchResults = (hotels, searchParams) => {
  return hotels.filter(hotel => 
    hotel.price >= searchParams.minPrice &&
    hotel.price <= searchParams.maxPrice &&
    hotel.rating >= searchParams.minRating &&
    hotel.name.toLowerCase().includes(searchParams.hotelName.toLowerCase()) &&
    (!searchParams.accommodationType || hotel.type === searchParams.accommodationType)
  );
};

// Konaklama listesi arama fonksiyonu
const AccommodationList = ({ accommodations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = 
      accommodation.name.toLowerCase().includes(search
