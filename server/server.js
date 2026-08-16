require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

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
});

app.get('/api/quizzes/:id', async (req, res) => {
    let client;
    try{
        client = await pool.connect();
        const id = req.params.id;
        const quizResult = await client.query('SELECT*FROM quizzes WHERE id=$1', [id]);
        const quiz = quizResult.rows[0];
        const questions = await client.query('SELECT*FROM questions WHERE quiz_id=$1', [quiz.id]);
        const questionsWithAnswers = await Promise.all(questions.rows.map(async question => {
            const answerResult = await client.query('SELECT*FROM answers WHERE question_id=$1', [question.id]);
            question.answers = answerResult.rows;
            return question;
        }));
        quiz.questions = questionsWithAnswers;
        res.json(quiz);
    }catch(err){
        console.error(err);
        res.status(500).json('Error getting quizzes');
    } finally {
        if(client){
            client.release();
        }
    }
});

app.post('/api/quizzes', async (req, res) => {
    const { id, title, allowBackTrack, questions } = req.body;

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query('INSERT INTO quizzes (id, title, allow_back_track) ' +
            'VALUES ($1,$2,$3)', [id, title, allowBackTrack]);
        for(const question of questions){
            await client.query('INSERT INTO questions (id, text, quiz_id, explanation) ' +
                'VALUES ($1,$2,$3, $4)', [question.id, question.text, id, question.explanation]);
            for(const answer of question.answers){
                const isCorrect = question.correctAnswerIds.includes(answer.id);
                await client.query('INSERT INTO answers (id, text, question_id, is_correct) ' +
                    'VALUES ($1,$2,$3, $4)', [answer.id, answer.text, question.id, isCorrect]);
            }
        }
        await client.query('COMMIT');
        res.status(201).json('Successfully created quiz');
    } catch (err) {
        if(client){
            await client.query('ROLLBACK');
        }
        console.error(err);
        res.status(500).json('Error creating quiz');g
    } finally {
        if (client) {
            client.release();
        }
    }
});

app.delete('/api/quizzes/:id', async (req, res) => {
    let client;
    try{
        const id = req.params.id;
        client = await pool.connect();
        const result = await client.query('DELETE FROM quizzes WHERE id=$1', [id]);
        if(result.rowCount === 0){
            res.status(404).json('No quiz found');
        } else{
            res.status(200).json('Successfully deleted quiz');
        }

    }catch(err){
        console.error(err);
        res.status(500).json('Error deleting quiz');
    } finally {
        if(client){
            client.release();
        }
    }
});

app.put('/api/quizzes/:id', async (req, res) => {
    const quiz_id = req.params.id;
    const {title, allowBackTrack, questions } = req.body;
    let client;
    try{
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query('UPDATE quizzes SET title=$1, allow_back_track=$2 WHERE id=$3',  [title, allowBackTrack, quiz_id]);
        await client.query('DELETE FROM questions WHERE quiz_id=$1', [quiz_id]);

        for(const question of questions){
            await client.query('INSERT INTO questions (id, text, quiz_id, explanation) ' +
                'VALUES ($1,$2,$3, $4)', [question.id, question.text, quiz_id, question.explanation]);
            for(const answer of question.answers){
                const isCorrect = question.correctAnswerIds.includes(answer.id);
                await client.query('INSERT INTO answers (id, text, question_id, is_correct) ' +
                    'VALUES ($1,$2,$3, $4)', [answer.id, answer.text, question.id, isCorrect]);
            }
        }

        await client.query('COMMIT');
        res.status(200).json('Successfully updated quiz');
    } catch(err){
        if(client){
            await client.query('ROLLBACK');
        }
        console.error(err);
        res.status(500).json('Error updating quiz');
    } finally {
        if(client){
            client.release();
        }
    }
})