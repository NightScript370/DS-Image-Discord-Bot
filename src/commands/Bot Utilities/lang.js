import { Command } from 'discord-akairo';
import langs, { map, indexOf, filter } from "../../langs/index";

export default class LanguageCommand extends Command {
	constructor() {
		super("language", {
			category: 'Bot Utilities',
			aliases: ["language", "lang", '言語'],
			description: {
				content: `Sets your preferred language for the bot`,
				examples: ['lang', "lang list", "lang set en"],
				usage: 'lang [language]',
			},
			args: [
				{
					id: 'lang',
					prompt: {
						start: message => {
							let s = [];
							for (let lang of langs) {
								let i = indexOf(lang) + 1;
								s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.translate(message.author.lang, "by {0}", lang.translators.join(", "))}*`);
							}

							return global.translate(message.author.lang, `Which language would you like to set? \nHere is a list of the available languages:`) + `\n \n${s.join("\n")}`;
						},
						retry: message => {
							let s = [];
							for (let lang of langs) {
								let i = indexOf(lang) + 1;
								s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.translate(message.author.lang, "by {0}", lang.translators.join(", "))}*`);
							}

							return global.translate(message.author.lang, `That is an invalid language. Here are the available languages:`) + `\n \n${s.join("\n")}`;
						}
					},
					default: null,
					type: map(l => l.code)
				}
			]
		});
	}

	async exec(msg, { lang: langcode }) {
		langcode = langcode.toLowerCase();
		const langCodes = map(l => l.code);
		if (!langcode || !langCodes.includes(langcode)) {
			let s = [];
			for (let lang of langs) {
				let i = indexOf(lang) + 1;
				s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.translate(msg.author.lang, "by {0}", lang.translators.join(", "))}*`);
			}
			msg.channel.send(s.join("\n"));
		} else {
			let langData = filter(l => l.code == langcode)[0];
			msg.author.lang = langcode;
			msg.channel.send(global.translate(langcode, "The language has been changed to {0} **{1}**.", langData.flag, langData.name));
		}
	}
};