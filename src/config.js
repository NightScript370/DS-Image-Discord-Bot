try { require('dotenv').config() } catch {}

export const token = process.env.TOKEN;
export const botLists = {
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
};
export const website = {
	url: "https://yamamura.xyz",
	client_secret: process.env.CLIENT_SECRET
};
export const owners = [
	"178261738364338177",
	"305817665082097665",
	"280399026749440000",
	"175408504427905025"
];
export const prefix = "!";
export const log = {
	servers: "580990024380841986",
	upvote: "604381257656172603",
	errors: "592610001265229837"
};
export const supportServer = "https://discord.gg/vbYZCRZ";
