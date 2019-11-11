import { Router } from 'express';
const router = Router();
import { parameters } from "../extraFunctions";

export const id = '/';
const _router = (client) => router
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
				image: "https://camo.githubusercontent.com/68f8c313af4f08a3a2db45c22154253bec6ee758/687474703a2f2f692e696d6775722e636f6d2f5348544c474f762e706e67",
				text: "Made for the Homebrew Community"
			},
			{
				icon: "users",
				text: "A helpful and interactive community",
				subtext: "willing to help"
			}
		];
		response.render("index", object);
	})
	.get("/commands", (request, response) => {
		let object = parameters(request);
		object.subtitle = "Commands";
		object.defaultCategory = "Useful";
		response.render("commands", object);
	})
	.get("/support", (request, response) => {
		let object = parameters(request);
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
		response.render("support", object);
	});
export { _router as router };