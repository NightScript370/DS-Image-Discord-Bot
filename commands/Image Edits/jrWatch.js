const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class BowserMemeCommand extends Command {
  constructor() {
    super('jrWatch', {
      aliases: ['jrWatch', 'bowserHide'],
      category: "Image Edits",
      description: {
        content: "Shows an image of Bowser hiding something from Junior in the Nintendo Switch Parental Controls application"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
	      {
          id: "watches",
					type: 'image',
					match: 'rest'
        },
        {
          id: 'forcestretch',
          match: 'flag',
          flag: '--forcestretch'
        }
			],
    });
  }

  async exec(message, { watches, forcestretch }) {
		if (!this.isGood(images))
			return message.util.reply('No images were found. Please try again.')

    const bowserhide = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bowsermeme.png'));
		const canvas = createCanvas(bowserhide.width, bowserhide.height);
		const ctx = canvas.getContext('2d');

    let currentwatch;
    for (var watching of watches) {
      currentwatch = await loadImage(watching);
      if (currentwatch.width == currentwatch.height && !forcestretch) {
        ctx.drawImage(currentwatch, 253, 41, 552, 552);
      } else {
        ctx.drawImage(currentwatch, 43, 41, 972, 552);
      }
    }

    ctx.drawImage(bowserhide, 0, 0)

    const attachment = canvas.toBuffer();
    if (Buffer.byteLength(attachment) > 8e+6) return message.util.reply('Resulting image was above 8 MB.');
		return message.util.send({ files: [{ attachment, name: 'bowsermeme.png' }] });
  }
}