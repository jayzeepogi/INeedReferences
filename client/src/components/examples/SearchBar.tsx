import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <SearchBar onSearch={(query) => console.log('Search:', query)} />
    </div>
  );
}
