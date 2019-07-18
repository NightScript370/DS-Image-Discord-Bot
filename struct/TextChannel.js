const { Structures } = require("discord.js");

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("TextChannel", TextChannel => {
  return class YamamuraTextChannel extends TextChannel {
    constructor(...args) {
      super(...args);
      this.sendable = !this.guild || (this.guild && this.guild.me.hasPermission('SEND_MESSAGES'));
      this.embedable = !this.guild || (this.guild && this.guild.me.hasPermission('EMBED_LINKS'));
    }
  };
});