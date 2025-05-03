const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const interviewController = require('../controllers/interviewController'); 

const initialQuestion = "Give me your introduction and your technical skills?";
let currentQuestion = initialQuestion;


router.get('/', ensureAuthenticated, (req, res) => {
    const userEmail = req.query.email;
    res.render('index', { question: currentQuestion });
});

router.get('/technical*', ensureAuthenticated, (req, res) => {
    const userEmail = req.query.email;
    res.render('index', { question: currentQuestion });
});


function ensureAuthenticated(req, res, next) {
    const token = req.cookies['session_token'];
    if (!token) {
        return res.redirect('https://prepto-459896721442.asia-south2.run.app/login');
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; 
        next();
    } catch (err) {
        return res.redirect('https://prepto-459896721442.asia-south2.run.app/login');
    }
}

router.post('/analyze-text', interviewController.analyzeText); 

module.exports = router;