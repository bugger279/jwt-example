require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

// So that our server can handle JSON
app.use(express.json());

const users = [
    {
        username: 'user1',
        title: 'Dev'
    },
    {
        username: 'user2',
        title: 'Dev2'
    },
];

app.get('/users', authenticateToken, (req, res) => {
    res.json(users.filter(user => user.username === req.user.name));
});

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const user = {name: username};

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken});
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // No token sent
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // Token sent but not valid
        if (err) return res.sendStatus(403);

        // Now Valid Token is send
        req.user = user;
        next();
    });
}

app.listen(4000);