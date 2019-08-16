const { Command } = require('discord-akairo');
const langs = require("./../../langs/index.js");

module.exports = class LanguageCommand extends Command {
  constructor() {
    super("language", {
      category: 'Bot Utilities',
      aliases: ["language", "lang"],
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
              const langCodes = langs.map(l => l.code)

              let s = [];
              for (let lang of langs) {
                let i = langs.indexOf(lang) + 1;
                s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.getString(message.author.lang, "by {0}", lang.translators.join(", "))}*`);
              }

              return global.getString(message.author.lang, `Which language would you like to set? \n Here is a list of the available languages:`) + `\n \n ${s.join("\n")}`;
            },
            retry: message => {
              const langCodes = langs.map(l => l.code)

              let s = [];
              for (let lang of langs) {
                let i = langs.indexOf(lang) + 1;
                s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.getString(message.author.lang, "by {0}", lang.translators.join(", "))}*`);
              }

              return global.getString(message.author.lang, `That is an invalid language. Here are the available languages:`) + `\n \n ${s.join("\n")}`;
            }
          },
          default: null,
          type: langs.map(l => l.code)
        }
      ]
    });
  }

  async exec(msg, { lang: langcode }) {
    langcode = langcode.toLowerCase();
    const langCodes = langs.map(l => l.code);
    if (!langcode || !langCodes.includes(langcode)) {
      let s = [];
      for (let lang of langs) {
        let i = langs.indexOf(lang) + 1;
        s.push(`**${i}.** ${lang.flag} \`${lang.code}\` ${lang.name} *${global.getString(msg.author.lang, "by {0}", lang.translators.join(", "))}*`);
      }
      msg.channel.send(s.join("\n"));
    } else {
      let langData = langs.filter(l => l.code == langcode)[0];
      msg.author.lang = langcode;
      msg.channel.send(global.getString(langcode, "The language has been changed to {0} **{1}**.", langData.flag, langData.name));
    }
  }
};