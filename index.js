const express = require("express");
var cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const controller = require("./api/send.controller");
const validator = require("./helpers/validator");
const senders = require("./helpers/senders");

dotenv.config();
const PORT = process.env.PORT || 80;

//Прослойка для обработки запросов от json
app.use(express.json());
//Прослойка для обработки запросов от формы
app.use(express.urlencoded({ extended: true }));
// CORS заголовки с разрешением доступа с любого сервера
app.use(cors());

app.post(
  "/mail/send/:user",
  validator.sendingEmail,
  senders.whoSendMessage,
  controller.sendMail
);

app.post("/telegram/send/", validator.sendingMessage, controller.sendMessage);

app.get("/test/:user", controller.testServer);
app.get("/", controller.testServer);

app.listen(PORT, () => {
  console.log(`Server has been started ${PORT}...`);
});

//Тестирование сервера на heroku
//heroku logs --tail

// Коннектимся к репозиторию heroku, если создан.
// heroku git:remote -a murmuring-headland-47233

//Деплой на сервер heroku
//git push heroku master
