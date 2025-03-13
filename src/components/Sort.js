import React from 'react';

const Sort = ({ sortType, setSortType, sortOrder, setSortOrder, todos, setFilteredTodos, searchText, filterTodos, sortTodos }) => {

    const handleSortChange = (e) => {
        setSortType(e.target.value);
        const filteredTodos = filterTodos(todos, searchText);
        const sortedTodos = sortTodos(filteredTodos, e.target.value, sortOrder);
        setFilteredTodos(sortedTodos);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        const filteredTodos = filterTodos(todos, searchText);
        const sortedTodos = sortTodos(filteredTodos, sortType, e.target.value);
        setFilteredTodos(sortedTodos);
    };

    return (
        <div className="sort">
            <select value={sortType} onChange={handleSortChange}>
                <option value="created">Created</option>
                <option value="updated">Updated</option>
                <option value="completed">Completed</option>
            </select>
            <select value={sortOrder} onChange={handleSortOrderChange}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
    );
};

export default Sort;
