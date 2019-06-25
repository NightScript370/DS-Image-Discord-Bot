const Command = require('../../struct/Command');
const { getCourseP } = require('super-maker-api');

const request = require("request");
const { promisify } = require("util");
const req = promisify(request);

module.exports = class CourseCommand extends Command {
	constructor() {
		super('smm-course', {
			aliases: ['smm-course'],
			category: 'Useful',
            clientPermissions: ['EMBED_LINKS'],
			description: {
                content: 'Search a Super Mario Maker course, either via name or ID.',
                usage: '<level ID or name>',
                examples: ['SMB 1-1']
            },
			examples: ['level XXXX-XXXX-XXXX', 'level SMB1 1-1'],
			args: [
				{
				    id: 'level',
				    prompt: {
                        start: "Which Super Mario Maker level would you like to get information from?",
                        retry: "There is not a thing we can get information for. Try again."
                    },
				    type: 'string',
                    match: 'rest'
				},
                {
                    id: 'makerOfMario',
                    match: 'flag',
                    flag: '--makersofmario'
                }
			]
		});
	}

    async exec(msg, { level, makerOfMario }) {
        const ID = /(?:(?:https?:\/\/)?(?:www\.)?supermariomakerbookmark\.nintendo\.net\/courses\/)?(([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4}))/gi;
        if (level.match(ID))
            return this.handleLevel(msg, level.toUpperCase());

        let url = `http://smm-db.glitch.me/levels/${level}`
        if (makerOfMario)
            url = `https://api.makersofmario.com/level/?method=search&limit=5&text=${level}`

        let { body, statusCode, responce } = await req({ url: url, json: true });
        if (statusCode !== 200) return msg.util.reply('Could not connect to the API');
        if (makerOfMario && body.success !== true) return msg.util.send(body.error.message);

        let embed = this.client.util.embed()
            .setThumbnail('https://cdn.discordapp.com/attachments/463809347353444412/497059833879592961/coursebot.png')
            .setColor('#F6E23F')
            .setTitle('Super Mario Maker (Wii U) Course World Search', 'https://supermariomakerbookmark.nintendo.net/')
        let result = await this.responceSelector(msg, makerOfMario ? body.data.results : body.splice(0, 6), embed)

        if (result) return this.handleLevel(msg, result.id)
	}

    filterID (string) {
        return string
            .replace('https://www.supermariomakerbookmark.nintendo.net/courses/'.toUpperCase(), '')
            .replace('https://supermariomakerbookmark.nintendo.net/courses/'.toUpperCase(), '')
            .replace('www.supermariomakerbookmark.nintendo.net/courses/'.toUpperCase(), '')
            .replace('supermariomakerbookmark.nintendo.net/courses/'.toUpperCase(), '')
            .replace('https://www.supermariomakerbookmark.nintendo.com/courses/'.toUpperCase(), '')
            .replace('https://supermariomakerbookmark.nintendo.com/courses/'.toUpperCase(), '')
            .replace('www.supermariomakerbookmark.nintendo.com/courses/'.toUpperCase(), '')
            .replace('supermariomakerbookmark.nintendo.com/courses/'.toUpperCase(), '')
    }

    async handleLevel(msg, ID) {
        try {
            let levelinfo = await getCourseP(ID)

            let clears = `${levelinfo.clears}/${levelinfo.attempts} (${levelinfo.clear_rate}%)`;

            if (levelinfo.world_record)
                clears += `\n **World Record:** ${levelinfo.world_record.time} by [${levelinfo.world_record.name}](${levelinfo.world_record.user_url})`;

            if (levelinfo.first_clear)
                clears += `\n **First Clear:** ${global.getString(msg.author.lang, "by {0}", `[${levelinfo.first_clear.name}](${levelinfo.first_clear.user_url})`)}`

            let levelstats = `**Difficulty:** ${levelinfo.difficulty} \n **Stars:** ${levelinfo.stars} \n **Game Style:** ${levelinfo.game_style}`;

            let CourseEmbed = this.client.util.embed()
                .setTitle(levelinfo.course_title)
                .setDescription(ID)
				.setImage(levelinfo.course_img_full)
				.setThumbnail(levelinfo.course_img)
				.setTimestamp(new Date())
				.setFooter(`Created by ${levelinfo.creator_name} on ${levelinfo.created_at}`, levelinfo.creator_img_url)
				.addInline('Clears', clears)
                .addInline('Level information', levelstats);

            switch(levelinfo.game_style_raw) {
		        case "sb":
                    CourseEmbed.setColor("#D54B00");
                    break;
                case "sb3":
                    CourseEmbed.setColor("#FAEBD6");
                    break;
                case "sw":
                    CourseEmbed.setColor("#01F406");
                    break;
                case "sbu":
                    CourseEmbed.setColor("#0096C8");
		    }

            msg.channel.send({embed: CourseEmbed})
        } catch (e) {
            console.error(e);
            msg.channel.send('An unknown error has occured. Please report it to the Yamamura developers')
        }
    }

    async handleSelector(levels, index, embed=null, language=null) {
        if (embed) {
            embed.addField(`**${parseInt(index)+1}.** ${levels[index].name}`, `${levels[index].id} | ${global.getString(language, "by {0}", levels[index].creator_ntd_name)}`);
        } else {
            return `**${parseInt(index)+1}.** ${levels[index].name} (${global.getString(language, "by {0}", levels[index].creator_ntd_name)}) \n`;
        }

        return embed
    }
};
