const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const {
	MAIL_LOGIN,
	MAIL_PASS,
	TELEGRAMM_BOT_TOKEN,
	TELEGRAMM_CHAT_ID,
} = process.env;

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
			subject: "Оповешение с сайта-резюме.", // Subject line
			//text: "Hello world--?", // plain text body
			html: `<h3>${email}</h3> <b>${name} пишет:</b><br><p>${message}</p>`, // html body
		});

		res.status(200).send(info.messageId);
	} catch (err) {
		res.status(400).send(err);
	}
}

//Telegramm bot
//Образец https://habr.com/ru/post/348332/

async function sendMessage(req, res, next) {
	const { name, email, message } = req.body;
	try {
		const encodeMsg = encodeURI(
			`<strong>Имя: </strong>${name}  
			<strong>Почта: </strong>${email}
			${message}
			`
		);
		const response = await axios.get(
			`https://api.telegram.org/bot${TELEGRAMM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAMM_CHAT_ID}&parse_mode=html&text=${encodeMsg}`
		);

		res.status(200).send({
			status: response.status,
			message: "Message sending!",
		});
	} catch (err) {
		res.status(400).send(err);
	}
}

async function testServer(req, res, next) {
	try {
		res.status(200).send(`Hello Sender!`);
	} catch (err) {
		next(err);
	}
}

module.exports = {
	sendMail,
	sendMessage,
	testServer,
};
