import { Structures } from "discord.js";
import { userconfig } from '../utils/database';

import { defaultLang } from "../langs/framework";

// This extends Discord's native User class with our own methods and properties
export default Structures.extend("User", User => class extends User {
	constructor(...args) {
		super(...args)
	}

	get lang() {
		let user = this;

		let data = userconfig.findOne({ userID: user.id }) || userconfig.insert({ lang: defaultLang, userID: user.id });
		return data.lang || defaultLang;
	}

	set lang(langcode) {
		let user = this;

		let data = userconfig.findOne({ userID: user.id }) || userconfig.insert({ lang: defaultLang, userID: user.id });
		data.lang = langcode;
		let newdata = userconfig.update(data);

		return newdata.lang;
	}
})