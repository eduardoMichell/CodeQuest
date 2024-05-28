const express = require('express');
const User = require('../models/User');
const Answer = require('../models/Answer');
const router = express.Router();
const auth = require('../services/authentication');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({
            error: true,
            message: 'Fields:' + (!email ? 'email,' : '') + (!password ? ' password,' : '') + ' can\'t be empty',
            result: {}
        });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(404).json({
            error: true,
            message: 'Incorrect username or password',
            result: {}
        });
    }

    const { error, result, message } = await auth.authPassword(password, user.password);
    if (error || !result) {
        return res.status(401).json({
            error: true,
            message: 'Incorrect username or password',
            result: {}
        });
    }

    try {
        const accessToken = await auth.createAccessToken(user.id);
        if (accessToken.error || !accessToken.result) {
            if (accessToken.error) {
                return res.status(500).send({
                    error: true,
                    message: `Create token error: ${accessToken.error}`,
                    result: {}
                });
            }
        }
        res.status(201).send({
            error: false,
            message: 'Successful on Login',
            result: {
                token: accessToken.result.token,
                user: user,
                createdAt: accessToken.result.iat
            }
        });
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.message,
            result: {}
        });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, enrollment , isAdmin } = req.body;
    if (await User.findOne({ email }).exec()) {
        return res.status(409).json({
            error: true,
            message: "E-mail already registered!",
            result: {}
        });
    }

    if (await User.findOne({ enrollment  }).exec()) {
        return res.status(409).json({
            error: true,
            message: "Enrollment already registered!",
            result: {}
        });
    }
    
    const user = new User({  name, email, password, enrollment , isAdmin });
    const token = await auth.createAccessToken(user.id);
    user.save((error, doc) => {
        if (error) {
            return res.status(500).json({
                error: true,
                message: error.message,
                result: {}
            });
        }
        return res.status(201).json({
            error: false,
            message: "User registered successfully",
            result: {
                userId: user.id,
                token: token.result.token,
                createdAt: token.result.iat
            }
        });
    });

});

router.post('/add-students', async (req, res) => {
    const students = req.body;

    try {
        const results = await Promise.all(students.map(async student => {
            const { enrollment, name, email } = student;
            const firstName = name.split(' ')[0].toLowerCase();
            const password = `${firstName}${enrollment}`;

            if (await User.findOne({ email }).exec()) {
                return {
                    enrollment,
                    name,
                    email,
                    status: 'Email already registered'
                };
            }

            if (await User.findOne({ enrollment }).exec()) {
                return {
                    enrollment,
                    name,
                    email,
                    status: 'Enrollment already registered'
                };
            }

            const user = new User({ name, email, password, enrollment, isAdmin: false });
            await user.save();

            return {
                enrollment,
                name,
                email,
                status: 'User registered successfully',
            };
        }));

        const hasErrors = results.some(result => result.status !== 'User registered successfully');

        if (hasErrors) {
            return res.status(207).json({
                error: true,
                message: "Some students were not registered successfully",
                result: results
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "All students registered successfully",
                result: results
            });
        }
    } catch (error) {
        console.error('Error adding students:', error);
        return res.status(500).json({
            error: true,
            message: "Failed to add students",
            result: {}
        });
    }
});

router.get('/token', async (req, res) => {
    const authToken = req.query.token;
    const { token } = await auth.verifyAccessToken(authToken);
    if (!token) {
        return res.status(401).send({
            error: true,
            message: 'Token not found',
            result: {}
        });
    }
    let user = await User.findById(token.userID);
    if (!user) {
        return res.status(401).send({
            error: true,
            message: 'User not found',
            result: {}
        });
    }
    res.status(201).json({
        error: false,
        message: 'Success on get user by token',
        result: {
            user
        }
    });
});

