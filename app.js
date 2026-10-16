// Demo to emulate a database returning product data to the client vis API
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const mysql = require('mysql2/promise');

app.use(express.static(path.join(__dirname, 'public'))) // Serve static web pages
app.use(express.json())

let connection;
let connectionStr = {
  host: 'localhost',
  user: 'admin',       // Remember to create a user for your database
  password: 'admin',
  database: 'store'
}

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(connectionStr);
    const dbName = connection.config.database;
    console.log(`Connected to MySQL server "${dbName}" database`); // Assure the user of the connection
  } catch (error) {
    console.error('Connection error:', error.code);
  }
}



//-------------------- ROUTES ------------------------------
// Return a unique list of all product items. e.g., laptop, phone, etc used to populate the dropdown
app.get('/products/items', async (req, res) => {
  const sql = `select distinct item from inventory`;

  try {
    // Response is an array of arrays. Element 2 is column metadata so just pull out element 1 into result which is row data
    const [result] = await connection.execute(sql); // connection.execute returns a promise
    res.json(result);                // Resolved successfully so send the promise success value
  } catch (err) {                    // Resolved to a failure
    res.status(500).send(err);       // Send the promise failed value. Wouldn't normally pass this much info to a user. Ok for testing
  }
})

// Return all products of type item unless item is 'all' then return all
app.get('/products/:item', async (req, res) => {
  // Get the field names to use as the web page table headings
  const sql = "SELECT * FROM inventory LIMIT 1";
  const [rows, fields] = await connection.execute(sql); // Columns are in the second array
  const columnNames = fields.map(f => f.name); // We only want the name part of the column metadata

  // Now get the row data
  const item = req.params.item
  if (item === 'all') {
    const [result] = await connection.execute(`select * from inventory`);
    let response = { products: result, headings: columnNames };
    res.json(response);
  } else {
    const [result] = await connection.execute(`select * from inventory where item = '${item}'`);
    res.json({ products: result, headings: columnNames }); // Return the two arrays for the caller to use for table heading and body
  }
})

// IDs of selected product are sent in the body in json
app.post('/products/purchase', async (req, res) => {
  const ids = req.body.ids // Array of product IDs
  if (ids.length == 0) return res.send('Duh! You need to choose a product to buy') // return prevents more code execution

  // ids is a array of product IDs so need to get products with those IDs only. May as well add up the prices at the same time 
  const sql = `SELECT SUM(price) AS total FROM inventory WHERE id IN (?)`;

  const [rows] = await connection.query(sql, [ids]); // Use query here not execute as it will expand the array, execute won't
  const total = rows[0].total;

  res.send(`Thank you for your purchase. Your card will be charged with £${total}`)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

connectToDatabase();
