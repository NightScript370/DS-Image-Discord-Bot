const { Command } = require("discord-akairo");
const request = require("util").promisify(require("request"));

const moment = require("moment");
require("moment-duration-format");

module.exports = class NPMCommand extends Command {
	constructor() {
		super("npm", {
			aliases: ["npm", "npm-package"],
			category: "Useful",
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					id: "pkg",
					description: "List the NPM package here",
					prompt: {
						start: "what NPM pkg would you like to search for?",
						retry: "That's not a valid package we can get information for. Please try again"
					},
					match: "content",
					type: async (_, pkg) => {
						if (!pkg) return null;

						try {
							let data = await request({ url: encodeURIComponent(pkg.toLowerCase().replace(/ /g, "-")), json: true })
							if (data.statusCode === 404)
								return null;

							return data;
						} catch (e) {
							return "error";
						}
					}
				}
			],
			description: {
				content: "Replies with information on an NPM package.",
				usage: "<query>",
				examples: ["discord.js", "discord-akairo", "request"]
			}
		});
	}

	async exec(message, { pkg }) {
		let { body } = pkg;

		if (body.time === undefined)
			return message.util.reply(global.getString(message.author.lang, "commander of this package decided to unpublish it."));

		const version = body.versions[body["dist-tags"].latest];
		const maintainers = this._trimArray(body.maintainers.map(user => user.name).join(", "));
		const dependencies = version.dependencies ? this._trimArray(Object.keys(version.dependencies)) : "";
		let embed = this.client.util.embed()
			.setColor(0xCB0000)
			.setThumbnail("https://i.imgur.com/ErKf5Y0.png")
			.addInline(global.getString(message.author.lang, "Latest Version"), body["dist-tags"].latest)
			.addInline(global.getString(message.author.lang, "License"), body.license || global.getString(message.author.lang, "None"))
			.addInline(global.getString(message.author.lang, "Author"), body.author ? body.author.name : "???")
			.addInline(global.getString(message.author.lang, "Creation Date"), moment.utc(body.time.created).format("DD-MM-YYYY kk:mm:ss"))

		if (moment.utc(body.time.modified).format("DD-MM-YYYY kk:mm:ss") !== moment.utc(body.time.created).format("DD-MM-YYYY kk:mm:ss"))
			embed.addInline(global.getString(message.author.lang, "Modification Date"), moment.utc(body.time.modified).format("DD-MM-YYYY kk:mm:ss"))

		embed
			.addInline(global.getString(message.author.lang, "Main File"), version.main || "index.js")
			.addField(global.getString(message.author.lang, "Dependencies"), dependencies && dependencies.length ? dependencies.join(", ") : global.getString(message.author.lang, "None"));

		if (!isEmpty(body.description))
			embed.setDescription(body.description);

		if (body.author && maintainers.toUpperCase() !== body.author.name.toUpperCase())
			embed.addField(global.getString(message.author.lang, "Maintainers"), maintainers);
		return message.util.send(global.getString(message.author.lang, "NPM Package: {0}", body.name) + `\nhttps://www.npmjs.com/package/${pkg}`, { embed });
	}

	_trimArray(arr) {
		if (arr.length > 10) {
			const len = arr.length - 10;
			arr = arr.slice(0, 10);
		}
		return arr;
	}
}

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}