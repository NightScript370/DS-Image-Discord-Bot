const { Structures } = require("discord.js")

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("Channel", Channel => {
  return class YamamuraChannel extends Channel {
    constructor(...args) {
      super(...args)
    }
    
    get postable() {
        let me = this.guild.members.get(this.client.user.id)
        return this.permissionsFor(me).has('SEND_MESSAGES')
    }
  }
});