const { Structures } = require("discord.js");
const { getKey } = require('./../Configuration.js');

// This extends Discord's native Guild class with our own methods and properties
module.exports = Structures.extend("Guild", Guild => {
  return class YamamuraGuild extends Guild {
    constructor(...args) {
      super(...args)
    }
    
    get levelupmsgs() {
      return getKey(this.client, { guild: this }, "levelupmsgs");
    }

    get welcomemsgs() {
      return getKey(this.client, { guild: this }, "welcomemessage");
    }
  }
})