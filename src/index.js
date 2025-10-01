const express = require('express');
const { v4: uuidv4 } = require('uuid'); // for unique IDs

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Implementation

// In-memory user storage
let users = [];

// 1. Create a User
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = { id: uuidv4(), name, email };
    users.push(newUser);

    res.status(201).json(newUser);
});

// 2. Retrieve a User
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
});

// 3. Update a User
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    const user = users.find(u => u.id === req.params.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    user.name = name;
    user.email = email;

    res.status(200).json(user);
});

// 4. Delete a User
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(index, 1);
    res.status(204).send();
});

// **************************************************************
// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // export for testing

