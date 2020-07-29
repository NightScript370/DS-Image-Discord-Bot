const { Command } = require('discord-akairo');
const os = require('../../utils/os');

const moment = require("moment");
require("moment-duration-format");

module.exports = class StatsCommand extends Command {
	constructor() {
		super('stats', {
			aliases: ['stats', 'statistics', 'status'],
			category: 'Bot Utilities',
			description: {
				content: "Displays overall information about the bot, such as statistics, publicity and more."
			}
		});
	}

	async exec(message) {
		const pingMsg = await message.util.reply('Pinging...');

		let fields = [
			{
				title: "🌍 " + "Publicity",
				values: [
					`${this.client.users.size.toLocaleString()} Users`,
					`${this.client.channels.size.toLocaleString()} Channels`,
					`${this.client.guilds.size.toLocaleString()} Servers`
				],
				inline: true
			},
			{
				title: "🏓 " + "Ping",
				values: [
					`The message round-trip took ${(pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms`
				],
				inline: true
			},
			null,
			{
				title: "⏱️ " + "Uptime",
				values: global.translate.getDuration(message.author.lang, this.client.uptime)
			},
		]

		if (this.client.ws.ping)
			fields[1].values.push(`The heartbeat ping is ${Math.round(this.client.ws.ping)}ms`)

		if (message.channel.embedable) {
			let usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
			let totalMem = process.memoryUsage().heapTotal / 1024 / 1024;

			let CPU = await os.cpu();
			let CPUsage = CPU.used * 1024;

			fields[2] = {
				title: "⚙️ " + "Resource Usage",
				values: [
					`**Allocated Memory**: ${Math.round(usedMem * 100) / 100} MB/${Math.round(totalMem * 100) / 100} MB`,
					`**CPU**: ${CPUsage.toFixed(2)}%`
				]
			}
			fields.push({
				title: "🎂 " + "Creation date",
				values: global.translate.getDuration(message.author.lang, moment().diff(moment(this.client.user.createdAt))) + " " + __("ago")
			})

			let embed = this.client.util.embed()
				.setAuthor(__("{0} Statistics", this.client.user.username), this.client.user.displayAvatarURL({ format: 'png' }))
				.setThumbnail('https://cdn.discordapp.com/attachments/562823556157800458/597604585330442256/dbtif5j-60306864-d6b7-44b6-a9ff-65e8adcfb911.png')
				.setYamamuraCredits(false)

			let value;
			fields.forEach((row, index) => {
				if (index >= fields.length) return;

				value = row.values;
				if (Array.isArray(value))
					value = value.map(v => `• ${v}`).join("\n")

				embed.addField(row.title, value, (row.inline ? true : false));
			})

			pingMsg.edit('', {embed: embed})
		} else {
			let newMessage = "<:Yamamura:633898611125649418> | " + __("{0} Statistics", this.client.user.username) + "\n\n";
			fields.filter(value => value !== null).forEach((row, index) => {
				if (index >= fields.length) return;

				value = row.values;
				if (Array.isArray(value))
					value = value.join(" • ")

				newMessage += `**${row.title}** - ${value}`
			})

			pingMsg.edit(newMessage)
		}
	}
};
