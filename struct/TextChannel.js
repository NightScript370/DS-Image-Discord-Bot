const { Structures } = require("discord.js");

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("TextChannel", TextChannel => {
  return class YamamuraTextChannel extends TextChannel {
    constructor(...args) {
      super(...args);
      this.sendable = this.permissionsFor(this.client.user.id).has('SEND_MESSAGES');
      this.embedable = this.permissionsFor(this.client.user.id).has('EMBED_LINKS');
    }
  };
});