const Inhibitor = require('discord-akairo')

const serverblacklist = [];
const userblacklist = [];

module.exports = class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message, command) {
      if (message.guild && serverblacklist.includes(message.guild.id)) return true
  	  if (userblacklist.includes(message.author.id)) return true

      return false
    }
}