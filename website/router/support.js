const { parameters } = require("../extraFunctions")

module.exports = (client) => {
	const supportRouter = (request, response) => {
		let object = parameters(client, request)
		object.widgets = [
			{
				website: 'discordbotlist.com',
				imageurl: `https://discordbotlist.com/bots/${client.user.id}/widget`,
				link: `https://discordbotlist.com/bots/${client.user.id}`,
				size: {
					width: 380,
					height: 150
				}
			},
			{
				website: 'discordbots.org',
				imageurl: `https://discordbots.org/api/widget/${client.user.id}.svg?usernamecolor=FFFFFF&topcolor=7289DA`,
				link: `https://discordbots.org/bot/${client.user.id}`
			},
			{
				website: 'discord.boats',
				imageurl: `https://discord.boats/API/V2/widget/${client.user.id}`,
				link: `https://discord.boats/bot/${client.user.id}`
			}
		];
		response.view("support", object)
	}

	return supportRouter;
}