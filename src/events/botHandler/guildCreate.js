const Listener = require('discord-akairo')

module.exports = class guildCreateListener extends Listener {
	constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate',
			category: 'botHandler'
		});
	}

	async exec(guild) {
		guild.config.data;

		this.client.channels.get(this.client.log.servers).send(`Added to ${guild.name} (#${guild.id}), owned by ${guild.owner.user.tag} (\`${guild.ownerID}\`)`);
	}
}