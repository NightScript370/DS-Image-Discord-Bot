import discordJS from 'discord.js';
const { Structures } = discordJS

// This extends Discord's native TextChannel class with our own methods and properties
export default Structures.extend("TextChannel", TextChannel => class extends TextChannel {
	constructor(...args) {
		super(...args);
	}

	get sendable() {
		let me = this.guild.members.get(this.client.user.id)
		return this.permissionsFor(me).has('SEND_MESSAGES');
	}

	get embedable() {
		let me = this.guild.members.get(this.client.user.id)
		return this.permissionsFor(me).has('EMBED_LINKS');
	}
});