const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class BowserMemeCommand extends Command {
  constructor() {
    super('jrWatch', {
      aliases: ['jrWatch'],
      category: "Image Memes",
      description: {
        content: "Shows an image of Bowser hiding something from Junior in the Nintendo Switch Parental Controls application"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
	      {
	  			id: "watching",
					type: "image"
				},
        {
          id: 'forcestretch',
          match: 'flag',
					flag: '--forcestretch'
        }
			],
    });
  }

  async exec(message, { watching, forcestretch }) {
    try {
      let bowserimage = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bowsermeme.png'));

			const data = await loadImage(watching);
			const canvas = createCanvas(bowserimage.width, bowserimage.height);
			const ctx = canvas.getContext('2d');

      if (data.width == data.height && !forcestretch) {
        ctx.drawImage(data, 253, 41, 552, 552);
      } else {
        ctx.drawImage(data, 43, 41, 972, 552);
      }

      ctx.drawImage(bowserimage, 0, 0, bowserimage.width, bowserimage.height)

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.util.send({ files: [{ attachment, name: 'bowsermeme.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}