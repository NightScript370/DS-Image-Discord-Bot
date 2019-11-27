import * as discordJS from 'discord.js';
const { Structures } = discordJS

// This extends Discord's native TextChannel class with our own methods and properties
export default Structures.extend("DMChannel", DMChannel => class extends DMChannel {
	constructor(...args) {
		super(...args);

		this.sendable = true;
		this.embedable = true;
	}
});