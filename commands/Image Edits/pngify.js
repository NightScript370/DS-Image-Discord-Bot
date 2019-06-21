const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');

module.exports = class PNGifyCommand extends Command {
	constructor() {
		super('PNGify', {
			aliases: ["pngify", "needs-more-png", "png"],
			category: 'Image Edits',
			description: 'Draws an image as a PNG. Made to convert DS Homebrew BMPs to a format viewable on Discord.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
        {
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { image }) {
    try {
			const data = await loadImage(image);
      const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

      ctx.drawImage(data, 0, 0, data.width, data.height)

      const attachment = canvas.toBuffer('image/png');
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.channel.send({ files: [{ attachment, name: 'image.jpg' }] });
		} catch (err) {
      console.log(err)
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};