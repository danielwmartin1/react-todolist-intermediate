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
    backgroundColor: 'rgb(0 85 255)',    
    padding: '10px',
    color: 'white',
    textAlign: 'center',
    width: '100%',
    borderTop: '3px ridge aqua',
    zIndex: 1000,
    position: 'relative', // Ensure footer sticks to the bottom
    bottom: '0', // Align to the bottom
  }
};

export default Footer;
