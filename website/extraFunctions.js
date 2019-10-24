exports.isAuth = async (req, res, next) => req.isAuthenticated() ? next() : res.redirect("/servers/login");
exports.parameters = (client, req) => {
	return {
		profile: (req.isAuthenticated() ? "/servers" : "/servers/login"),
		client: client,
		inviteBot: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot`,
	}
}