import discordJS from 'discord.js';
export default discordJS.Structures.extend("DMChannel", DMChannel => class extends DMChannel {
	constructor(...args) {
		super(...args);

		this.sendable = true;
		this.embedable = true;
	}
});