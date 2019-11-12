import Listener from 'discord-akairo';

export default class guildDeleteListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete',
			category: 'botHandler'
		});
	}

	async exec(guild) {
		this.client.channels.get(this.client.log.servers).send(`Removed from ${guild.name} (#${guild.id}), owned by ${guild.owner.user.tag} (\`${guild.ownerID}\`)`);
	}
}