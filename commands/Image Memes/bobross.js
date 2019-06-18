const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class BobRossCommand extends Command {
  constructor() {
    super('bob-ross', {
      aliases: ["bobross", 'bob-ross', 'ross'],
      category: "Image Memes",
      description: {
        content: "Shows an image over bob ross's canvas"
      },
      clientPermissions: ['ATTACH_FILES'],
      args: [
	      {
	  			id: "image",
					type: "image"
				}
			],
    });
  }

  async exec(message, { image }) {
    try {
      const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'bob-ross.png'));

			const data = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'white';

			ctx.rotate(0.05);
			ctx.drawImage(data, 30, 19, 430, 430);
			ctx.rotate(-0.05);

      ctx.drawImage(base, 0, 0, base.width, base.height);

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
			return message.util.send({ files: [{ attachment, name: 'bob-ross.png' }] });
    } catch (e) {
      return message.reply(`Oh no, an error occurred: \`${e.message}\`. Try again later!`);
    }
  }
}