const { Command } = require('discord-akairo');

module.exports = class MockCommand extends Command {
  constructor() {
    super('mock', {
      aliases: ['mock'],
      description: {
        content: "Mock someone's words with this"
      },
      category: 'Text Edits',
      args: [
        {
          id: "target",
          type: "text-fun",
          match: 'rest'
        },
        {
          id: "random",
          match: 'flag',
          flag: '--random'
        }
      ]
    });
  }

  async exec(message, { text, random }) {
    if (!text)
      return message.util.send(global.getString(message.author.lang, "I couldn't get text to mock."));

    message.util.send(random ? randomMock(text) : perLetterMock(text));
  }

  perLetterMock (target) {
    let newContent = "";
    let chars = target.split("");
    for (let i = 0; i < chars.length; i++) {
      newContent += i % 2 == 0 ? chars[i].toUpperCase() : chars[i].toLowerCase();
    }
  }

  randomMock (string) {
    return string.split("").map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join("");
  }
}