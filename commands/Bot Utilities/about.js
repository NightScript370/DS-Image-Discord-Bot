const { Command } = require('discord-akairo');

module.exports = class aboutCommand extends Command {
	constructor() {
		super('about', {
			aliases: ["info", 'about', 'help', 'ヘルプ'],
			category: 'Bot Utilities',
			description: {
				content: "Displays overall information about the bot, such as invite link and more."
			},
		});
	}

	regex(message) {
		// Do some code...
		return new RegExp(`^<@!?${this.client.user.id}>( |)$`);
	}

	async exec(authorMessage) {

		let inviteLink = await this.client.generateInvite();
		let message = "<:Yamamura:633898611125649418> | " + `Welcome to ${this.client.user.username}` + "\n"
			+ `${this.client.user.username} is an all-in-one Discord bot dedicated to helping modding communities and more.` + "\n"
			+ "It can fulfill your server's moderation needs and create fun events for your community to enjoy" + "\n\n"

			+ "If you'd like to see all the available commands, use the `time!commands` command"

		authorMessage.util.send(message);
	}
};

function createBultin(text, link, extra="", newLine=true) {
	return `• [${text}](${link}) ${extra ? "(" + extra + ")" : ""} ${newLine ? "\n" : ""}` 
}