import discordJS from 'discord.js';
export default discordJS.Structures.extend("TextChannel", TextChannel => class extends TextChannel {
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