const express = require('express');
const router = express.Router();
const passport = require("passport");
const extra = require('../extraFunctions');

exports.id = '/servers';
exports.router = (client) => router
	.get("/", extra.isAuth, (request, response) => response.render("profile", extra.parameters(request)))
	.get("/login", passport.authenticate("discord", { failureRedirect: "/" }), (request, response) => response.redirect("/servers"))
	.get("/logout", async (request, response) => {
		await request.logout();
		await response.redirect("/");
	})
	.get("/:guildID/leaderboard", (request, response) => {
		let id = request.params.guildID;

		if (!id || !client.guilds.has(id))
			return response.redirect("/servers");

		response.render("leaderboard", Object.assign(extra.parameters(request), { id }));
	})
	.get("/:guildID/music", (request, response) => {
		let id = request.params.guildID;

		if (!id || !client.guilds.has(id))
			return response.redirect("/servers");

		response.render("queue", Object.assign(extra.parameters(request), { id }));
	})
