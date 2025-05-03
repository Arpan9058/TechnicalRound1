const geminiService = require('../services/geminiService');
const fileHandler = require('../utils/fileHandler');
const initialQuestion = "Give me your introduction and your technical skills?"; 
let currentQuestion = initialQuestion;
const jobdescription = `Key Responsibilities:
Web Development: Design, develop, and maintain web applications and websites with clean, maintainable, and efficient code.
Front-End Development: Create responsive, user-friendly interfaces using HTML, CSS, JavaScript, and frameworks like React, Angular, or Vue.js.
Back-End Development: Build and maintain server-side logic, databases, and APIs using languages like PHP, Node.js, Ruby, or Python.
Collaboration: Work closely with designers, product managers, and other developers to create seamless user experiences.
Troubleshooting & Debugging: Identify and resolve issues with websites and applications, optimizing for speed and scalability.
Version Control: Use Git and GitHub/GitLab/Bitbucket for version control and collaborative development.
Qualifications:
Proven experience as a Web Developer, Web Designer, or similar role.
Strong knowledge of front-end technologies: HTML, CSS, JavaScript, and frameworks like React, Vue.js, or Angular.
Proficiency in back-end technologies: Node.js, PHP, Python, Ruby, or similar.
Experience with database management systems (e.g., MySQL, MongoDB, PostgreSQL).
Familiarity with version control (Git).
Understanding of responsive design and mobile-first development.
Knowledge of website optimization techniques, such as performance tuning and SEO.
Familiarity with API development and integration (RESTful APIs, GraphQL).
Ability to work independently and as part of a team in a fast-paced environment.
Strong problem-solving skills and attention to detail.
Excellent communication skills, both verbal and written.`;
exports.analyzeText = async (req, res) => {
    try {
        const { text, question, questionCounter } = req.body;
        console.log('Question Number:', questionCounter);
        console.log(text);
        let analyzeResult = await geminiService.geminianalysis(text, question, questionCounter, jobdescription);

        console.log("Analyzing...");
        console.log("Analyze Result:", analyzeResult);
        await fileHandler.saveToJsonFile(analyzeResult);

        if (analyzeResult && analyzeResult.followUpQuestion) {
            currentQuestion = analyzeResult.followUpQuestion;
        } else {
            currentQuestion = "No further questions."; 
        }

        res.json({ analysis: analyzeResult });

    } catch (error) {
        console.error("Error during analysis:", error);
        res.status(500).json({ error: 'An error occurred during text analysis' });
    }
};