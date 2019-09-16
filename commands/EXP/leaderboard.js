const { Command } = require('discord-akairo');

module.exports = class LeaderboardCommand extends Command {
	constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', "lb", 'top'],
			category: 'Experience Points',
			description: {
				content: 'List all those with the highest amount of points',
				usage: 'num:<optional field> guild:<optional field. This is available for viewing a specific guild\'s user point>',
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
					type: (msg, phrase) => {
						if (!phrase || isNaN(phrase)) return null;
						const num = parseInt(phrase);
						if (num < 3 || num > 25) return null;
						return num;
					},
					default: 10,
					match: 'rest'
				}
			],
		});
	}

	async exec(msg, { guild, numberofresults }) {
		let medal, username, guildFound;
		console.log(numberofresults)

		if(guild) {
			if(!msg.guild || (msg.guild && msg.guild.id !== guild.id)) {
				let guildFind = this.client.guilds.get(guild.id)
				if (!guildFind) return msg.reply("Yamamura is not in that server. Therefore, I cannot get that server's points");

				if (!guildFind.members.has(msg.author.id)) return msg.reply('you may not see the statistics of a server you are not in. Try again later');

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
				if(numberofresults < 9) {
					// Now shake it and show it! (as a nice embed, too!)
					let guildFieldEmbed = this.client.util.embed()
						.setTitle(`Leaderboard for ${guildFound.name}`)
						.setFooter(`Handled by Yamamura`, this.client.user.displayAvatarURL({format: 'png'}))
						.setThumbnail(guildFound.iconURL({format: 'png'}))
						.setTimestamp(new Date())
						.setColor(0x00AE86);

					for(const lbdata of top10) {
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

							guildFieldEmbed.addField(medal + guildMember.displayName, `${lbdata.points} points (level ${lbdata.level})`, true);

							if(i == numberofresults)
								break;
						} catch (e) {
							console.error(e)
						}
					}
					guildFieldEmbed.setDescription(`Top ${i} posters`);

					return await msg.util.send({embed: guildFieldEmbed});
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

							uData += `**${medal}. <@${lbdata.member}>**: ${lbdata.points} points (level ${lbdata.level}) \n`;
							
							i = i + 1;
							
							if(i == numberofresults)
								break;
						} catch(e) {
							console.error(e)
						}
					}

					let guildDescriptionEmbed = this.client.util.embed()
						.setTitle(`Leaderboard for ${guildFound.name}`)
						.setFooter(`Handled by Yamamura`, this.client.user.displayAvatarURL({format: 'png'}))
						.setThumbnail(guildFound.iconURL({format: 'png'}))
						.setDescription(uData)
						.setTimestamp(new Date())
						.setColor(0x00AE86);

					return await msg.util.send({embed: guildDescriptionEmbed});
				}
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

		this.client.guilds.forEach(guild => {
			var filtered = this.client.db.points.find({ guild: guildFound.id });
			var sorted = filtered.sort((a, b) => b.points - a.points);
			var top10 = sorted.splice(0, 1);

			for(const lbdata of top10) {
				if(!guild.members.has(lbdata.member)) continue;
				DMembed.addField(guild.name, `${this.client.users.get(lbdata.member).tag} (${lbdata.points} points)`);
			}
		});
	}
};