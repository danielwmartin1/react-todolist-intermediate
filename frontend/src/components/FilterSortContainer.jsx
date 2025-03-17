import React from 'react';
import './FilterSortContainer.css';

const FilterSortContainer = ({ searchText, setSearchText, sortType, setSortType, sortOrder, setSortOrder }) => {
  return (
    <div className="filterSortContainer">
      <input
        type="text"
        placeholder="Search by title"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="input"
      />
      <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="select">
        <option value="created">Sort by Created</option>
        <option value="updated">Sort by Updated</option>
        <option value="completed">Sort by Completed</option>
      </select>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="select">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default FilterSortContainer;
