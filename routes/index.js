const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController'); 

const initialQuestion = "Give me your introduction and your technical skills?";
let currentQuestion = initialQuestion;

router.get('/', (req, res) => {
    res.render('index', { question: currentQuestion });
});

router.post('/analyze-text', interviewController.analyzeText); 

module.exports = router;