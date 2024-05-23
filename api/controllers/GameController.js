const express = require('express');

const Game = require('../models/Game');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Question = require('../models/Question');
const Phase = require('../models/Phase');

const router = express.Router();
const auth = require('../services/authentication');


router.post('/create', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { userID } = await auth.verifyAccessToken(authHeader);
    
    const user = await User.findById(userID);
    
    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: true, message: "Unauthorized access", result: {} });
    }

    const { theme, difficulty, phases } = req.body;

    try {
        const game = new Game({
            theme,
            createdBy: userID,
            difficulty,
            phases: []
        });
        await game.save();

        const phaseDocs = [];
        for (const phase of phases) {
            const newPhase = new Phase({
                gameId: game._id,
                questions: []
            });
            await newPhase.save();
            phaseDocs.push(newPhase);
        }

        const questionDocs = [];
        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];

            for (const question of phase.questions) {
                const newQuestion = new Question({
                    ...question,
                    phaseId: phaseDocs[i]._id 
                });
                await newQuestion.save();
                questionDocs.push(newQuestion);
                phaseDocs[i].questions.push(newQuestion._id);
            }
        }

        for (const question of questionDocs) {
            await Question.findByIdAndUpdate(question._id, { phaseId: question.phaseId });
        }

        for (const phaseDoc of phaseDocs) {
            await phaseDoc.save();
            game.phases.push(phaseDoc._id);
        }

        await game.save();
        return res.status(201).json({
            error: false,
            message: "Game created successfully",
            result: game
        });
    } catch (error) {
        console.error('Error creating the game:', error);
        return res.status(500).json({
            error: true,
            message: "Failed to create game",
            result: {}
        });
    }
});

router.get('/tracks', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Token not found',
                result: {}
            });
        }
        const games = await Game.find({}).lean();
        const gameIds = games.map(game => game._id);

        const answers = await Answer.find({
            userId: userID,
            gameId: { $in: gameIds }
        }).select('gameId').lean();

        const playedGameIds = new Set(answers.map(answer => answer.gameId.toString()));

        const gamesWithPlayedInfo = games.map(game => ({
            ...game,
            alreadyPlayed: playedGameIds.has(game._id.toString())
        }));

        res.status(201).json({
            error: false,
            message: 'Success on retrieving all games',
            result: {
                games: gamesWithPlayedInfo
            }
        });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).send({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

router.get('/to-play/:gameId', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { gameId } = req.params;
    
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Token not found',
                result: {}
            });
        }

        const game = await Game.findById(gameId)
            .populate({
                path: 'phases',
                populate: {
                    path: 'questions'
                }
            })
            .lean();

        if (!game) {
            return res.status(404).send({
                error: true,
                message: 'Game not found',
                result: {}
            });
        }

        const answer = await Answer.findOne({
            userId: userID,
            gameId: game._id
        }).select('gameId').lean();

        const alreadyPlayed = !!answer;

        res.status(200).json({
            error: false,
            message: 'Success on retrieving the game',
            result: {
                ...game,
                alreadyPlayed
            }
        });
    } catch (error) {
        console.error('Error fetching the game:', error);
        res.status(500).send({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

module.exports = router;
