const express = require('express');
const User = require('../models/User');
const Answer = require('../models/Answer');
const router = express.Router();
const auth = require('../services/authentication');

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User Controller
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successful on Login
 *       400:
 *         description: Fields can't be empty
 *       401:
 *         description: Incorrect username or password
 *       404:
 *         description: User not found
 *       500:
 *         description: Create token error
 */
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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the given details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               enrollment:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: E-mail or Enrollment already registered
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/add-students:
 *   post:
 *     summary: Add multiple students
 *     description: Add multiple students with the given details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 enrollment:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *     responses:
 *       200:
 *         description: All students registered successfully
 *       207:
 *         description: Some students were not registered successfully
 *       500:
 *         description: Failed to add students
 */
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

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Get user by token
 *     description: Retrieve user details by token
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token
 *     responses:
 *       200:
 *         description: Success on get user by token
 *       401:
 *         description: Token not found or User not found
 */
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

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the password of an authenticated user
 *     tags: [User]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success on update password
 *       400:
 *         description: Fields can't be empty or Old password and new password are the same
 *       401:
 *         description: Token not found, User not found or Incorrect username or password
 *       403:
 *         description: Unauthorized user
 *       422:
 *         description: Invalid new password
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request a password reset for a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: We sent an email with a link to get back into your account
 *       400:
 *         description: Field: email can't be empty
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/update/{id}:
 *   put:
 *     summary: Update user details
 *     description: Update the details of an existing user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Success updating user
 *       404:
 *         description: User not found
 *       501:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all students with their scores
 *     tags: [User]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Students fetched successfully
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Failed to fetch students
 */
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

/**
 * @swagger
 * /auth/report:
 *   get:
 *     summary: Generate a report for all students
 *     description: Generate a report with detailed statistics for all students
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Success on generate report
 *       500:
 *         description: Failed on generate report
 */
router.get('/report', async (req, res) => {
    try {
        const students = await User.find({ isAdmin: false });

        const studentReports = await Promise.all(students.map(async student => {
            const answers = await Answer.find({ userId: student._id });

            let totalTracks = answers.length;
            let totalQuestions = 0;
            let totalCorrectAnswers = 0;

            // Iterar sobre cada resposta do usuário
            answers.forEach(answer => {
                // Iterar sobre cada trilha de perguntas
                answer.questions.forEach(track => {
                    totalQuestions += track.questions.length;
                    totalCorrectAnswers += track.questions.filter(q => q.isCorrect).length;
                });
            });

            let totalIncorrectAnswers = totalQuestions - totalCorrectAnswers;

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

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve user details by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       201:
 *         description: User found by ID
 *       501:
 *         description: Internal server error
 */
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
