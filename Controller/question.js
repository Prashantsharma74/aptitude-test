const Question = require('../Models/Question');

const submitQuestion = async (req, res) => {
    try {
        const { questionText, options, difficulty, category,Type } = req.body;

        console.log("Request Body:", req.body);
        console.log("Options received:", options);

        if (!options || !options.some(option => option.isCorrect)) {
            return res.status(400).json({ message: 'At least one option must be marked as correct.' });
        }

        // Create and save the question
        const question = new Question({
            questionText,
            options,
            difficulty,
            category,
            Type
        });

        await question.save();

        res.status(201).json({status:true, message: 'Question uploaded successfully', question });
    } catch (error) {
        console.error('Error uploading question:', error.message);
        res.status(500).json({ message: 'Error uploading question', error: error.message });
    }
};


const getFilteredQuestions = async (req, res) => {
    try {
        const { difficulty, category, Type } = req.query;

        const query = {};
        if (difficulty) query.difficulty = difficulty;
        if (category) query.category = category;
        if (Type) query.Type = Type;

        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: 3 } } 
        ]);

        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};
const getFilteredTypes = async (req, res) => {
    try {
        const { Type } = req.query;

        const query = {};
        
        if (Type) query.Type = Type;

        const questions = await Question.aggregate([
            { $match: query },
            { $sample: { size: 3 } } 
        ]);

        res.status(200).json({status:true, questions });
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
};


const getQuestionStats = async (req, res) => {
    try {
        // Fetch total questions and counts based on Type
        const totalQuestions = await Question.countDocuments();
        const reasoningCount = await Question.countDocuments({ Type: 'reasoning' });
        const aptitudeCount = await Question.countDocuments({ Type: 'aptitude' });

        res.status(200).json({
            status:true,
            totalQuestions,
            reasoningCount,
            aptitudeCount
        });
    } catch (error) {
        console.error('Error fetching question stats:', error.message);
        res.status(500).json({ message: 'Error fetching question stats', error: error.message });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); // Fetch all questions
        res.status(200).json({ status: true, questions });
    } catch (error) {
        console.error('Error fetching all questions:', error.message);
        res.status(500).json({ message: 'Error fetching all questions', error: error.message });
    }
};

module.exports = { 
    submitQuestion,
    getFilteredQuestions,
    getQuestionStats,
    getAllQuestions,
    getFilteredTypes
};
