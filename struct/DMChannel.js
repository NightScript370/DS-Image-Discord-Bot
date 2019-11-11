import { Structures } from "discord.js";

// This extends Discord's native TextChannel class with our own methods and properties
export default Structures.extend("DMChannel", DMChannel => class extends DMChannel {
	constructor(...args) {
		super(...args);

		this.sendable = true;
		this.embedable = true;
	}
});