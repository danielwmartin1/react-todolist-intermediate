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
    color: 'white',
    textAlign: 'center',
    width: '100%',
    borderTop: '3px ridge aqua',
    position: 'relative', // Ensure footer sticks to the bottom
    bottom: '0', // Align to the bottom
  }
};

export default Footer;
