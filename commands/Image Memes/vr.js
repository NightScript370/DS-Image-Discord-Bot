const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class VirtualRealityCommand extends Command {
	constructor() {
		super('virtualreality', {
			aliases: ['virtualreality', 'vr'],
			category: 'Image Memes',
			description: 'Draws the virtual reality meme on top of your image.',
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image'
				},
        {
					id: 'display',
          type: ['twice', 'stretched', 'square'],
          match: 'option',
					flag: 'display:',
          default: 'twice'
				},
			]
		});
	}

	async exec(msg, { images, display }) {
		try {
			const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'vr.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');

			let data;
			for (var image of images) {
				data = await loadImage(image);
				switch (display) {
					case 'twice':
					default:
						ctx.drawImage(data, 44, 482, 154, 157)
						ctx.drawImage(data, 197, 482, 154, 157)
						break;
					case 'stretched':
						ctx.drawImage(data, 44, 482, 308, 157)
						break;
					case 'square':
						ctx.drawImage(data, 30, 385, 337, 337)
						break;
				}
			}

			ctx.drawImage(base, 0, 0, base.width, base.height)

      const attachment = canvas.toBuffer();
			if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'ifunny.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};