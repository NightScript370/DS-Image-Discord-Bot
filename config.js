try { require('dotenv').config() } catch {}

module.exports = {
	token: process.env.TOKEN,
	botLists: {
		"top.gg": {
			token: process.env.DBLTOKEN,
			webhookpass: process.env.DBLPASS
		},
		"discord.boats": {
			token: process.env.DBOATPASS,
			webhookpass: ''
		},
		"discordbotlist.com": {
			token: process.env.DBLORGTOKEN,
			webhookpass: ''
		}
	},
	website: {
		url: "https://yamamura-bot.tk",
		client_secret: process.env.CLIENT_SECRET,
		mainPage: 'home'
	},
	owners: [
		"178261738364338177",
		"305817665082097665",
		"280399026749440000",
		"175408504427905025"
	],
	prefix: "!",
	log: {
		servers: "580990024380841986",
		upvote: "604381257656172603",
		errors: "592610001265229837"
	},
	supportServer: "https://discord.gg/vbYZCRZ"
};
