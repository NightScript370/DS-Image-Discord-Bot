const { Command } = require('discord-akairo');
const request = require("request");

const { promisify } = require("util");
const req = promisify(request);

module.exports = class ImageCommand extends Command {
	constructor() {
		super('image', {
			aliases: ["image", "img"],
			category: 'Fun',
			description: {
        content: 'Shows a picture of a random species. Could range from Yoshis, Dogs, Cats, Birds, and Catgirls.',
        usage: '<species you\'d like to see an image of>',
        examples: ['bird', 'cat', 'dog', 'catgirl (NO NSFW)', 'yoshi', 'toad']
      },
			args: [
        {
          id: "species",
          type: ['yoshi', 'catgirl', 'lewd catgirl', 'cat', 'dog', 'bird', 'toad'],
          prompt: {
            start: 'Which species would you like to get an image of? Available ones: `yoshi`, `dog`, `cat`, `catgirl`, `toad`',
            retry: 'That\'s not something we can get an image of! Try again.'
          },
          match: 'content'
        }
			]
		});
    
    this.ratelimited = false;
	}

	async exec(msg, { species }) {
    let API = false;
    let nsfwspecies = false;

    let image;
    let url;

    switch (species) {
      case 'yoshi':
        API = true;
        url = 'https://yoshi.glitch.me'
        break;
      case 'dog':
        API = true;
        url = 'https://random.dog/woof.json';
        break;
      case 'cat':
        API = true;
        url = 'http://aws.random.cat/meow';
        //url = 'https://cataas.com/cat';
        break;
      case 'toad':
        API = true;
        url = 'https://toad.glitch.me/';
        break;
      case 'catgirl':
        API = true;
        nsfwspecies = true;
        url = 'https://nekos.moe/api/v1/random/image?count=1&nsfw=false';
        break;
      case 'lewd catgirl':
        API = true;
        nsfwspecies = true;
        url = 'https://nekos.moe/api/v1/random/image?count=1&nsfw=true';
        break;
      case 'bird':
        API = true;
        url = 'http://random.birb.pw/tweet.json/';
        break;
    }

    if (nsfwspecies && msg.guild && !msg.channel.nsfw) return await msg.reply('You need to use this command argument in DMs or an NSFW channel');

    if (API) {
      if(this.ratelimited) return msg.channel.send('API is being ratelimited, please try again later.');

      var { body, statusCode, responce } = await req({ url: url, json: true });
      if (statusCode === 200) {
        switch (species) {
          case 'dog':
          case 'yoshi':
          case 'toad':
            image = body.url
            break;
          case 'cat':
            image = body.file
            break;
          case 'catgirl':
            image = `https://nekos.moe/image/${body.images[0].id}`;
            break;
          case 'bird':
            image = `https://random.birb.pw/img/${body.file}`;
        }

        var { body, statusCode, response } = req({url: image})
        if (statusCode == 404) {
          return msg.channel.send('404 Image not found. Try again!')
        }
      } else {
        if (statusCode == 404) {
          return msg.channel.send('404 API Not Found. Try again');
        } else if (statusCode == 429) {
          this.ratelimited = true;
          setTimeout(()=> {
            this.ratelimited = false;
          }, response.headers['retry-after']);
          return msg.channel.send('API is being ratelimited, please try again later.');
        } else {
          console.error(statusCode)
          return msg.channel.send('Unknown API Error. Try again');
        }
      }
    } else {
      var {body, statusCode, responce } = req({url: image})
      if (statusCode !== 200) {
        return msg.channel.send('Unknown error. Try again')
      }
      image = url;
    }

    const username = msg.member ? msg.member.displayName : msg.author.username;

    await msg.channel.send(`Alright ${username}, here's your image of a ${species}`, {files: [{attachment: image, name: `${species}.png`}] });
  }
};