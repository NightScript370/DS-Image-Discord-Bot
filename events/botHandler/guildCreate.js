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
      let serverconfig = await this.client.db.serverconfig.findOne({guildID: guild.id}) || await this.client.setDefaultSettings(guild);

      this.client.channels.get(this.client.log.servers).send(`Added to ${guild.name} (#${guild.id}), owned by ${guild.owner.user.tag} (\`${guild.ownerID}\`)`);
      this.client.util.setDefaultStatus(client);
    }
}