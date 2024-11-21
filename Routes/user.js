const express = require('express');
const router = express.Router();
const { submitCandidate,loginUser,getAssignedQuestions,updateCandidateMarks,getAllCandidates } = require('../Controller/user.');

// POST /api/candidates - Submit candidate information
router.post('/condidate', submitCandidate);
router.post('/login', loginUser);
router.get("/assigned-questions", getAssignedQuestions);
router.post("/updateCandidateMarks", updateCandidateMarks);
router.get("/getAllCandidates", getAllCandidates);

module.exports = router;