router.post('/change-passoword', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const authToken = req.headers['authorization'];

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                error: true,
                message: 'Fields:' + (!email ? 'Username,' : '') + (!oldPassword ? ' oldPassword,' : '') + (!newPassword ? ' newPassword,' : '') + ' can\'t be empty',
                result: {},
            });
        }

        if (!authToken) {
            return res.status(401).json({
                error: true,
                message: 'Token not found',
                result: {}
            });
        }

        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({
                error: true,
                message: 'User not found',
                result: {}
            });
        }

        const { token } = await auth.verifyAccessToken(authToken);
        if (!token || (token.userID !== user.id)) {
            return res.status(403).json({
                error: true,
                message: 'Unathorized user',
                result: {},
            });
        }

        const { result } = await auth.authPassword(oldPassword, user.password);
        if (!result) {
            return res.status(401).json({
                error: true,
                message: 'Incorrect username or password',
                result: {}
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                error: true,
                message: 'Old password and new password are the same',
                result: {},
            });
        }

        const toUpdate = await auth.hashPassword(newPassword);

        if (toUpdate.error) {
            return res.status(422).json({
                error: true,
                message: 'Invalid new password, follow the correct pattern',
                result: {}
            });
        }

        const updatedUser = await User.findByIdAndUpdate({ _id: user.id }, { password: toUpdate.result }, { new: true });
        return res.status(201).json({
            error: false,
            message: 'Success on update password!',
            result: {
                user: updatedUser
            }
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message,
            result: {}
        })
    }
});

router.post('/forgot-passoword', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: true,
                message: 'Field: email can\'t be empty',
                result: {},
            });
        }

        const user = await User.findOne({ email }).exec();
        if (user) {
            // Send email with UI link to put new password
        }
        return res.status(201).json({
            error: false,
            message: `We sent an email to ${email} with a link to get back into your account`,
            result: {
            }
        });

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message,
            result: {}
        })
    }
});

router.put("/update/:id", async (req, res) => {
    const { name, cpf, email, phone } = req.body;

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json(
                {
                    error: true,
                    message: 'User not found',
                    result: {}
                }
            );
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.cpf = cpf || user.cpf;
        user.phone = phone || user.phone;

        const updatedUser = await user.save();
        return res.status(201).json({
            error: false,
            message: "Success updating user",
            result: {
                user: updatedUser,
            }
        });
    } catch (error) {
        res.status(501).json({
            error: true,
            message: error.message,
            result: {}
        });
    }
});

router.get('/students', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const { userID } = await auth.verifyAccessToken(authHeader);
        const user = await User.findById(userID);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: true, message: "Unauthorized access", result: {} });
        }

        const students = await User.find({ isAdmin: false });

        const studentScores = await Promise.all(students.map(async student => {
            const answers = await Answer.find({ userId: student._id });
            const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
            return {
                enrollment: student.enrollment,
                name: student.name,
                totalScore: totalScore
            };
        }));

        return res.status(200).json({
            error: false,
            message: "Students fetched successfully",
            result: studentScores
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({
            error: true,
            message: "Failed to fetch students",
            result: {}
        });
    }
});

router.get('/report', async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false });

        const studentReports = await Promise.all(students.map(async student => {
            const answers = await Answer.find({ userId: student._id });

            const totalTracks = answers.length;
            const totalQuestions = answers.reduce((sum, answer) => sum + answer.questions.length, 0);
            const totalCorrectAnswers = answers.reduce((sum, answer) => sum + answer.questions.filter(q => q.isCorrect).length, 0);
            const totalIncorrectAnswers = totalQuestions - totalCorrectAnswers;

            return {
                name: student.name,
                email: student.email,
                enrollment: student.enrollment,
                totalTracks,
                totalQuestions,
                totalCorrectAnswers,
                totalIncorrectAnswers
            };
        }));

        return res.status(200).json({
            error: false,
            message: "Success on generate report",
            result: studentReports
        });
    } catch (error) {
        console.error('Failed on generate report:', error);
        return res.status(500).json({
            error: true,
            message: "Failed on generate report",
            result: {}
        });
    }
});


router.get('/:id', async (req, res) => {
    User.findById(req.params.id).exec((error, result) => {
        if (error) {
            res.status(501).json({
                error: true,
                message: error.message,
                result: {}
            });
        } else {
            res.status(201).json({
                error: false,
                message: "User found by ID",
                result
            });
        }
    })
});

module.exports = router;
