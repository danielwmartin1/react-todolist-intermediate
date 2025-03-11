// ...existing code...
fetch('http://localhost:5001/todos')
  .then(response => response.json())
  .then(data => {
    // ...existing code...
  })
  .catch(error => {
    console.error('Error fetching todos:', error);
  });
// ...existing code...
