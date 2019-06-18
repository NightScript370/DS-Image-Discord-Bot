const { Inhibitor } = require('discord-akairo');

const serverblacklist = [];
const userblacklist = [];

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message) {
      if (message.guild && serverblacklist.includes(message.guild.id)) return true
  		if (userblacklist.includes(message.author.id)) return true

      return false
    }
}

module.exports = BlacklistInhibitor;