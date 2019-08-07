const { Command } = require('discord-akairo');
const moment = require('moment');

const activities = {
	PLAYING: 'Playing',
	STREAMING: 'Streaming',
	WATCHING: 'Watching',
	LISTENING: 'Listening to'
};

module.exports = class DiscordProfileCommand extends Command {
    constructor() {
        super('profile', {
            aliases: ['user', 'member', 'profile', 'user-profile', 'member-profile'],
            category: 'Useful',
            clientPermissions: ['ATTACH_FILES'],
            description: {
				content: 'Returns your user ID.',
                usage: '',
                example: ''
			},
			args: [
                {
					id: 'user',
					type: 'user',
                    default: msg => msg.author,
                    match: 'content'
                }
            ]
        });
    }

    async exec(msg, { user }) {
        let member;
        if (msg.guild) {
            member = await msg.guild.members.get(user.id);
        }

        let embed = this.client.util.embed()
            .setTitle(`Information on ${member ? member.displayName : user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .setYamamuraCredits(true);

        if (member) {
            const roles = member.roles
				.filter(role => role.id !== msg.guild.defaultRole.id)
				.sort((a, b) => b.position - a.position)
				.map(role => role.name);

            let DBuser = this.client.db.points.findOne({guild: msg.guild.id, member: user.id}) || await this.client.db.points.insert({guild: guildFound.id, member: user.id, points: 0, level: 0});

            embed
                .addInline("Points", DBuser.points == Infinity ? "Infinity" : DBuser.points)
                .addInline("Level", DBuser.points == Infinity ? "Infinity": DBuser.level)
				.setColor(member.displayHexColor)
				.setDescription(member.presence.activity
					? `${activities[member.presence.activity.type]} **${member.presence.activity.name}**`
					: '')
                .addField(`Roles (${roles.length})`, roles.length ? this.trimArray(roles).join(', ') : 'None' + '\n\n'
                                             + member.roles.highest.id === member.guild.defaultRole.id ? '' : `**Highest Role:** ${member.roles.highest.name} \n`
                                             + member.roles.hoist ? `**Hoist Role:** ${member.roles.hoist.name}` : '')
                .addInline('Server Join Date', moment.utc(member.joinedAt).format('MM/DD/YYYY h:mm A'));
        }

        embed
            .addInline('Discord Join Date', moment.utc(user.createdAt).format('MM/DD/YYYY h:mm A'))
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