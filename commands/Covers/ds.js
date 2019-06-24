const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class NintendoDSCommand extends Command {
	constructor() {
		super('ds', {
			aliases: ['ds'],
			category: 'Covers',
			description: {
                content: 'Draws an image under the Nintendo DS Box-Art.',
                examples: ["switch rating:esrb:m17"]
            },
            cooldown: 10000,
            ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
					type: 'image',
                    match: 'rest'
				},
                {
					id: 'rating',
                    match: 'option',
					flag: 'rating:',
                    default: null
				},
                {
					id: 'padding',
                    type: 'integer',
                    match: 'option',
					flag: 'padding:',
                    default: 5
				},
                {
					id: 'internet',
                    match: 'flag',
					flag: '--internet'
				},
                {
					id: 'funky',
                    match: 'flag',
					flag: '--funky'
				},
                {
                    id: 'pattern',
                    match: 'option',
					flag: 'pattern:',
                    default: null
                }
			]
		});
	}

	async exec(msg, { images, rating, padding, internet, funky, pattern }) {
		let boxrating, BG, currentimage;

        try {
            /* switch (pattern.toLowerCase()) {
                case 'wifi':
                    BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'wifi.png'));
                    break;
                case 'sponge':
                    BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'sponge.png'));
                    break;
                case 'jungle':
                    BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'jungle.png'));
                    break;
                case 'joker':
                    BG = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'patterns', 'joker.png'));
                    break;
            }

            switch (rating.toUpperCase()) {
                case 'ESRB:CHILDHOOD':
                case 'ESRB:EC':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'early_childhood.png'));
                    break;
                case 'ESRB:E':
                case 'ESRB:EVERYONE':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'everyone.png'));
                    break;
                case 'ESRB:EVERYONE10+':
                case 'ESRB:E10':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'everyone_10.png'));
                    break;
                case 'ESRB:MATURE':
                case 'ESRB:MATURE17':
                case 'ESRB:M':
                case 'ESRB:M17':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'mature_17.png'));
                    break;
                case 'ESRB:T':
                case 'ESRB:TEEN':
                case 'ESRB:TEENS':
                case 'ESRB:TEENAGERS':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'teen.png'));
                    break;
                case 'ESRB:A':
                case 'ESRB:AO':
                case 'ESRB:ADULTS':
                case 'ESRB:ADULTS18':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'adults_only_18.png'));
                    break;
                case 'ESRB:RP':
                case 'ESRB:RATING_PENDING':
                    boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'esrb', 'rating_pending.png'));
                    break;
            } */

            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ds', 'DS_Case.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
      
            // Draw background
            if (BG) {
                ctx.drawImage(BG, 0, 0, base.width, base.height);
            }

            for (var image of images) {
                currentimage = await loadImage(image);
                await ctx.drawImage(currentimage, padding, padding, base.width-padding, base.height-padding);
            }

            if (boxrating) {
                await ctx.drawImage(boxrating, 0, 0, base.width, base.height);
            }

            if (funky) {
                let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ds', 'funkymode.png'));
                await ctx.drawImage(funkyImg, 0, 0, base.width, base.height);
            }

            await ctx.drawImage(base, 0, 0, base.width, base.height);

            if (internet) {
                let internetImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ds', 'wfc.png'));
                await ctx.drawImage(internetImg, 0, 0, base.width, base.height);
            }

            const attachment = canvas.toBuffer();

            if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'Nintendo-DS.png' }] });
		} catch (err) {
		    console.error(err);
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Please report this error to the Yamamura developers!`);
		}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}