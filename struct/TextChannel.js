const { Structures } = require("discord.js")

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("TextChannel", TextChannel => {
  return class YamamuraTextChannel extends TextChannel {
    constructor(...args) {
      super(...args)
    }

    get sendable() {
        let me = this.guild.members.get(this.client.user.id)
        return this.permissionsFor(me).has('SEND_MESSAGES')
    }
  }
});