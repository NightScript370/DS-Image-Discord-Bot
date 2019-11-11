const { Structures } = require("discord.js");
const db = require('../utils/database');

const { defaultLang } = require("../langs/framework")

// This extends Discord's native User class with our own methods and properties
module.exports = Structures.extend("User", User => class extends User {
	constructor(...args) {
		super(...args)
	}

	get lang() {
		let user = this;

		let data = db.userconfig.findOne({ userID: user.id }) || db.userconfig.insert({ lang: defaultLang, userID: user.id });
		return data.lang || defaultLang;
	}

	set lang(langcode) {
		let user = this;

		let data = db.userconfig.findOne({ userID: user.id }) || db.userconfig.insert({ lang: defaultLang, userID: user.id });
		data.lang = langcode;
		let newdata = db.userconfig.update(data);

		return newdata.lang;
	}
})