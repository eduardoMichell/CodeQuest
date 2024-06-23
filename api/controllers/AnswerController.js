const express = require('express');

const Game = require('../models/Game');
const Answer = require('../models/Answer');
const router = express.Router();
const auth = require('../services/authentication');


/**
 * @swagger
 * tags:
 *   - name: Answers
 *     description: Answer Controller
 */

/**
 * @swagger
 * /answer/stats:
 *   get:
 *     summary: Get user stats
 *     description: Retrieve stats for the authenticated user
 *     tags: [Answers]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/stats', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Unauthorized access',
                result: {}
            });
        }

        const answers = await Answer.find({ userId: userID }).lean();

        const stats = answers.reduce((acc, answer) => {
            acc.totalTracksPlayed += 1;
            acc.totalQuestionsAnswered += answer.questions.reduce((sum, phase) => sum + phase.questions.length, 0);
            acc.totalCorrectAnswers += answer.questions.reduce((sum, phase) => sum + phase.questions.filter(q => q.isCorrect).length, 0);
            acc.totalIncorrectAnswers = acc.totalQuestionsAnswered - acc.totalCorrectAnswers;
            acc.totalPoints += answer.score;
            return acc;
        }, {
            totalTracksPlayed: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            totalIncorrectAnswers: 0,
            totalPoints: 0
        });

        res.status(200).json({
            error: false,
            message: 'Success on retrieving user stats',
            result: stats
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

 
/**
 * @swagger
 * /answer/ranking:
 *   get:
 *     summary: Get user ranking
 *     description: Retrieve ranking for all users
 *     tags: [Answers]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Ranking retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/ranking', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Unauthorized access',
                result: {}
            });
        }
        const answers = await Answer.find().populate('userId').lean();

        const playerStats = answers.reduce((acc, answer) => {
            const userId = answer.userId._id.toString();
            if (!acc[userId]) {
                acc[userId] = {
                    userId: userId,
                    nome: answer.userId.name,
                    pontuacaoTotal: 0,
                    totalQuestions: 0,
                    correctAnswers: 0
                };
            }
            acc[userId].pontuacaoTotal += answer.score;

            answer.questions.forEach(phase => {
                acc[userId].totalQuestions += phase.questions.length;
                acc[userId].correctAnswers += phase.questions.filter(q => q.isCorrect).length;
            });

            return acc;
        }, {});

        let ranking = Object.values(playerStats).map(player => ({
            ...player,
            taxaDeRespostasCorretas: player.totalQuestions > 0 ? ((player.correctAnswers / player.totalQuestions) * 100).toFixed(2) + '%' : '0.00%'
        }));

        ranking = ranking.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);

        ranking = ranking.map((player, index) => ({
            posicao: index + 1,
            ...player
        }));


        const userRanking = ranking.find(player => player.userId === userID);
        const userPos = userRanking ? userRanking.posicao : null;

        res.status(200).json({
            error: false,
            message: 'Sucess getting ranking',
            result: {
                ranking: ranking,
                userPos: userPos
            }
        });
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).json({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

/**
 * @swagger
 * /answer/save:
 *   post:
 *     summary: Save game results
 *     description: Save the results of a game for the authenticated user
 *     tags: [Answers]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *               score:
 *                 type: integer
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     phaseId:
 *                       type: string
 *                     questions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionId:
 *                             type: string
 *                           isCorrect:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Answer saved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.post('/save', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Unauthorized access',
                result: {}
            });
        }

        const { gameId, score, questions } = req.body;

        const newAnswer = new Answer({
            userId: userID,
            gameId: gameId,
            score: score,
            questions: questions
        });

        await newAnswer.save();

        return res.status(201).json({
            error: false,
            message: 'Answer saved successfully',
            result: newAnswer
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

/**
 * @swagger
 * /answer/tracks:
 *   get:
 *     summary: Get available tracks
 *     description: Retrieve all available tracks for the authenticated user
 *     tags: [Answers]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Tracks retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/tracks', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Unauthorized access',
                result: {}
            });
        }

        const games = await Game.find().lean();

        const userAnswers = await Answer.find({ userId: userID }).lean();

        const answersMap = userAnswers.reduce((acc, answer) => {
            acc[answer.gameId] = answer;
            return acc;
        }, {});

        const tracks = games.map(game => {
            const played = answersMap[game._id] ? true : false;
            const totalPoints = played ? answersMap[game._id].score : 0;

            return {
                theme: game.theme,
                difficulty: game.difficulty,
                played: played,
                totalPoints: totalPoints
            };
        });

        res.status(200).json({
            error: false,
            message: 'Success on retrieving themes',
            result: tracks
        });
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).json({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

/**
 * @swagger
 * /answer/user/detailed-stats:
 *   get:
 *     summary: Get detailed user stats
 *     description: Retrieve detailed stats for the authenticated user
 *     tags: [Answers]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Detailed stats retrieved successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/user/detailed-stats', async (req, res) => {
    const authHeader = req.headers['authorization'];
    try {
        const { auth: isAuthenticated, userID } = await auth.verifyAccessToken(authHeader);
        if (!isAuthenticated) {
            return res.status(401).send({
                error: true,
                message: 'Unauthorized access',
                result: {}
            });
        }
        const games = await Game.find().lean();

        const userAnswers = await Answer.find({ userId: userID }).lean();

        const answersMap = userAnswers.reduce((acc, answer) => {
            acc[answer.gameId] = answer;
            return acc;
        }, {});

        const detailedStats = games.map(game => {
            const played = answersMap[game._id] ? true : false;
            const totalPoints = played ? answersMap[game._id].score : 0;

            const totalQuestionsAnswered = played ? answersMap[game._id].questions.reduce((sum, phase) => sum + phase.questions.length, 0) : 0;
            const totalCorrectAnswers = played ? answersMap[game._id].questions.reduce((sum, phase) => sum + phase.questions.filter(q => q.isCorrect).length, 0) : 0;
            const totalIncorrectAnswers = totalQuestionsAnswered - totalCorrectAnswers;

            return {
                theme: game.theme,
                difficulty: game.difficulty,
                played: played,
                totalPoints: totalPoints,
                totalQuestionsAnswered: totalQuestionsAnswered,
                totalCorrectAnswers: totalCorrectAnswers,
                totalIncorrectAnswers: totalIncorrectAnswers
            };
        });

        res.status(200).json({
            error: false,
            message: 'Success on retrieving detailed stats',
            result: detailedStats
        });
    } catch (error) {
        console.error('Error fetching detailed stats:', error);
        res.status(500).json({
            error: true,
            message: 'Server error',
            result: {}
        });
    }
});

module.exports = router;
