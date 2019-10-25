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
		const __ = (k, ...v) => global.translate(message.author.lang, k, ...v);
		const pingMsg = await message.util.reply('Pinging...');

		let fields = [
			{
				title: "🌍 " + __("Publicity"),
				values: [
					__("{0} Users", this.client.users.size.toLocaleString()),
					__("{0} Channels", this.client.channels.size.toLocaleString()),
					__("{0} Servers", this.client.guilds.size.toLocaleString())
				]
			},
			{
				title: "🏓 " + __("Ping"),
				values: [
					__("The message round-trip took {0}", __("{0}ms", (pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)))
				]
			},
			null,
			{
				title: "⏱️ " + __("Uptime"),
				values: global.translate.getDuration(message.author.lang, this.client.uptime)
			},
		]

		if (this.client.ws.ping)
			fields[1].values.push(__("The heartbeat ping is {0}ms", Math.round(this.client.ws.ping)))

		if (message.channel.embedable) {
			let usedMem = process.memoryUsage().heapUsed / 1024 / 1024;
			let totalMem = process.memoryUsage().heapTotal / 1024 / 1024;

			let CPU = await os.cpu();
			let CPUsage = CPU.used * 1024;

			fields[2] = {"⚙️ " + __("Resource Usage"): [
				__(`**Allocated Memory**: ${Math.round(usedMem * 100) / 100} MB/${Math.round(totalMem * 100) / 100} MB`),
				__(`**CPU**: ${CPUsage.toFixed(2)}%`)
			]}
			fields.push({ "🎂 " + __("Creation date"): global.translate.getDuration(message.author.lang, moment().diff(moment(this.client.user.createdAt))) + " " + __("ago") })

			let embed = this.client.util.embed()
				.setAuthor(__("{0} Statistics", this.client.user.username), this.client.user.displayAvatarURL({ format: 'png' }), this.client.website.URL || '')
				.setThumbnail('https://cdn.discordapp.com/attachments/562823556157800458/597604585330442256/dbtif5j-60306864-d6b7-44b6-a9ff-65e8adcfb911.png')
				.setYamamuraCredits(false)

			let value;
			fields.forEach((row, index) => {
				if (index >= fields.length) return;

				value = row.values;
				if (Array.isArray(value))
					value = value.map(v => `• ${v}`).join("\n")

				embed.addField(row.title, value);
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

		pingMsg.edit('', {embed: embed});
	}
};
