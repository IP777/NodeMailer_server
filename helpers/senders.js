require("dotenv").config();
const { PITER_MAIL, VADOS_MAIL } = process.env;

function whoSendMessage(req, res, next) {
	const { user } = req.params;

	if (user === "piter") {
		req.body.sender = PITER_MAIL;
	}
	if (user === "vados") {
		req.body.sender = VADOS_MAIL;
	}

	next();
}

module.exports = {
	whoSendMessage,
};
