'use strict';

import { Command } from 'discord-akairo';
import javierInteger from '../../utils/types.js';

export default class LeaderboardCommand extends Command {
	constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', "lb", 'top'],
			category: 'Experience Points',
			description: {
				content: 'List all those with the highest amount of points',
				usage: '[numberofresults] guild:<ID>',
				examples: ['5', '5 guild:318882333312679936']
			},
			args: [
				{
					id: 'guild',
					description: "Optional field that allows you to view another servers EXP leaderboard provided you're in that server",
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
					description: "Sets the number of results that you optain. The minimum is 1 and maximum is 25 (unless you have embeds disabled, in which it'll be 18). Having an invalid value/no value at all will set the number depending on how many users are in the server",
					type: (message, number) => {
						if (!number)
							return null;

						const returnvalue = javierInteger(message, number);
						if (isNaN(returnvalue)) return null;
						if (returnvalue == null) return null;

						if (returnvalue < 1) return null;
						if (returnvalue > 25) return null;

						return returnvalue;
					},
					default: null,
					match: 'rest'
				}
			],
		});
	}

	async exec(msg, { guild, numberofresults }) {
		const __ = (k, ...v) => global.translate(msg.author.lang, k, ...v);
		let medal;

		if (guild) {
			let guildFound;

			if (!msg.guild || (msg.guild && msg.guild.id !== guild.id)) {
				let guildFind = this.client.guilds.get(guild.id)
				if (!guildFind) return msg.util.reply(__("{0} is not in that server. Therefore, I cannot get that server's points", this.client.user.username));

				if (!guildFind.members.has(msg.author.id)) return msg.util.reply(__('you may not see the statistics of a server you are not in. Try again later'));

				guildFound = guildFind;
			} else
				guildFound = msg.guild;

			let top10 = this.client.db.points.find({ guild: guildFound.id }).sort((a, b) => b.points - a.points); // I'm not sure if this is the right way to sort
			top10.length = Math.min(numberofresults || Math.floor(Math.min(Math.sqrt(3 * top10.length), 25)), top10.length);

			let i = 0;
			let message = __('Leaderboard for {0}', guildFound.name)
			let leaderboardRow;
			let userFoundInLB;

			if (msg.channel.embedable) {
				let guildEmbed = this.client.util.embed()
					.setFooter(__("Points system handled by {0}", this.client.user.username), this.client.user.displayAvatarURL({format: 'png'}))
					.setThumbnail(guildFound.iconURL({format: 'png'}))
					.setTimestamp(new Date())
					.setColor(0x00AE86) // Hmm, how should I handle color? Maybe make it so that the higher the average, the golder it gets. The lower the average, the bronzer it gets

				if (top10.length < 12) {
					let guildMember;

					for (leaderboardRow of top10) {
						userFoundInLB = this.client.users.get(leaderboardRow.member);
						if (!userFoundInLB || (userFoundInLB && userFoundInLB.bot))
							continue;

						i++;
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
								medal = `${i}. `;
						}

						guildMember = guildFound.members.get(leaderboardRow.member);
						guildEmbed.addInline(medal + guildMember.displayName, __('{0} points (Level: {1})', leaderboardRow.points, leaderboardRow.level));
					}

					guildEmbed.setDescription(__("Top {0} posters", i));
				} else {
					let uData = '';

					for (leaderboardRow of top10) {
						userFoundInLB = this.client.users.get(leaderboardRow.member);
						if (!userFoundInLB || (userFoundInLB && userFoundInLB.bot))
							continue;

						i++;
						switch (i) {
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
								medal = `${i}.`;
						}

						uData += `**${medal} <@${leaderboardRow.member}>**: ${__('{0} points (Level: {1})', leaderboardRow.points, leaderboardRow.level)}\n`;
					}

					guildEmbed.setDescription(uData)
				}

				return msg.util.send(message, {embed: guildEmbed});
			}

			let uDataembedless = '';
			for (leaderboardRow of top10) {
				userFoundInLB = this.client.users.get(leaderboardRow.member);
				if (!userFoundInLB || (userFoundInLB && userFoundInLB.bot))
					continue;

				i++;
				switch (i) {
					case 1:
						medal = "🥇";
						break;
					case 2:
						medal = "🥈";
						break;
					case 3:
						medal = "🥉";
						break;
					default:
						medal = `${i}.`;
				}

				uDataembedless += `**${medal} ${guildFound.members.find(member => member.id == leaderboardRow.member).displayName || this.client.users.get(leaderboardRow.member).username}**: ${leaderboardRow.points} points (level ${leaderboardRow.level}) \n`;
			}

			message += ` - ${__("Top {0}", i)} \n\n ` + uDataembedless;
			return msg.channel.send(message);
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