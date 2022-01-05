const axios = require("axios");
const nodemailer = require("nodemailer");
const _ = require("lodash");
require("dotenv").config();

const { MAIL_LOGIN, MAIL_PASS, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } =
  process.env;

//Использован пакет Nodemailer
//https://nodemailer.com/about/

async function sendMail(req, res, next) {
  const { name, email, message, sender } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.meta.ua",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: MAIL_LOGIN, // generated ethereal user
        pass: MAIL_PASS, // generated ethereal password
      },
    });

    //send mail with defined transport object
    let info = await transporter.sendMail({
      from: `${MAIL_LOGIN}`, // sender address
      to: sender, // list of receivers
      subject: "Оповещение с сайта-резюме.", // Subject line
      //text: "Hello world--?", // plain text body
      html: `<h3>${email}</h3> <b>${name} пишет:</b><br><p>${message}</p>`, // html body
    });

    res.status(200).send(info.messageId);
  } catch (err) {
    res.status(400).send(err);
  }
}

//Telegram bot
//Образец https://habr.com/ru/post/348332/

async function sendMessage(req, res, next) {
  const { name, email, message } = req.body;
  try {
    const generateText = () => {
      if (!_.isUndefined(email)) {
        return `<strong>Имя: </strong>${name}
    		<strong>Почта: </strong>${email}
    		${message}
    		`;
      }
      return `<strong>Имя: </strong>${name}
		${message}
		`;
    };
    const encodeMsg = encodeURI(generateText());
    const telegramResp = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&parse_mode=html&text=${encodeMsg}`
    );
    if (telegramResp.statusCode === 200) {
      res.status(200).send({
        status: telegramResp.status,
        message: "Message sending!",
      });
    }
    if (telegramResp.statusCode !== 200) {
      res.status(400).send({ status: "error", message: "Ups some error!" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

async function testServer(req, res, next) {
  try {
    res.status(200).send(
      `Hello Sender! This server send email and message to telegram chanel. <br/>
		Server: https://murmuring-headland-47233.herokuapp.com/`
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendMail,
  sendMessage,
  testServer,
};
