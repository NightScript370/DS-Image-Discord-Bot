const { Command } = require('discord-akairo');
const TurndownService = new (require('turndown'))({})
let turndown = TurndownService.turndown;

const request = require("request");
const {promisify, inspect} = require("util");
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

module.exports = class RPGCommand extends Command {
  constructor() {
    super('rpg', {
        category: 'MakerBoard Connectivity',
        aliases: ['rpg'],
        clientPermissions: ['EMBED_LINKS'],
        description: 'Returns the users RPG stats from a forum.',
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
              let serverconfig = this.client.db.serverconfig.findOne({guildID: msg.guild.id}) || this.client.setDefaultSettings(msg, this.client);
              return serverconfig.makerboard.value;
            }
          }
        ]
      });
    }

    async exec(msg, { name, makerBoardToPick }) {
      if (empty(makerBoardToPick)) {
        return msg.reply('please specify a MakerBoard website');
      }

      let MakerBoardLink = makerBoardToPick + '/API/profile.php?strip=true';
      if(msg.mentions.users.size) //If there is a user mentioned
			  MakerBoardLink += "&discord=" + msg.mentions.users.first().id;
      else {
        if (name === 'mine')  MakerBoardLink += '&discord=' + msg.author.id;
        else                  MakerBoardLink += '&name=' + name;
      }

      let { body, statusCode, responce } = await req({ url: MakerBoardLink, json: true })
      if (statusCode !== 200) {
        console.log(statusCode)
        return msg.reply('An unknown error has occured. Please try again')
      }

      if (empty(body.name))
        return msg.reply('the user could not be found on the server. Please try again.');

      let stats = '';
      if(!empty(body.HP)) stats += `**Health:** ${body.HP} \n`;
      if(!empty(body.exp)) stats += `**Experience:** ${body.exp} \n`;
      if(!empty(body.level)) stats += `**Level:** ${body.level} \n`;
      if(!empty(body.Atk)) stats += `**Attack:** ${body.Atk} \n`;
      if(!empty(body.Int)) stats += `**Inteligence:** ${body.Int} \n`;
      if(!empty(body.Spd)) stats += `**Speed:** ${body.Spd}`;

      let items = '';
      if(!empty(body.Weapons)) items += `**Weapon:** ${TurndownService.turndown(body.Weapons)} \n`;
      if(!empty(body.Armor))   items += `**Armor:** ${TurndownService.turndown(body.Armor)} \n`;
      if(!empty(body.Shields)) items += `**Shield:** ${TurndownService.turndown(body.Shields)} \n`;
      if(!empty(body.Helmets)) items += `**Helmet:** ${TurndownService.turndown(body.Helmets)} \n`;
      if(!empty(body.Boots))   items += `**Boots:** ${TurndownService.turndown(body.Boots)} \n`;
      if(!empty(body.Accessories)) items += `**Accessory:** ${TurndownService.turndown(body.Accessories)}`;

      let RPGStatsEmbed = this.client.util.embed()
        .setTimestamp(new Date())
        .setColor('#15f13')
        .setTitle(`${body.name}'s RPG stats`)
        .setImage(`${makerBoardToPick}/gfx/rpgstatus.php?u=${body.uid}`)
        .addInline("Player Stats", stats)
        .addInline("Player Items", items)
      
      if(!empty(body.avatar)) {
        RPGStatsEmbed
          .setThumbnail(body.avatar)
          .setFooter('Mario Making Mods' /* TODO: Link to Settings API */, makerBoardToPick + 'apple-touch-icon.png')
      } else {
        RPGStatsEmbed
          .setThumbnail(makerBoardToPick + 'apple-touch-icon.png')
          .setYamamuraCredits(true)
      }

      msg.util.send({embed: RPGStatsEmbed})
    }
};