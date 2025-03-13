import React, { useState } from 'react';
import Sort from './Sort';

const Filter = ({ todos, setFilteredTodos }) => {
    const [searchText, setSearchText] = useState('');
    const [sortType, setSortType] = useState('created');
    const [sortOrder, setSortOrder] = useState('asc');

    const filterTodos = (todos, searchText) => {
        return todos.filter(todo => todo.text.toLowerCase().includes(searchText.toLowerCase()));
    };

    const sortTodos = (todos, sortType, sortOrder) => {
        return todos.slice().sort((a, b) => {
            let comparison = 0;
            if (sortType === 'created') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortType === 'updated') {
                comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
            } else if (sortType === 'completed') {
                comparison = new Date(a.completedAt) - new Date(b.completedAt);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    };

    const handleFilterChange = (e) => {
        setSearchText(e.target.value);
        const filteredTodos = filterTodos(todos, e.target.value);
        const sortedTodos = sortTodos(filteredTodos, sortType, sortOrder);
        setFilteredTodos(sortedTodos);
    };

    return (
        <div className="filter">
            <input
                type="text"
                placeholder="Search todos"
                value={searchText}
                onChange={handleFilterChange}
            />
            <Sort
                sortType={sortType}
                setSortType={setSortType}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                todos={todos}
                setFilteredTodos={setFilteredTodos}
                searchText={searchText}
                filterTodos={filterTodos}
                sortTodos={sortTodos}
            />
        </div>
    );
};

export default Filter;
