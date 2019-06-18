const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');

module.exports = class RotateCmmand extends Command {
	constructor() {
		super('rotate', {
			aliases: ["rotate"],
			category: 'Image Edits',
			description: 'Rotates an image.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'level',
					type: 'integer',
          prompt: {
            start: "By how much would you like to rotate this image?",
            retry: "That's not a value you can rotate by."
          }
				},
        {
					id: 'image',
					type: 'image'
				}
			]
		});
	}

	async exec(msg, { level, image }) {
		try {
			const data = await loadImage(image);
			const canvas = createCanvas(data.width, data.height);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(data, 0, 0, data.width, data.height);
      ctx.rotate(level * Math.PI / 180)

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'stretch.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};