const express = require('express');
const router = express.Router();
const { parameters } = require("../extraFunctions")

router
	.get("/", (request, response) => {
		let object = parameters(request);

		object.subtitle = "Home";
		object.features = [
			{
				icon: "level-up",
				text: "Leveling system",
				subtext: "with configurable point multipliers"
			},
			{
				icon_html: `<div style="display: flex; justify-content: center;align-items: center;"><div class="three-cogs fa-1x">
					<i class="fa fa-cog fa-spin fa-2x fa-fw"></i>
					<i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
					<i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
				</div></div>`,
				text: "Customizable settings system",
				subtext: "to suit each different server"
			},
			{
				icon: "star",
				text: "Starboard system"
			},
			{
				icon: "file-code-o",
				text: "Over 100 fun and helpful commands",
				subtext: "with new ones added daily"
			},
			{
				icon: "music",
				text: "Listen to audio from Youtube",
				subtext: "with support for playlists"
			},
			{
				icon: "users",
				text: "A helpful and interactive community",
				subtext: "willing to help"
			}
		]

		response.render("index", object)
	})
	.get("/commands", (request, response) => {
		let object = parameters(request);

		object.subtitle = "Commands";
		object.defaultCategory = "Useful";

		response.render("commands", object)
	})
	.get("/support", (request, response) => {
		let object = parameters(request)
		object.widgets = [
			{
				website: 'discordbotlist.com',
				imageurl: `https://discordbotlist.com/bots/${express.get('clientId')}/widget`,
				link: `https://discordbotlist.com/bots/${express.get('clientId')}`,
				size: {
					width: 380,
					height: 150
				}
			},
			{
				website: 'discordbots.org',
				imageurl: `https://discordbots.org/api/widget/${express.get('clientId')}.svg?usernamecolor=FFFFFF&topcolor=7289DA`,
				link: `https://discordbots.org/bot/${express.get('clientId')}`
			},
			{
				website: 'discord.boats',
				imageurl: `https://discord.boats/API/V2/widget/${express.get('clientId')}`,
				link: `https://discord.boats/bot/${express.get('clientId')}`
			}
		];
		response.render("support", object)
	})

exports.router = router;
exports.id = '/';