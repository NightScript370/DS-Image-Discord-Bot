const Command = require('../../struct/Image-Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

module.exports = class NintendoSwitchCommand extends Command {
  constructor() {
		super('switch', {
			aliases: ['switch'],
			category: 'Covers',
			description: {
        content: "The Nintendo Switch is Nintendo's latest handheld...console? We're not sure which. Doesn't matter, cause crazy games released on it like Super Mario Odyssey, Breath of the Wild and Super Smash Bros. Ultimate. Now, make your game one of those games with your own box art mockup. Just make sure to accomodate the quick bite-size gaming of handheld mode and the long experience of TV mode."
      },
      cooldown: 10000,
      ratelimit: 1,
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					id: 'images',
          description: 'These are the images for the command. This can be either attachments, user mentions, user IDs, user names, links or if the channel has an image posted beforehand within the past 50 messages: none. If you use multiple links and/or attachments, you can even layer the image.',
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
					id: 'forcestretch',
          match: 'flag',
					flag: '--forcestretch'
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
					id: 'chubby',
          match: 'flag',
					flag: '--chubby'
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

	async exec(msg, { images, rating, chubby, forcestretch, internet, funky, pattern }) {
		let boxrating, BG, currentimage;

    try {
      if (pattern) {
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
  
      let ratingtype = null;
      
      if (rating) {
        ratingtype = rating.toUpperCase().split(":")[0];
        switch (rating.toUpperCase()) {
          case 'ESRB:CHILDHOOD':
          case 'ESRB:EC':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'earlyChildhood.png'));
            break;
          case 'ESRB:E':
          case 'ESRB:EVERYONE':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'everyone.png'));
            break;
          case 'ESRB:EVERYONE10+':
          case 'ESRB:E10':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'e10.png'));
            break;
          case 'ESRB:MATURE':
          case 'ESRB:MATURE17':
          case 'ESRB:M':
          case 'ESRB:M17':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'mature.png'));
            break;
          case 'ESRB:T':
          case 'ESRB:TEEN':
          case 'ESRB:TEENS':
          case 'ESRB:TEENAGERS':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'teen.png'));
            break;
          case 'ESRB:A':
          case 'ESRB:AO':
          case 'ESRB:ADULTS':
          case 'ESRB:ADULTS18':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'adultsOnly.png'));
            break;
          case 'ESRB:RP':
          case 'ESRB:RATING_PENDING':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'esrb', 'ratingPending.png'));
            break;
          case 'PEGI:3':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '3.png'));
            break;
          case 'PEGI:7':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '7.png'));
            break;
          case 'PEGI:12':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '12.png'));
            break;
          case 'PEGI:16':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '16.png'));
            break;
          case 'PEGI:18':
            boxrating = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'pegi', '18.png'));
            break;
        }
      }

      const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'switch_case.png'));
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext('2d');
      
      // Draw background
      if (BG) {
			  ctx.drawImage(BG, 0, 0, base.width, base.height);
      }

      for (var image of images) {
        currentimage = await loadImage(image);
        if (currentimage.width == currentimage.height && !forcestretch) {
          ctx.drawImage(currentimage, 4, 199, 553, 553);
        } else if((base.height/4) > currentimage.height && !forcestretch) {
          if (chubby) {
            ctx.drawImage(currentimage, 0, (base.height / 4), base.width, (base.height/2));
          } else {
            ctx.drawImage(currentimage, 15, (base.height / 4), (base.width-35), (base.height/2));
          }
        } else if ((base.height/3) > currentimage.height && !forcestretch) {
          if (chubby) {
            ctx.drawImage(currentimage, 0, (base.height / 3), base.width, (base.height/2));
          } else {
            ctx.drawImage(currentimage, 15, (base.height / 3), (base.width-35), (base.height/2));
          }
        } else {
          ctx.drawImage(currentimage, 5, 24, 552, 900);
        }
      }

      if (boxrating) {
        // There's the ratingtype variable if you want to adjust the settings based on the rating system ("ESRB", "PEGI")
        ctx.drawImage(boxrating, 22, 810, 62, 94);
      }

      if (internet) {
        let internetImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'internet_download.png'));
        ctx.drawImage(internetImg, 0, 0, base.width, base.height)
      }

      if (funky) {
        let funkyImg = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'switch', 'funky_mode.png'));
        ctx.drawImage(funkyImg, 0, 0, base.width, base.height)
      }

      ctx.drawImage(base, 0, 0, base.width, base.height);

      const attachment = canvas.toBuffer();
      if (Buffer.byteLength(attachment) > 8e+6) return msg.reply('Resulting image was above 8 MB.');
			return msg.util.send({ files: [{ attachment: attachment, name: 'nintendo-switch-boxart.png' }] });
		} catch (err) {
			return msg.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}