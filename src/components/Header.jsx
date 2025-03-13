import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1 style={{ margin: '1.5rem' }}>
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
  header: {
    backgroundColor: 'rgb(0 85 255)',
    color: 'white',
    textAlign: 'center',
    width: '100vw',
    borderBottom: '3px ridge aqua',
    zIndex: '1000',
  },
  link: {
    color: 'inherit',
    textDecoration: 'none'
  }
};

export default Header;
