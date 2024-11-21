// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const { submitQuestion,getFilteredQuestions,getQuestionStats,getAllQuestions  } = require('../Controller/question');

// POST route to upload a question

router.post('/upload', submitQuestion);
router.get('/', getFilteredQuestions);
router.get('/get-question-stats', getQuestionStats);
router.get('/all', getAllQuestions);

module.exports = router;
