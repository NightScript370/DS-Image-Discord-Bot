const { Structures } = require("discord.js");

// This extends Discord's native TextChannel class with our own methods and properties
module.exports = Structures.extend("DMChannel", DMChannel => class YamamuraDMChannel extends DMChannel {
	constructor(...args) {
		super(...args);

		this.sendable = true;
		this.embedable = true;
	}
});