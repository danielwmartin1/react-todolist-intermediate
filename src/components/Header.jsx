import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>
        <a href="/" style={styles.link}>Todo List</a>
      </h1>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
    width: '100vw',
    borderBottom: '3px ridge aqua'
  },
  link: {
    color: 'inherit',
    textDecoration: 'none'
  }
};

export default Header;
