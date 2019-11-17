import Command from 'discord-akairo';

export default class aboutCommand extends Command {
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
		const __ = (k, ...v) => global.translate(authorMessage.author.lang, k, ...v)

		let inviteLink = await this.client.generateInvite();
		let message = "<:Yamamura:633898611125649418> | " + __("Welcome to {0}", this.client.user.username) + "\n"
			+ __("{0} is an all-in-one Discord bot dedicated to helping modding communities and more.", this.client.user.username) + "\n"
			+ __("It can fulfill your server's moderation needs and create fun events for your community to enjoy") + "\n\n"

			+ __("If you'd like to see all the available commands, please take a look at our website or use the `{0}commands` command", authorMessage.guild.config.data.prefix)

		let embed = this.client.util.embed()
			.addField(__('Links'),
				createBultin(__("Invite Link"), inviteLink, __("Inviting requires you to have the `MANAGE_SERVER` permission. The bot itself doesn't require it"))
			  + createBultin(__("Visit our website"), this.client.website.URL)
			  + createBultin(__("Follow our Twitter"), "https://twitter.com/BotYamamura")
			  + createBultin(__("Join our Development Server"), this.client.supportServer))
			.setYamamuraCredits(false)

		authorMessage.util.send(message, (authorMessage.channel.embedable ? {embed: embed} : {}));
	}
};

function createBultin(text, link, extra="", newLine=true) {
	return `• [${text}](${link}) ${extra ? "(" + extra + ")" : ""} ${newLine ? "\n" : ""}` 
}