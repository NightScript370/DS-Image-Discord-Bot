const { Command } = require('discord-akairo');
const { javierInteger } = require('../../utils/types');

module.exports = class LeaderboardCommand extends Command {
	constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', "lb", 'top'],
			category: 'Experience Points',
			description: {
				content: 'List all those with the highest amount of points',
				usage: '[number of results: min is 3, max is 25. Any invalid result will give 10] guild:<optional field. This is available for viewing a specific guild\'s user point>',
				examples: ['5', '5 guild:318882333312679936']
			},
			args: [
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
				},
				{
					id: 'numberofresults',
					type: (msg, number) => {
						if (!number)
							return null;

						const returnvalue = javierInteger(message, number);
						if (isNaN(returnvalue)) return null;
						if (returnvalue == null) return null;

						if (returnvalue < 3) return null;
						if (returnvalue > 25) return null;

						return returnvalue;
					},
					default: 10,
					match: 'rest'
				}
			],
		});
	}

	async exec(msg, { guild, numberofresults }) {
		const __ = (k, ...v) => global.translate(msg.author.lang, k, ...v);
		let medal, username, guildFound;

		if(guild) {
			if(!msg.guild || (msg.guild && msg.guild.id !== guild.id)) {
				let guildFind = this.client.guilds.get(guild.id)
				if (!guildFind) return msg.util.reply(__("{0} is not in that server. Therefore, I cannot get that server's points", this.client.user.username));

				if (!guildFind.members.has(msg.author.id)) return msg.util.reply(__('you may not see the statistics of a server you are not in. Try again later'));

				guildFound = guildFind;
			} else {
				guildFound = msg.guild
			}

			let filtered = this.client.db.points.find({ guild: guildFound.id });
			let top10 = filtered.sort((a, b) => b.points - a.points);
			top10.length = Math.min(numberofresults || top10.length, top10.length);
			let i = 0;
			let guildMember;

			if(guildFound.me.hasPermission('EMBED_LINKS')) {
				let guildEmbed = this.client.util.embed()
					.setTitle(__('Leaderboard for {0}', guildFound.name))
					.setFooter(__("Points system handled by {0}", this.client.user.username), this.client.user.displayAvatarURL({format: 'png'}))
					.setThumbnail(guildFound.iconURL({format: 'png'}))
					.setTimestamp(new Date())
					.setColor(0x00AE86);

				if (numberofresults < 9) {
					for (const lbdata of top10) {
						if (!this.client.users.has(lbdata.member)) continue;

						try {
							i = i + 1
							
							switch (i) {
								case 1:
									medal = "🥇 ";
									break;
								case 2:
									medal = "🥈 ";
									break;
								case 3:
									medal = "🥉 ";
									break;
								default:
									medal = "";
							}

							guildMember = guildFound.members.find(member => member.id == lbdata.member);
							if (guildMember.author.bot)
								return;

							guildEmbed.addField(medal + guildMember.displayName, __('{0} points (Level: {1})', lbdata.points, lbdata.level), true);

							if(i == numberofresults)
								break;
						} catch (e) {
							console.error(e)
						}
					}
					guildEmbed.setDescription(__("Top {0} posters", i));
				} else {
					var uData = '';

					for(const lbdata of top10) {
						if(!msg.guild.members.has(lbdata.member)) continue;
						try {
							
							switch (i + 1) {
								case 1:
									medal = "🥇";
									break;
								case 2:
									medal = "🥈";
									break;
								case 3:
									medal = "🥉";
									break;
								case 4:
									medal = ":four:";
									break;
								case 5:
									medal = ":five:";
									break;
								case 6:
									medal = ":six:";
									break;
								case 7:
									medal = ":seven:";
									break;
								case 8:
									medal = ":eight:";
									break;
								case 9:
									medal = ":nine:";
									break;
								default:
									medal = i + 1;
							}

							uData += `**${medal}. <@${lbdata.member}>**: ${__('{0} points (Level: {1})', lbdata.points, lbdata.level)}\n`;
							
							i = i + 1;
							
							if(i == numberofresults)
								break;
						} catch(e) {
							console.error(e)
						}
					}

					guildEmbed.setDescription(uData)
				}

				return await msg.util.send({embed: guildEmbed});
			}

			if(numberofresults > 18) return msg.reply("Too High!");

			let uDataembedless = '';
			for(const lbdata of top10) {
				if(!guildFound.members.has(lbdata.member)) continue;
				try {
					uDataembedless += `**${i + 1}. ${guildFound.members.find(member => member.id == lbdata.member).displayName || this.client.users.get(lbdata.member).username}**: ${lbdata.points} points (level ${lbdata.level}) \n`;
					i = i + 1;

					if(i == numberofresults)
						break;
				} catch(e) {
					console.error(e)
				}
			}

			let title = guildFound.name + ` Leaderboard - Top ${i}`;

			let post = title + '\n\n' + uDataembedless;
			return msg.channel.send(post);
		}

		let DMembed = this.client.util.embed()
			.setTitle("Yamamura Leaderboard")
			.setYamamuraCredits(false)
			.setTimestamp(new Date())
			.setColor(0x00AE86);

		this.client.guilds.filter(guild => guild.members.has(msg.author.id)).forEach(guild => {
			var leaderboard = this.client.db.points.find({ guild: guild.id }).sort((a, b) => b.points - a.points);
			var topuser = leaderboard[0];

			if (!guild.members.has(topuser.member)) return;
			DMembed.addField(guild.name, `${this.client.users.get(topuser.member).tag} (${topuser.points} points)`);
		});

		msg.util.send(DMembed)
	}
};