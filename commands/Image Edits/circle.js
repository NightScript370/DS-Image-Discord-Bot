const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');

module.exports = class CircleCommand extends Command {
	constructor() {
		super('circle', {
			aliases: ["circle"],
			category: 'Image Edits',
			description: {
        content: 'Draws an image, but with a circle around it.'
      },
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
        {
					id: 'images',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { images }) {
		try {
			const data = await loadImage(image[0]);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(data, (canvas.width / 2) - (data.width / 2), (canvas.height / 2) - (data.height / 2));

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'circle.png' }] });
		} catch (err) {
      console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};