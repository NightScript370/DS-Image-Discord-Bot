const { Command } = require('discord-akairo');
const request = require("request");

const { promisify } = require("util");
const req = promisify(request);

module.exports = class NDSBCompatCommand extends Command {
  constructor() {
    super('nds-bootstrap-compatibility', {
      aliases: ['nds-bootstrap-compatibility', 'nds-bootstrap-compatible', "ndsbcompat"],
      category: 'Useful',
      description: {
				content: 'Check a game to see if it\'s compatible with nds-bootstrap.',
        usage: '<name or card ID of game>',
        example: 'Mario Kart DS USA'
			},
			args: [
        {
					id: 'gametitle',
					type: 'string',
          prompt: {
            start: "What's the Nintendo DS Homebrew you'd like to see?",
            retry: "There is not a thing we can get information for. Try again."
          },
          match: 'rest'
        },
        {
          id: 'flashcard',
          type: 'string',
          match: 'flag',
					flag: '--flashcard'
        }
      ]
    });
  }

  async exec(msg, { gametitle, flashcard }) {
    let embed = this.client.util.embed()
    let text, compatibilitystatus;

    let { body, statusCode, responce } = await req({ url: `http://nds-library-api.glitch.me/${encodeURIComponent(gametitle)}`, json: true })
    if (statusCode !== 200) {
      if (statusCode == 404 && body.message == "invalid title provided")
        return msg.reply("This is not a valid Nintendo DS title. Try again")
      console.log(statusCode)
      return msg.reply('An unknown error has occured. Please try again')
    }

    if (!body['nds-bootstrap'])
      return msg.channel.send('This Nintendo-DS title does not have any nds-boostrap compatibility information. Please try again')

    if (body.title)
      embed.setTitle(body.title)

    if (flashcard) {
      if ((!body['nds-bootstrap'].flashcard) || (body['nds-bootstrap'].flashcard && !body['nds-bootstrap'].flashcard.compatibility && !body['nds-bootstrap'].flashcard.testers))
        return msg.channel.send('This Nintendo-DS title does not have any nds-bootstrap compatibility information for flashcards. Please try again')

      if (body['nds-bootstrap'].flashcard.compatibility) {
        embed = this.compatibilityidentifier(body['nds-bootstrap'].flashcard.compatibility, embed)

        if (!isEmpty(body['nds-bootstrap'].flashcard.notes))
          embed.addInline('Compatibility', body['nds-bootstrap'].flashcard.notes)
        else
          embed.addInline('Compatibility', body['nds-bootstrap'].flashcard.compatibility)

        if (body.title)
          text = `**${body.title}** - ${body['nds-bootstrap'].flashcard.compatibility}`
      }

      if (body['nds-bootstrap'].flashcard.testers)
        embed.setFooter(`Tested by ${body['nds-bootstrap'].flashcard.testers.join(", ")}`)
    } else {
      if ((!body['nds-bootstrap']['sd-card']) || (body['nds-bootstrap']['sd-card'] && !body['nds-bootstrap']['sd-card'].compatibility && !body['nds-bootstrap']['sd-card'].testers))
        return msg.channel.send('This Nintendo-DS title does not have any nds-bootstrap compatibility information for SD Cards. Please try again')

      if (body['nds-bootstrap']['sd-card'].compatibility) {
        embed = this.compatibilityidentifier(body['nds-bootstrap']['sd-card'].compatibility, embed)

        if (!isEmpty(body['nds-bootstrap']['sd-card'].notes))
          embed.addInline('Compatibility', body['nds-bootstrap']['sd-card'].notes)
        else
          embed.addInline('Compatibility', body['nds-bootstrap']['sd-card'].compatibility)

        if (body.title)
          text = `**${body.title}** - ${body['nds-bootstrap']['sd-card'].compatibility}`
      }

      if (body['nds-bootstrap']['sd-card'].testers)
        embed.setFooter(`Tested by ${body['nds-bootstrap']['sd-card'].testers.join(", ")}`)
    }

    if (text)
      msg.channel.send(text, {embed})
    else
      msg.channel.send({embed: embed})
  }

  handleCompatibility(compatstring, embed) {
    if (typeof compatstring == 'string')
      compatstring = compatstring.toLowerCase()

    switch (compatstring) {
      case true:
      case 'little to no glitches':
      case 'little to no glitches.':
      case 'works':
      case 'works.':
      case 'finally works.':
      case 'finally works':
        embed.setColor('GREEN')
        break;
      case 'works, however the top screen is not displayed.':
      case 'works, however the top screen is not displayed':
        embed.setColor('BLUE')
        break;
      case false:
      case "freezes on loading screen":
      case "freezes on loading screen.":
      case "boots but into a black screen":
      case "boots but into a black screen.":
      case "boots but into a white screen":
      case "boots but into a white screen.":
      case "boots into a black screen":
      case "boots into a black screen.":
      case "boots into a white screen":
      case "boots into a white screen.":
      case "white screen":
      case "white screen.":
        embed.setColor('RED')
        break;
    }

    return embed
  }
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}