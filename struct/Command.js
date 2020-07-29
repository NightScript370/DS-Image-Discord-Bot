const { Command } = require('discord-akairo');

module.exports = class SpecialYamamuraCommand extends Command {
	constructor(id, options = {}) {
		super(id, options);
		this.args = super.args;
	}

	isGood(variable) {
		if (variable && variable !== null && (variable.size || variable.length)) return true;
		return false;
	}
}