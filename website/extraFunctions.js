const createFooterText = (client) => {
	let owners = [];
	for (let owner of client.ownerID) {
		owners.push(client.users.get(owner).tag)
	}

	owners = owners.filter(name => !name.toLowerCase().includes('alt'))
	return client.user.username + " - by " + owners.join(" & ")
}

exports.isAuth = async (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/servers/login");
exports.parameters = (client, req) => {
	return {
		profile: (req.isAuthenticated() ? "/servers" : "/servers/login"),
		client: client,
		inviteBot: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`,
		footerText: createFooterText(client)
	}
}