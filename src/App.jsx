import React from 'react';
import TodoListContainer from './components/TodoListContainer.jsx'; // Updated import to TodoListContainer

function App() {
  console.log('App component rendered'); // Debugging statement
  return (
    <div className="App" style={styles.app}>
      <TodoListContainer /> {/* Display TodoListContainer component */}
    </div>
  );
}

const styles = {
  app: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
};

export default App;
