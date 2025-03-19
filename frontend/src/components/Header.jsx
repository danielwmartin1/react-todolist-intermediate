import React from 'react';
import './Header.css';
import './TodoListMediaQueries.css';

const Header = () => {
  return (
    <header className="header">
      <h1 style={{ margin: '1.2rem' }}>
        <a href="/" style={styles.link}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src="/react.svg" alt="icon" style={{ width: '100px', marginRight: '1rem' }} />
            Intermediate To-Do List
          </span>
        </a>
      </h1>
    </header>
  );
};

const styles = {
  link: {
    color: 'inherit',
    textDecoration: 'none' // Ensure the link inherits the default text color
  }
};

export default Header;
