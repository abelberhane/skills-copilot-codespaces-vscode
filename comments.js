// Create web server
const express = require('express');
const app = express();
const port = 3000;

// Create a connection to the MySQL database
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost  ',  // The host name of the MySQL server   
    user: 'root
    password: 'password',
    database: 'comments'
});

// Create a table to store the comments
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server');
    const sql = 'CREATE TABLE IF NOT EXISTS comments (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), comment TEXT)';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Table created');
    });
});

// Serve the static files in the public directory
app.use(express.static('public'));

// Parse the request body as JSON
app.use(express.json());

// Handle GET requests to /comments
app.get('/comments', (req, res) => {
    // Select all the comments from the database
    connection.query('SELECT * FROM comments', (err, rows) => {
        if (err) throw err;
        // Send the comments as a JSON response
        res.json(rows);
    });
});

// Handle POST requests to /comments
app.post('/comments', (req, res) => {
    // Insert the comment into the database
    connection.query('INSERT INTO comments (name, comment) VALUES (?, ?)', [req.body.name, req.body.comment], (err, result) => {
        if (err) throw err;
        // Send the result as a JSON response
        res.json(result);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle SIGINT signal to close the database connection
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(err);
    connection.end();
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(err);
    connection.end();
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(err);
    connection.end();
    process.exit(1);
});

