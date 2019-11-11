import Command from 'discord-akairo';
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

export default class BrainsCommand extends Command {
	constructor() {
		super('brains', {
			category: 'Image Edits',
			aliases: ["brains"],
			description: {
				content: `Makes an "Expanding Brain" meme but with your text. You might find a cool bonus if you're a Super Smash Bros. fan`,
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'items',
					match: 'none',
					prompt: {
						start: [
							'What items would you like to pick from?',
							'Type them in separate messages.',
							'Type `stop` when you are done.'
						],
						infinite: true,
						limit: 11
					}
				}
			]
		});
	}

	async exec(message, { items }) {
		const fileTypeRe = /\.(jpe?g|png|gif|bmp)$/i;
		let endimage;
		let loadimage;

		if (items.length < 2) return message.channel.send(global.translate(message.author.lang, "There are not enough arguments to this command. The minimum is {0}.", 2));
		if (items.length > 11) items.length = 11;

		let base = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'brain-template.png'));
		let tabuu = await loadImage(join(__dirname, '..', '..', 'assets', 'images', 'tabuu.png'));
		let y = [0, 195, 376, 565, 753, 918, 1097, 1287, 1497, 1693, 1877];

		let canvas;
		if (items.length == 11) {
			canvas = createCanvas(base.width, base.height);
		} else {
			canvas = createCanvas(base.width, y[items.length] - 2)
		}

		const ctx = canvas.getContext('2d');
		ctx.font = "30px Arial";
		ctx.drawImage(base, 0, 0, base.width, base.height);

		let item;
		for (let index in items) {
			if (isNaN(index)) continue;
			if (index == 10) {
				// This is the last image, so use all of the remaining height
				endimage = base.height - y[items.length - 1];
			} else {
				// Get the y position of the current image and the next y position and subtract the two to get the height of the current box
				endimage = y[index+1] - y[index];
			}

			item = items[index];

			try {
				if (fileTypeRe.test(item.split(/[#?]/gmi)[0])) {
					loadimage = await loadImage(item)
					ctx.drawImage(loadImage, 0, y[index], 300, endimage)
				} else
					this.drawBrainText(ctx, item, y[index] + 40)
			} catch(e) {
				this.drawBrainText(ctx, item, y[index] + 40)
			}

			if (this.checkString(item).includes("smashbrosbrawl"))
				ctx.drawImage(tabuu, 300, y[index], base.width - 300, endimage);
		}

		let attachment = canvas.toBuffer()
		if (Buffer.byteLength(attachment) > 8e+6) 
			message.util.reply('Resulting image was above 8 MB.');
		else
			message.util.send(global.translate(message.author.lang, "Let your brain expand, {0}.", message.guild ? message.member.displayName : message.author.username), { files: [{attachment: attachment, name: 'brain.png'}] })

		return attachment;
	}

	async drawBrainText(ctx, text, heightstart) {
		/* try {
			ctx.font = "30px Arial";
			let fontSize = 30;
			while (ctx.measureText(text).width > 1100) {
				fontSize -= 1;
				ctx.font = `${fontSize}px Arial`;
			}
			const lines = await this.wrapText(ctx, text, 252);
			ctx.fillText(lines.join('\n'), 10, heightstart);
		} catch(e) { */
			ctx.fillText(text, 10, heightstart)
//		}

		return ctx
	}

	checkString(string) {
		if (!string)
			return '';

		return string
			.replaceAll("\n", "")
			.replaceAll(" ", "")
			.replaceAll(".", "")
			.toLowerCase()
	}
};