const { Command, version } = require('discord-akairo');
const os = require('../../utils/os');
const moment = require("moment");
require("moment-duration-format");
const djsversion = require("discord.js").version

module.exports = class StatsCommand extends Command {
	constructor() {
		super('stats', {
      aliases: ["info", 'stats', 'yamamura-help'],
			category: 'Bot Utilities',
      clientPermissions: ['EMBED_LINKS'],
			description: {
        content: "Displays overall information about the bot, such as statistics, publicity and more."
      },
		});
	}
  
  regex(message) {
      // Do some code...
      return new RegExp(`^<@!?${this.client.user.id}>( |)$`);
  }

	async exec(message) {
    const __ = (k, ...v) => global.getString(message.author.lang, k, ...v)
    const pingMsg = await message.reply('Pinging...');

    let msgrt = (pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
    let hbping = '';
    if (this.client.ws.ping) {
      hbping = `\n ` + __("The heartbeat ping is {0}", __("{0}ms", Math.round(this.client.ws.ping)));
    }

    let categories = Array.from(this.client.commandHandler.categories.entries());
    let catNames = categories.map(arr => arr[0]);
    let cats = categories.map(arr => arr[1]).sort((c1, c2) => c1.id.localeCompare(c2.id));

    let cmds = cats.map(cat => Array.from(cat.entries()).map(c => c[1])).flat();

    let prefix = await this.handler.prefix(message);
    let osv = await os.cpuUsage( function(value) { return value; } );
    osv *= 1024; // GB to MB

    let usedMem = ((os.totalmem() - os.freemem()) / 1024).toFixed(2);
    let totalMem = (os.totalmem() / 1024).toFixed(2);

    console.log('Using RavenBot: ', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))
    console.log('Using Yamamura: ', usedMem)
    console.log('Free RavenBot: ', Math.round(os.freemem()))
    console.log('Free Yamamura: ', totalMem)
  
    let embed = this.client.util.embed()
      .setTitle(__("Welcome to {0}", this.client.user.username), this.client.URL)
      .setThumbnail(this.client.user.displayAvatarURL({ format: 'png' }))
      .setDescription(__('This is a discord bot made in Discord-Akairo written for MakerBoard connectivity.') + "\n"
                    + __("If you'd like to see all the available commands, please take a look at our website or type {0}commands", prefix))
      .addInline("🌍 " + __("Publicity"), `• ${this.client.guilds.reduce((total, server) => total + server.memberCount, 0).toLocaleString()} Users
• ${this.client.channels.size.toLocaleString()} Channels
• ${this.client.guilds.size.toLocaleString()} Servers`)
      .addInline("🔢 " + __("Backends"), `**• Discord.js**: v${djsversion}
**• Discord-Akairo**: v${version}
**• Node.JS Version**: v${process.version}
**• ${__("Database System")}**: lokijs`)
      .addInline("⚙️ " + __("Resource Usage"), `**• Memory**: ${usedMem} MB/${totalMem} MB 
**• CPU**: ${osv.toFixed(2)} MB`)
      .addInline(__("Total Events"), `• ${__("{0} total commands", cmds.length)}
• ${__("{0} total listeners", this.client._eventsCount)}`)
      .addInline("🏓 " + __("Ping"), __("The message round-trip took {0}", __("{0}ms", msgrt)) + " " +  hbping)
      .addField("⏱️ " + __("Uptime"), global.lang.getDuration(message.author.lang, this.client.uptime))
      .addField("🎂 " + __("Creation date"), global.lang.getDuration(message.author.lang, moment().diff(moment(this.client.user.createdAt))) + " " + __("ago"))
      .setYamamuraCredits(false)

    pingMsg.edit('', {embed: embed});
	}

};

function totalmem(){
    return os.totalmem() / ( 1024 * 1024 );
}

