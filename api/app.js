require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const authentication = require('./middleware/authentication');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./services/swaggerConfig');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
}).then(() => console.log('DB connected'))
	.catch(err => console.error(err));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

authentication(app);

app.use("/auth", require("./controllers/UserController"));
app.use("/game", require("./controllers/GameController"));
app.use("/answer", require("./controllers/AnswerController"));


app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
	console.log(`Documentação do Swagger disponível em http://localhost:${PORT}/docs`);
  });