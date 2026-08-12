require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log(result.rows[0]);
    client.release();
}

testConnection();


const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('QuizForge API is running')
});

app.listen(PORT, () => {
    console.log(`Server  running on http://localhost:${PORT}`)
});

app.get('/api/quizzes', async (req, res) => {
    let client;
    try{
        client = await pool.connect();
        const quizzes = await client.query('SELECT*FROM quizzes');
        res.json(quizzes.rows);
    } catch (e){
        console.error(e);
        res.status(500).json('Error getting quizzes');
    } finally {
        if(client){
            client.release();
        }
    }

})