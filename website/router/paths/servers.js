const extra = require("../extraFunctions")

module.exports = (client) => {
	let routers = {
		'/': [extra.isAuth, (request, response) => response.render("profile", extra.parameters(client, request))],
		'/login': [passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/servers")],
		'/logout': async (request, response) => {
			await request.logout();
			await response.redirect("/");
		},
		"/:guildID/leaderboard": (request, response) => {
			let id = request.params.guildID;

			if (!id || !client.guilds.has(id))
				return response.redirect("/servers");

			response.view("leaderboard", Object.assign(extra.parameters(client, request), { id }));
		},
		"/:guildID/music": (request, response) => {
			let id = request.params.guildID;

			if (!id || !client.guilds.has(id))
				return response.redirect("/servers");

			response.view("queue", Object.assign(extra.parameters(client, request), { id }));
		}
	}

	return routers
}

.router = (client) => router
	.get("/", )
	.get("/login", )
	.get("/logout", 
