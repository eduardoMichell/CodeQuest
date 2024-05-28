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

router.put('/edit/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { userID } = await auth.verifyAccessToken(authHeader);

    const user = await User.findById(userID);

    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: true, message: "Unauthorized access", result: {} });
    }

    const gameId = req.params.id;
    const { theme, difficulty, phases } = req.body;

    try {
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ error: true, message: "Game not found", result: {} });
        }

        game.theme = theme;
        game.difficulty = difficulty;
        game.phases = [];

        await Phase.deleteMany({ gameId: gameId });
        await Question.deleteMany({ phaseId: { $in: game.phases } });

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

        for (const phaseDoc of phaseDocs) {
            await phaseDoc.save();
            game.phases.push(phaseDoc._id);
        }

        await game.save();
        return res.status(200).json({
            error: false,
            message: "Game updated successfully",
            result: game
        });
    } catch (error) {
        console.error('Error updating the game:', error);
        return res.status(500).json({
            error: true,
            message: "Failed to update game",
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

router.get('/view-tracks', async (req, res) => {
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

        const tracks = await Game.find()
            .populate({
                path: 'phases',
                populate: {
                    path: 'questions',
                    model: 'Question'
                }
            })
            .populate('createdBy');

        const trackDetails = await Promise.all(tracks.map(async track => {
            const answers = await Answer.find({ gameId: track._id }).populate('userId');

            let totalCorrect = 0;
            let totalIncorrect = 0;
            let players = new Set();
            let hardestQuestion = null;
            let easiestQuestion = null;

            answers.forEach(answer => {
                players.add(answer.userId.name);
                answer.questions.forEach(questionSet => {
                    questionSet.questions.forEach(question => {
                        if (question.isCorrect) {
                            totalCorrect += 1;
                        } else {
                            totalIncorrect += 1;
                        }
                    });
                });
            });

            track.phases.forEach(phase => {
                phase.questions.forEach(question => {
                    if (!hardestQuestion || question.rate > hardestQuestion.rate) {
                        hardestQuestion = question;
                    }
                    if (!easiestQuestion || question.rate < easiestQuestion.rate) {
                        easiestQuestion = question;
                    }
                });
            });

            return {
                id: track._id,
                theme: track.theme,
                difficulty: track.difficulty,
                totalCorrect,
                totalIncorrect,
                hardestQuestion,
                easiestQuestion,
                players: Array.from(players)
            };
        }));

        res.status(200).json({
            error: false,
            message: 'Success on retrieving all tracks details',
            result: trackDetails
        });
    } catch (error) {
        res.status(500).send({
            error: true,
            message: 'viewTracks :: error ::' + error,
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

router.delete('/delete/:id', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const { userID } = await auth.verifyAccessToken(authHeader);

    const user = await User.findById(userID);

    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: true, message: "Unauthorized access", result: {} });
    }

    const gameId = req.params.id;

    try {
        const phases = await Phase.find({ gameId: gameId });
        const phaseIds = phases.map(phase => phase._id);

        const questions = await Question.find({ phaseId: { $in: phaseIds } });
        const questionIds = questions.map(question => question._id);

        await Answer.deleteMany({ gameId: gameId });

        await Question.deleteMany({ _id: { $in: questionIds } });

        await Phase.deleteMany({ _id: { $in: phaseIds } });

        await Game.findByIdAndDelete(gameId);

        return res.status(200).json({
            error: false,
            message: "Game and all associated data deleted successfully",
            result: {}
        });
    } catch (error) {
        console.error('Error deleting the game:', error);
        return res.status(500).json({
            error: true,
            message: "Failed to delete game",
            result: {}
        });
    }
});

module.exports = router;
