import discordAkairo from 'discord-akairo';
import { utc } from 'moment';

const activities = {
	PLAYING: 'Playing',
	STREAMING: 'Streaming',
	WATCHING: 'Watching',
	LISTENING: 'Listening to'
};

export default class DiscordProfileCommand extends discordAkairo.Command {
	constructor() {
		super('profile', {
			aliases: ['user', 'member', 'profile', 'user-profile', 'member-profile', 'userinfo', 'memberinfo', 'profileinfo'],
			category: 'Useful',
			clientPermissions: ['ATTACH_FILES'],
			description: {
				content: 'Returns information on a certain user.'
			},
			args: [
				{
					id: 'user',
					type: 'user-commando',
					default: msg => msg.author,
					match: 'content'
				}
			]
		});
	}

	async exec(msg, { user }) {
		const __ = (k, ...v) => global.translate(msg.author.lang, k, ...v);

		if (msg.author.id !== user.id) {
			let guildsTogether = this.client.guilds.filter(guild => guild.members.has(user.id) && guild.members.has(msg.author.id));
			if (!guildsTogether.size)
				return msg.reply("We're sorry, but you may not use the profile command to find users that you do not share a server with. Please try again on a different member.");
		}

		let member;
		if (msg.guild)
			member = await msg.guild.members.get(user.id);

		let embed = this.client.util.embed()
			.setTitle(__("Information on {0}", member ? member.displayName : user.username))
			.setThumbnail(user.displayAvatarURL())
			.setYamamuraCredits(true);

		if (member) {
			if (member.presence.activity)
				embed.setDescription((activities[member.presence.activity.type] || '') + " **" + (member.presence.activity.name == "Custom Status" ? member.presence.activity.state : member.presence.activity.name) + "**")

			if (!user.bot) {
				let DBuser = this.client.db.points.findOne({guild: msg.guild.id, member: user.id}) || await this.client.db.points.insert({guild: msg.guild.id, member: user.id, points: 0, level: 0});

				embed
					.addInline("Points", DBuser.points == Infinity ? "Infinity" : DBuser.points)
					.addInline("Level", DBuser.points == Infinity ? "Infinity": DBuser.level)
			}

			try {
				const roles = (member.roles ? member.roles
					.filter(role => role.id !== msg.guild.roles.everyone.id)
					.sort((a, b) => b.position - a.position)
					.map(role => role.name) : []);

				embed.addField(__("Roles ({0})", roles.length), roles.length ? this.trimArray(roles).join(', ') : 'None' + '\n\n'
															  + member.roles.highest.id === member.guild.defaultRole.id ? '' : `**Highest Role:** ${member.roles.highest.name} \n`
															  + this.isGood(member.roles.hoist) ? `**Hoist Role:** ${member.roles.hoist.name}` : '')
			} catch (e) {
				console.error(e);
			}

			embed
				.setColor(member.displayHexColor)
				.addInline('Server Join Date', utc(member.joinedAt).format('MM/DD/YYYY h:mm A'));
		}

		embed
			.addInline('Discord Join Date', utc(user.createdAt).format('MM/DD/YYYY h:mm A'))
			.addField('Advanced Discord Identity', `${user.tag} (#${user.id})`);

		msg.channel.send(embed);
	}

	trimArray(arr) {
		if (arr.length > 10) {
			const len = arr.length - 10;
			arr = arr.slice(0, 10);
		}
		return arr;
	}
};