// Konuma göre filtreleme fonksiyonu
const filterByLocation = (hotels, location) => {
  if (!location) return hotels;
  
  return hotels.filter(hotel => 
    hotel.location.toLowerCase().includes(location.toLowerCase()) ||
    hotel.city.toLowerCase().includes(location.toLowerCase()) ||
    hotel.region.toLowerCase().includes(location.toLowerCase())
  );
};

// Konum arama bileşeni
const LocationSearch = ({ onLocationSearch }) => {
  const [location, setLocation] = useState('');

  const handleLocationSearch = (e) => {
    e.preventDefault();
    onLocationSearch(location);
  };

  return (
    <div className="location-search-container">
      <form onSubmit={handleLocationSearch}>
        <input
          type="text"
          placeholder="Konum ara..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Konum Ara</button>
      </form>
    </div>
  );
};

// Konum filtreleme sonuçları
const LocationFilterResults = ({ hotels, location }) => {
  const filteredHotels = filterByLocation(hotels, location);

  return (
    <div className="location-results">
      {filteredHotels.map(hotel => (
        <div key={hotel.id} className="hotel-card">
          <h3>{hotel.name}</h3>
          <p>Konum: {hotel.location}</p>
          <p>Şehir: {hotel.city}</p>
          <p>Bölge: {hotel.region}</p>
        </div>
      ))}
    </div>
  );
};

export { filterByLocation, LocationSearch, LocationFilterResults }; 