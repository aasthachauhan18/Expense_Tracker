require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DB = require('./config/db');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

const PORT = 5008;
DB().then(() => {
  app.listen(PORT, async () => {
    const http = require('http');
    const mongoose = require('mongoose');
    const email = 'flowtest' + Date.now() + '@test.com';

    function request(method, path, headers, body) {
      return new Promise((resolve, reject) => {
        const opts = { hostname: '127.0.0.1', port: PORT, path, method, headers: headers || {} };
        const req = http.request(opts, (res) => {
          let data = '';
          res.on('data', c => data += c);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
      });
    }

    // Register
    let res = await request('POST', '/api/auth/register', { 'Content-Type': 'application/json' },
      JSON.stringify({ name: 'FlowTest', email, password: '123456' }));
    console.log('Register:', res.status, res.body);
    if (res.status !== 201) { console.log('FAIL'); process.exit(1); }

    const token = JSON.parse(res.body).token;
    const userId = JSON.parse(res.body).user.id;

    // Create expense
    res = await request('POST', '/api/expenses', { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      JSON.stringify({ title: 'Office Lunch', amount: 25.50, category: 'Food', date: new Date().toISOString(), description: 'Team lunch' }));
    console.log('Create expense:', res.status, res.body);
    if (res.status !== 201) { console.log('FAIL'); process.exit(1); }

    // Get expenses
    res = await request('GET', '/api/expenses', { 'Authorization': 'Bearer ' + token });
    console.log('Get expenses:', res.status, res.body);

    // Check MongoDB directly
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({ email }).toArray();
    console.log('User in DB:', users.length > 0 ? 'YES' : 'NO');
    const expenses = await db.collection('expenses').find({ user: mongoose.Types.ObjectId.createFromHexString(userId) }).toArray();
    console.log('Expenses in DB:', expenses.length);

    process.exit(0);
  });
});
