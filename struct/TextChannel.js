const { Structures } = require("discord.js")

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("TextChannel", TextChannel => {
  return class YamamuraTextChannel extends TextChannel {
    constructor(...args) {
      super(...args)
    }

    get sendable() {
      if (!this.guild) return true;
      return this.guild.me.hasPermission('SEND_MESSAGES')
    }

    get embedable() {
      if (!this.guild) return true;
      return this.guild.me.hasPermission('EMBED_LINKS')
    }
  }
});