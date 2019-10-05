const { Command } = require('discord-akairo');
const os = require('../../utils/os');

const moment = require("moment");
require("moment-duration-format");

module.exports = class StatsCommand extends Command {
	constructor() {
		super('stats', {
			aliases: ['stats', 'statistics', 'status'],
			category: 'Bot Utilities',
			clientPermissions: ['EMBED_LINKS'],
			description: {
				content: "Displays overall information about the bot, such as statistics, publicity and more."
			},
			args: [
				{
					id: 'section',
					type: ['resources', 'ping', 'publicity', 'events', 'dates', 'uptime', 'creation'],
					default: null
				}
			]
		});
	}

	async exec(message) {
		const __ = (k, ...v) => global.getString(message.author.lang, k, ...v);
		const pingMsg = await message.util.reply('Pinging...');

		let msgrt = (pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		let hbping = '';
		if (this.client.ws.ping)
			hbping = `\n ` + __("The heartbeat ping is {0}", __("{0}ms", Math.round(this.client.ws.ping)));

		let prefix = await this.handler.prefix(message);
		let osv = await os.cpuUsage( function(value) { return value; } );
		osv *= 1024; // GB to MB

		let usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
		let totalMem = process.memoryUsage().heapTotal / 1024 / 1024;

		let embed = this.client.util.embed()
			.setAuthor(__("{0} Statistics", this.client.user.username), this.client.user.displayAvatarURL({ format: 'png' }), this.client.website.URL)
			.setThumbnail('https://cdn.discordapp.com/attachments/562823556157800458/597604585330442256/dbtif5j-60306864-d6b7-44b6-a9ff-65e8adcfb911.png')
			.addInline("🌍 " + __("Publicity"), `• ${this.client.users.size.toLocaleString()} Users
• ${this.client.channels.size.toLocaleString()} Channels
• ${this.client.guilds.size.toLocaleString()} Servers`)
			.addInline("🏓 " + __("Ping"), __("The message round-trip took {0}", __("{0}ms", msgrt)) + " " +  hbping)
			.addInline("⚙️ " + __("Resource Usage"), `**• Allocated Memory**: ${Math.round(usedMem * 100) / 100} MB/${Math.round(totalMem * 100) / 100} MB
**• CPU**: ${osv.toFixed(2)}%`)
			.addField("⏱️ " + __("Uptime"), global.lang.getDuration(message.author.lang, this.client.uptime))
			.addField("🎂 " + __("Creation date"), global.lang.getDuration(message.author.lang, moment().diff(moment(this.client.user.createdAt))) + " " + __("ago"))
			.setYamamuraCredits(false)

		pingMsg.edit('', {embed: embed});
	}
};
