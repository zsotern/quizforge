require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createSQLTables= `
    CREATE TABLE users(
    id UUID PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
    );
    
    CREATE TABLE quizzes (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    allow_back_track BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id)
    );
    
    CREATE TABLE questions(
    id UUID PRIMARY KEY,
    text VARCHAR NOT NULL,
    quiz_id UUID REFERENCES quizzes(id),
    explanation VARCHAR
    );
    
    
    CREATE TABLE answers (
    id UUID PRIMARY KEY,
    text VARCHAR NOT NULL,
    question_id UUID REFERENCES questions(id),
    is_correct BOOLEAN DEFAULT FALSE
    );
    
    CREATE TABLE quizAttempts (
    id UUID PRIMARY KEY,
    quiz_id UUID REFERENCES quizzes(id),
    start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finish TIMESTAMP,
    user_id UUID REFERENCES users(id)
    );
    
    CREATE TABLE questionResults (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    answer_id UUID REFERENCES answers(id),
    is_correct BOOLEAN DEFAULT FALSE,
    attempt_id UUID REFERENCES quizAttempts(id)
    );

`;

pool.query(createSQLTables)
    .then(() => console.log('Táblák sikeresen létrehozva!'))
    .catch(err => console.error('Hiba történt:', err));