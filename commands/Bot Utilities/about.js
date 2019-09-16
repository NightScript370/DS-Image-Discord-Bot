const { Command } = require('discord-akairo');

module.exports = class aboutCommand extends Command {
	constructor() {
		super('about', {
            aliases: ["info", 'about', 'help', 'ヘルプ'],
			category: 'Bot Utilities',
            clientPermissions: ['EMBED_LINKS'],
			description: {
                content: "Displays overall information about the bot, such as invite link and more."
            },
		});
	}

    regex(message) {
        // Do some code...
        return new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    }

	async exec(message) {
        const __ = (k, ...v) => global.getString(message.author.lang, k, ...v)

        let prefix = await this.handler.prefix(message);

        let embed = this.client.util.embed()
            .setTitle(__("Welcome to {0}", this.client.user.username), this.client.website.URL)
            .setThumbnail(this.client.user.displayAvatarURL({ format: 'png' }))
            .setDescription(
                    __(`{0} is an all-in-one Discord bot dedicated to helping modding communities and more.`, this.client.user.username) + "\n"
                  + __("It can fulfill your server's moderation needs and create fun events for your community to enjoy") + "\n\n"

                  + __("If you'd like to see all the available commands, please take a look at our website or type {0}commands", prefix))
            .addField('Links', '[Invite Bot](https://discordapp.com/oauth2/authorize?client_id=421158339129638933&scope=bot) | '
                             + `[Website](${this.client.website.URL}) | `
                             + `[Commands](${this.client.website.URL}/commands) | `
                             + `[Support Server](https://discord.gg/vbYZCRZ)`)
            .setYamamuraCredits(false)

        message.channel.send({embed: embed});
	}

};