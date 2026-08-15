require('dotenv').config();

const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const alterSQLTables=`

    ALTER TABLE questions DROP CONSTRAINT questions_quiz_id_fkey;
    ALTER TABLE questions ADD CONSTRAINT questions_quiz_id_fkey
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;
        
    ALTER TABLE answers DROP CONSTRAINT answers_question_id_fkey;
    ALTER TABLE answers ADD CONSTRAINT answers_question_id_fkey 
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
    
    ALTER TABLE quizattempts DROP CONSTRAINT quizattempts_quiz_id_fkey;
    ALTER TABLE quizattempts ADD CONSTRAINT quizattempts_quiz_id_fkey 
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE;
    
    ALTER TABLE questionresults DROP CONSTRAINT questionresults_question_id_fkey;
    ALTER TABLE questionresults ADD CONSTRAINT questionresults_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
    
    ALTER TABLE questionresults DROP CONSTRAINT questionresults_answer_id_fkey;
    ALTER TABLE questionresults ADD CONSTRAINT questionresults_answer_id_fkey
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE;
    
    ALTER TABLE questionresults DROP CONSTRAINT questionresults_attempt_id_fkey;
    ALTER TABLE questionresults ADD CONSTRAINT questionresults_attempt_id_fkey
    FOREIGN KEY (attempt_id) REFERENCES quizattempts(id) ON DELETE CASCADE;
    
    ALTER TABLE quizzes DROP CONSTRAINT quizzes_user_id_fkey;
    ALTER TABLE quizzes ADD CONSTRAINT quizzes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
`;

pool.query(alterSQLTables)
    .then(() => console.log('Táblák sikeresen módosítva!'))
    .catch(err => console.error('Hiba történt:', err));

