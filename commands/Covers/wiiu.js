const { Command } = require('discord-akairo');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class NintendoWiiUCommand extends Command {
	constructor() {
		super('wiiu', {
			aliases: ['wiiu', 'wii-u'],
			category: 'Covers',
			description: {
        content: 'This command allows you to make mock-up box art for that Wii console that has the new gamepad gimmick and an SDK that is easy to get for developers like yourselves. Only problem is, no one will play it :P'
      },
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
          description: 'These are the images for the command. This can be either attachments, user mentions, user IDs, user names, links or if the channel has an image posted beforehand within the past 50 messages: none. If you use links and/or attachments, you can even layer the image.',
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
          default: 0
				},
        {
					id: 'forcestretch',
          match: 'flag',
					flag: '--forcestretch'
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

	async exec(msg, { images, rating, padding, forcestretch, pattern }) {
		let boxrating, BG, currentimage;

    try {
      /* if (pattern) {
        switch (pattern.toLowerCase()) {
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
      }

      if (rating) {
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
        }
      } */

      const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'wiiu', 'WiiU_Case.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
      
      // Draw background
      /* if (!isEmpty(BG)) {
			  ctx.drawImage(BG, 0, 0, base.width, base.height);
      } */

      for (var image of images) {
        currentimage = await loadImage(image);
        if((currentimage.width == currentimage.height || (base.height/4) > currentimage.height) && !forcestretch) {
          ctx.drawImage(currentimage, padding, (base.height / 4)+padding, base.width-padding, (base.height/1.5)-padding);
        } else if ((base.height/3) > currentimage.height && !forcestretch) {
          ctx.drawImage(currentimage, padding, (base.height / 3)+padding, base.width-padding, (base.height/2)-padding);
        } else {
          ctx.drawImage(currentimage, padding, padding, base.width-padding, base.height-padding);
        }
      }

      /*if (!isEmpty(boxrating)) {
        ctx.drawImage(boxrating, 0, 0, base.width, base.height);
      } */
      
      ctx.drawImage(base, 0, 0, base.width, base.height);

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'Nintendo-WiiU.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}