const { Command } = require('discord-akairo');

module.exports = class ServerPointsCommand extends Command {
	constructor() {
		super('points', {
			aliases: ['points', "level"],
			category: 'Experience Points',
			description: {
				content: 'Shows a user\'s experience points.',
				usage: '<user. Leave blank for your points> guild:<optional field. This is available for viewing a specific guild\'s user point>',
				examples: ['178261738364338177', '209041316867342336 guild:318882333312679936']
			},
			args: [
				{
					id: 'user',
					type: 'user-commando',
					default: msg => msg.author,
					match: 'rest'
				},
				{
					id: 'guild',
					type: 'guild',
					default: msg => {
						if (msg.guild)
							return msg.guild;

						return null;
					},
					match: 'option',
					flag: 'guild:'
				}
			],
		});
	}

	async exec(message, { user, guild }) {
		const client = await this.client
		let guildFound;
		if (user.bot) return message.reply("bots do not collect Experience Points! Please try this command on a different user");
		
		if (guild) {
			if(!message.guild || (message.guild && message.guild.id !== guild.id)) {
				let guildFind = client.guilds.get(guild.id)
				if (!guildFind) return message.reply("Yamamura is not in that server. Therefore, I cannot get that server's points");

				if (!guildFind.members.has(message.author.id)) return message.reply('you may not see the statistics of a server you are not in. Try again later');

				guildFound = guildFind;
			} else {
				guildFound = message.guild
			}

			let guildMember = guildFound.members.get(user.id)
			let DBuser = await this.client.db.points.findOne({guild: guildFound.id, member: user.id});

			if (!DBuser) {
				if (guildMember)
					DBuser = await this.client.db.points.insert({guild: guildFound.id, member: user.id, points: 0, level: 0});
				else
					return message.reply("you can't see the points of a user who is/was not in the server. Please try again on a different user.");
			}

			let GuildPointsEmbed = this.client.util.embed()
				.setAuthor(`Showing stats for ${guildMember.displayName}`, user.displayAvatarURL({format: 'png'}))
				.setThumbnail(guildFound.iconURL({format: 'png'}))
				.setColor(guildMember.displayHexColor)
				.setYamamuraCredits(true)
				.setTimestamp(new Date());

			if (DBuser.points === Infinity) {
				GuildPointsEmbed
					.addInline("Points", "Infinity")
					.addInline("Level", "Infinity")
					.setDescription("There's no higher level that this user can reach. He is already at his maximum level possible.")
			} else {
				let nextlvl = (DBuser.level + 1) * 350;
				let diff = nextlvl - DBuser.points;

				GuildPointsEmbed
					.addInline("Points", DBuser.points)
					.addInline("Level", DBuser.level)
					.setDescription(`${diff} more points until level up!`)
			}

			return await message.util.send(`${guildMember.displayName} is currently standing at level ${DBuser.level} with ${DBuser.points} points.`, {embed: GuildPointsEmbed});
		}

		let guildsShare = false;
		let UserEmbed = this.client.util.embed()
			.setColor("#15f153")
			.setTitle(`Showing stats for ${user.username}`)
			.setTimestamp(new Date())
			.setThumbnail(user.displayAvatarURL({format: 'png'}))
			.setYamamuraCredits(true)
			.setColor("#FFFF00")

		this.client.guilds.filter(guildFound => guildFound.members.has(message.author) && guildFound.members.has(user)).forEach(guild => {
			let user = this.client.db.points.findOne({guild: guild.id, member: user.id});
			if (!user)
				this.client.db.points.insert({guild: guild.id, member: user.id, points: 0, level: 0});

			guildsShare = true;
			UserEmbed.addField(guild.name, `${user.points} (Level: ${user.level})`);
		});

		if (!guildsShare) return message.reply('we do not share any servers with this user. Please try again with a different user.');
		return await message.util.send({embed: UserEmbed});
	}
};