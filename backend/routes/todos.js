import express from 'express';
const router = express.Router();

// Define your routes here
// Example:
router.get('/', (req, res) => {
    res.send('Get all todos');
});

export default router;
