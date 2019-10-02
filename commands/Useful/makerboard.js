const { Command } = require('discord-akairo');
const TurndownService = new (require('turndown'))({})
let turndown = TurndownService.turndown;

const request = require("request");
const { promisify } = require("util");
const req = promisify(request);

function empty(value) { //Function to check if value is really empty or not
	return (value == null || value.length === 0);
}

function stripHTML(text) {
	text = text.replace(/<style([\s\S]*?)<\/style>/gi, '');
	text = text.replace(/<script([\s\S]*?)<\/script>/gi, '');
	text = text.replace(/<\/div>/ig, '\n');
	text = text.replace(/<\/li>/ig, '\n');
	text = text.replace(/<li>/ig, '  *  ');
	text = text.replace(/<\/ul>/ig, '\n');
	text = text.replace(/<\/p>/ig, '\n');
	text = text.replace(/<br\s*[\/]?>/gi, "\n");
	text = text.replace(/<[^>]+>/ig, '');
	return text;
}

module.exports = class MakerBoardCommand extends Command {
	constructor() {
		super('makerboard', {
			category: 'Useful',
			aliases: ['makerboard'],
			clientPermissions: ['EMBED_LINKS'],
			description: 'Returns a user\'s profile from a MakerBoard website.',
	  		args: [
				{
					id: 'name',
					type: 'string',
					default: 'mine'
				},
				{
					id: 'makerBoardToPick',
					match: 'option',
					type: 'string',
					flag: ['makerBoardURL:', 'url:', 'makerboard:', 'website:'],
					default: msg => {
						if (!msg.guild) return null;
						
						return msg.guild.conf.data.makerboard;
					}
				},
				{
					id: 'bio',
					match: 'flag',
					flag: '--bio'
				},
				{
					id: 'rpgstatus',
					match: 'flag',
					flag: '--rpg'
				}
			]
		});
	}

	async exec(msg, { name, makerBoardToPick, bio, rpgstatus }) {
		if (empty(makerBoardToPick)) {
			return msg.reply('please specify a MakerBoard website');
		}

		let MakerBoardLink = makerBoardToPick + '/API/profile.php?strip=true';
		if(msg.mentions.users.size) //If there is a user mentioned
			MakerBoardLink += "&discord=" + msg.mentions.users.first().id;
		else {
			if (name === 'mine')  MakerBoardLink += '&discord=' + msg.author.id;
			else				  MakerBoardLink += '&name=' + name;
		}

		let { body, statusCode, responce } = await req({ url: MakerBoardLink, json: true });
		if (statusCode !== 200) {
			console.log(statusCode);
			return msg.reply('An unknown error has occured. Please try again');
		}

		if (empty(body.name))
			return msg.reply('the user could not be found on the server. Please try again.');

		let ProfileEmbed = this.client.util.embed()
			.setTimestamp(new Date())
			.setColor('#15f13')
			.setAuthor(`${body.name}'s ${rpgstatus ? 'RPG Stats' : bio ? 'Biography' : 'Profile'}`, body.avatar, makerBoardToPick + '/profile/' + body.uid)
			.setThumbnail(makerBoardToPick + '/apple-touch-icon.png')
			.setYamamuraCredits(true);

		if(empty(stripHTML(body.Bio)) && !rpgstatus && bio)
			return msg.reply("We're sorry, but this user does not have a biography");

		if (!empty(stripHTML(body.Bio)) && ((!rpgstatus && !bio) || bio))
			ProfileEmbed.setDescription(TurndownService.turndown(body.Bio));

		if (!bio && !rpgstatus) {
			if(!empty(body.title)) ProfileEmbed.addField("Title", `${body.title}`);
			if(!empty(body.totalposts)) ProfileEmbed.addInline("Posts", `${TurndownService.turndown(body.totalposts)}`);
			if(!empty(body.Totalthreads)) ProfileEmbed.addInline("Threads", `${body.Totalthreads}`);
			if(!empty(body.groups)) ProfileEmbed.addField("Groups", `${body.groups}`);
			if(!empty(body.location)) ProfileEmbed.addField("Location", `${body.location}`);
			if(!empty(body.birthday)) ProfileEmbed.addField("Birthday", `${body.birthday}`);
		}

		if (rpgststus) {
			if(!empty(body.HP)) ProfileEmbed.addInline("Health", body.HP);
			if(!empty(body.exp)) ProfileEmbed.addInline("Experience", body.exp);
			if(!empty(body.level)) ProfileEmbed.addInline("Level", body.level);
			if(!empty(body.Atk)) ProfileEmbed.addInline("Attack", body.Atk);
			if(!empty(body.Int)) ProfileEmbed.addInline("Inteligence", body.Int);
			if(!empty(body.Spd)) ProfileEmbed.addInline("Speed", body.Spd);
			if(!empty(body.Weapons)) ProfileEmbed.addInline("Weapon", TurndownService.turndown(body.Weapons));
			if(!empty(body.Armor))   ProfileEmbed.addInline("Armor", TurndownService.turndown(body.Armor));
			if(!empty(body.Shields)) ProfileEmbed.addInline("Shield", TurndownService.turndown(body.Shields));
			if(!empty(body.Helmets)) ProfileEmbed.addInline("Helmet", TurndownService.turndown(body.Helmets));
			if(!empty(body.Boots))   ProfileEmbed.addInline("Boots", TurndownService.turndown(body.Boots));
			if(!empty(body.Accessories)) ProfileEmbed.addInline("Accessory", TurndownService.turndown(body.Accessories));
		}

		msg.util.send({embed: ProfileEmbed});
	}
};
