const { Structures } = require("discord.js");

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("User", User => {
	return class YamamuraUser extends User {
		constructor(...args) {
			super(...args)
		}
		
		get lang() {
			return global.lang.getUser(this.client, this.id).lang || global.lang.default;
		}
		
		set lang(langcode) {
			let data = global.lang.getUser(this.client, this.id);
			data.lang = langcode;
			global.lang.update(this.client, data);
		}
	}
})