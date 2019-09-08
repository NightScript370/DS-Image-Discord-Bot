const { inspect } = require('util')
const Command = require('../../struct/Command');
const { findType } = require("./../../Configuration.js");

module.exports = class EvalCommand extends Command {
	constructor() {
		super('fixconfig', {
			aliases: ['fixconfig', 'fixconf'],
			category: 'Bot Utilities',
			description: {
        content: 'Fixes the server configuration in case it\'s not set properly.',
      },
			ownerOnly: true
		});
	}

	async exec(msg) {
    const types = {
      logchan: "channel",
      welcomechan: "channel",
      welcomemessage: "array",
      leavemessage: "string",
      prefix: "string",
      makerboard: "string",
      starboardchannel: "channel",
      levelup: "bool",
      levelupmsgs: "array",
      mutedrole: "role"
    }
    
    const client = this.client;
    const channel = msg.channel;
    const message = msg;

    client.guilds.forEach(async guild => {
      // await console.log(`Analyzing "${guild.name}"...`);

      let data = client.db.serverconfig.findOne({guildID: guild.id});
      
      // console.log(data);
      
      // await console.log(`Fixing "${guild.name}"...`);
      
      for (const prop in data) {
        if (["meta", "$loki", "exec", "guildID"].includes(prop)) continue;
        const value = data[prop]
        if (!value || !value.value || typeof value == "string") data[prop] = {type: types[prop], arrayType: "string", value: value || findType(types[prop].nullValue)};
        if (types[prop] == "array" && !Array.isArray(data[prop].value)) data[prop].value = [data[prop].value];
      }
      
      // await console.log(`Analyzing "${guild.name}" again...`);
      
      // console.log(data);
    });
    
    await msg.util.send("Done.")
  }
};