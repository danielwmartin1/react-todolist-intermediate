import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Daniel Martin &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#282c34',
    padding: '10px',
    color: 'white',
    textAlign: 'center',
    width: '100%',
    borderTop: '3px ridge aqua'
  }
};

export default Footer;
