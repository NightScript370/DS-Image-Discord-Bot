const { Listener } = require('discord-akairo');

module.exports = class guildCreateListener extends Listener {
  constructor() {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate',
      category: 'botHandler'
    });
  }

    async exec(guild) {
      let container = {};
      container.guild = guild;

      let serverconfig = await this.client.db.serverconfig.findOne({guildID: guild.id}) || await this.client.setDefaultSettings(container, this.client);

      this.client.channels.get(this.client.config.logging).send(`Added to server: ${guild.name} (#${guild.id})`);
    }
}