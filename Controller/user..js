
const Candidate = require('../Models/user'); // Ensure you have required the Candidate model
const Question = require('../Models/Question');
const bcrypt = require('bcryptjs'); // Optional if passwords are hashed
const jwt = require('jsonwebtoken'); // To generate tokens for secure login
const jwt_decode = require("jwt-decode");
const crypto = require('crypto'); 

const submitCandidate = async (req, res) => {
    try {
        const { email, phoneNumber, address, experience, Domain, name, lastname } = req.body;

        // Check if email already exists
        const existingEmail = await Candidate.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if phone number already exists
        const existingPhone = await Candidate.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        // Fetch reasoning questions
        const reasoningQuestions = await Question.aggregate([
            { $match: { Type: 'reasoning' } },
            { $sample: { size: 15 } }
        ]);

        // Fetch aptitude questions
        const aptitudeQuestions = await Question.aggregate([
            { $match: { Type: 'aptitude' } },
            { $sample: { size: 15 } }
        ]);

        // Fetch domain-specific questions
        const domainQuestions = await Question.aggregate([
            { $match: { Type: Domain } },
            { $sample: { size: 15 } }
        ]);

        // Ensure enough questions are available in all categories
        // if (reasoningQuestions.length < 5 || aptitudeQuestions.length < 5 || domainQuestions.length < 5) {
        //     return res.status(400).json({
        //         message: 'Not enough questions available in one or more categories.'
        //     });
        // }

        // Combine all questions
        const assignedQuestions = [
            ...reasoningQuestions,
            ...aptitudeQuestions,
            ...domainQuestions
        ];

        // Save the candidate with assigned questions
        const candidate = new Candidate({
            name,
            lastname,
            email,
            phoneNumber,
            address,
            experience,
            Domain,
            assignedQuestions
        });

        await candidate.save();

        res.status(201).json({
            status: true,
            message: 'Candidate information submitted successfully',
            candidate,
            assignedQuestions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error submitting candidate information',
            error: error.message
        });
    }
};

const updateCandidateMarks = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
      }
  
      const decoded = jwt.verify(token, 'yourSecretKey'); 
      const userId = decoded.id; 
  
      const candidate = await Candidate.findById(userId);
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      const { totalMarks } = req.body;
      if (totalMarks === undefined || totalMarks === null) {
        return res.status(400).json({ message: 'Total marks are required' });
      }
  
      candidate.Total = totalMarks;
      candidate.isSubmit = true;
  
      await candidate.save();
  
      res.status(200).json({
        status: true,
        message: 'Marks updated successfully',
        totalMarks: candidate.Total, 
      });
    } catch (error) {
      console.error(error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(500).json({ message: 'Error updating marks', error: error.message });
    }
  };
  


// Login API
const loginUser = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        // Check if user exists
        const candidate = await Candidate.findOne({ email, phoneNumber });
        if (!candidate) {
            return res.status(404).json({ message: 'Invalid email or phone number' });
        }

        const token = jwt.sign(
            { id: candidate._id, email: candidate.email },
            'yourSecretKey', 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status:true,
            message: 'Login successful',
            candidate,
            token, // Optional: Return token for secure sessions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};





// API endpoint to get assigned questions
const getAssignedQuestions = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token is required' });
        }

        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.id;
        console.log(userId,"id")

        const candidate = await Candidate.findById(userId).select('assignedQuestions name lastname isSubmit id Domain');
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        console.log(candidate.assignedQuestions,"candidate.assignedQuestions")

        // const rawKey = candidate.assignedQuestions.toString('')
        const rawKey = JSON.stringify(candidate.assignedQuestions)
        console.log(rawKey,"rawkey")
        const encodedKey = Buffer.from(rawKey).toString('base64'); 
        console.log(encodedKey,"encodedKey")
        res.status(200).json({
            status: true,
            message: 'Assigned questions fetched successfully',
            rondomToken: encodedKey,
            name: candidate.name, 
            lastname: candidate.lastname,
            isSubmit: candidate.isSubmit,
            id:candidate.id,
            Domain:candidate.Domain
        });
        
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(500).json({ message: 'Error fetching assigned questions', error: error.message });
    }
};


const getAllCandidates = async (req, res) => {
    try {
        // Fetch all candidates from the database
        const candidates = await Candidate.find().select('-assignedQuestions'); // Exclude assigned questions if unnecessary

        if (!candidates || candidates.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No candidates found',
            });
        }

        res.status(200).json({
            status: true,
            message: 'Candidates fetched successfully',
            candidates, // Return the list of candidates
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: 'Error fetching candidates',
            error: error.message,
        });
    }
};




module.exports = { submitCandidate,loginUser,getAssignedQuestions,updateCandidateMarks,getAllCandidates };
