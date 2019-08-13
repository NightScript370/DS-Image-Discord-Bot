const Command = require('../../struct/Command');

const smmdb_api = require('../../utils/smmdb');
const SMMDB = new smmdb_api()

module.exports = class SMMDBCourseCommand extends Command {
	constructor() {
		super('smmdb', {
			aliases: ['smmdb'],
			category: 'Useful',
            clientPermissions: ['EMBED_LINKS'],
			description: {
                content: 'Search a course from the Super Mario Maker Database website. This is a WIP command and as such will not work.',
                usage: '<name>',
                examples: ['SMB 1-1']
            },
			args: [
				{
				    id: 'title',
                    description: 'This is a mandatory parameter, which you would need to enter the level title',
				    prompt: {
                        start: "Which course from the Super Mario Maker Database would you like to get information from?",
                        retry: "There is not a thing we can get information for. Try again."
                    },
				    type: 'string',
                    match: 'rest'
				},
                {
                    id: 'type',
                    description: "This argument will allow you to search either Super Mario Maker (Wii U & 3DS) levels or Super Mario 64 Maker levels.",
                    match: 'option',
                    type: [['smm', 'mariomaker', 'supermariomaker', 'supermariomaker3ds', 'supermariomakerwiiu'], ['smm64', 'mariomaker64', 'mario64maker']],
                    default: 'smm',
                    flag: 'type:'
                },
                {
                    id: 'gamestyle',
                    description: "This argument will allow you to filter out specific game styles. The options are within SMB1, SMB3, SMW & NSMBU.",
                    match: 'option',
                    type: [['0', 'SMB1', 'M1'], ['1', 'SMB3', 'M3'], ['2', 'SMW', 'MW'], ['3', 'NSMBU', 'SMBU', 'NSMB', 'WU', 'MU']],
                    default: null,
                    flag: 'game:'
                },
                {
                    id: 'maker',
                    description: "This argument will allow you to filter out specific level designers.",
                    match: 'option',
                    type: 'string',
                    default: null,
                    flag: 'maker:'
                },
                {
                    id: 'difficulty',
                    description: 'This argument will allow you to filter out specific level difficulties, such as "Easy", "Normal", "Expert" & "Super-Expert"',
                    match: 'option',
                    type: 'string',
                    default: null,
                    flag: 'difficulty:'
                },
			]
		});
	}

    async exec(msg, { title, type, gamestyle, maker, difficulty }) {
        let filters = {};
        filters.title = title;
        filters.limit = 10

        if (gamestyle)
            filters.gamestyle = gamestyle;

        if (maker)
            filters.maker = maker;

        if (difficulty) {
            filters.difficultyfrom = difficulty;
            filters.difficultyto = difficulty
        }

        let courseList = await SMMDB.searchCourses(type, filters);

        let searchEmbed = this.client.util.embed()
            .setThumbnail('https://cdn.discordapp.com/attachments/463809347353444412/497059833879592961/coursebot.png')
            .setColor('#F6E23F')
            .setTitle('SMMDB Course Search', 'https://smmdb.ddns.net/')
        let result = await this.responceSelector(msg, courseList, searchEmbed);

        let CourseEmbed = this.client.util.embed();
        if (result && type == 'smm') {
            let gamestyle;

            switch (result.gamestyle) {
                case 0:
                    gamestyle = "Super Mario Bros.";
                    CourseEmbed.setColor("#D54B00");
                    break;
                case 1:
                    gamestyle = "Super Mario Bros. 3";
                    CourseEmbed.setColor("#FAEBD6");
                    break;
                case 2:
                    gamestyle = "Super Mario World";
                    CourseEmbed.setColor("#01F406");
                    break;
                case 3:
                    gamestyle = "New Super Mario Bros. U";
                    CourseEmbed.setColor("#0096C8");
                    break;
                case 4: // prepare for the SMMDB rewrite
                    gamestyle = "Super Mario 3D World";
                    CourseEmbed.setColor("#FFCA0D");
                    break;
            }

            CourseEmbed
                .setAuthor(result.title, `${this.client.URL}/icons/smm-course.png`)
                .setDescription(result.description ? result.description : '')
                .setThumbnail(`https://smmdb.ddns.net/courseimg/${result.id}`)
                .setImage(`https://smmdb.ddns.net/courseimg/${result.id}_full`)
                .setFooter(`Level created by ${result.maker}`)
                .setTimestamp(new Date(result.lastmodified));

            if (!result.widthSub) {
                CourseEmbed
                    .addInline('Game Style', gamestyle)
                    .addInline('Theme', this.SMMtheme(result.courseTheme))
                    .addInline('Difficulty', this.difficulty(result.difficulty))
                    .addInline('Auto-Scroll', this.autoScroll(result.autoScroll))
                    .addField('Extra',
                                `**Time:** ${result.time} \n`
                                `**Stars:** ${result.stars} \n`
                                `**Level Width:** ${result.width}`)
            } else {
                CourseEmbed
                    .addField('General Information',
                                `**Game Style:** ${gamestyle} \n\n`

                                `**Subtheme:** Available\n`
                                `**Difficulty:** ${difficulty}\n\n`
                                
                                `**Time:** ${result.time}\n`
                                `**Stars:** ${result.stars}`)
                    .addInline('Area 1',
                                `**Theme:** ${this.SMMtheme(result.courseTheme)} \n`
                                `**Auto Scroll:** ${this.autoScroll(result.autoScroll)} \n`
                                `**Area Width:** ${result.width}`)
                    .addInline('Area 2',
                                `**Theme:** ${this.SMMtheme(result.courseThemeSub)} \n`
                                `**Auto Scroll:** ${this.autoScroll(result.autoScrollSub)} \n`
                                `**Area Width:** ${result.widthSub}`);
            }

            CourseEmbed
                .addField('Download', `[3DS](https://smmdb.ddns.net/api/downloadcourse?id=${result.id}&type=3ds) | [Wii U](https://smmdb.ddns.net/api/downloadcourse?id=${result.id}&type=zip)`)
        } else {
            return msg.reply('The Super Mario Maker 64 portion of this command is not made yet. Please try again later');
        }

        msg.channel.send(`**${result.title}** - ${result.description}`, CourseEmbed)
	}

    async handleSelector(levels = [], index, embed=null, language=null) {
        let creator = levels[index].maker ? levels[index].maker : levels[index].uploader;

        if (embed) {
            embed.addField(`**${parseInt(index)+1}.** ${levels[index].name}`, `${global.getString(language, "by {0}", creator)}`);
            return embed;
        } else {
            return `**${parseInt(index)+1}.** ${levels[index].name} (${global.getString(language, "by {0}", creator)}) \n`;
        }
    }

    SMMtheme (number) {
        switch (number) {
            case 0:
                return "Ground";
            case 1:
                return "Underground";
            case 2:
                return "Castle";
            case 3:
                return "Airship";
            case 4:
                return "Underwater";
            case 5:
                return "Ghost House";
        }
    }

    autoScroll (number) {
        switch (number) {
            case 0:
                return "Disabled";
            case 1:
                return "Slow";
            case 2:
                return "Medium";
            case 3:
                return "Fast";
        }
    }

    difficulty (number) {
        switch (number) {
            case 0:
                return "Easy";
            case 1:
                return "Regular";
            case 2:
                return "Expert";
            case 3:
                return "Super Expert";
        }
    }

    SMM64theme (number) {
        switch (number) {
            case 0:
                return "None";
            case 1:
                return "Cave";
            case 2:
                return "Factory";
            case 3:
                return "Desert";
            case 4:
                return "Snow";
            case 5:
                return "Void";
            case 6:
                return "Lava";
            case 7:
                return "Beach";
            case 8:
                return "Grass";
            case 9:
                return "Lava Room";
            case 10:
                return "Sky";
            case 11:
                return "Fortress";
        }
    }
};
