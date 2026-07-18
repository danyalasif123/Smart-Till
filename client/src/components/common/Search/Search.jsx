import "./Search.css";

const Search = ({ value, onChange, placeholder }) => {
  return (
    <input
      className="search-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Search;