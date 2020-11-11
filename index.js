const express = require("express");
const app = express();
const dotenv = require("dotenv");
const controller = require("./api/send.controller");

dotenv.config();
const PORT = process.env.PORT || 80;

//Прослойка для обработки запросов от json
app.use(express.json());
//Прослойка для обработки запросов от формы
//app.use(express.urlencoded({ extended: true }));

app.post("/mail/send/:user", controller.sendMail);
app.get("/test", controller.testServer);

app.listen(PORT, () => {
	console.log(`Server has been started ${PORT}...`);
});
