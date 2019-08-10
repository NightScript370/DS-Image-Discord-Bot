const Command = require('../../struct/Command');

const smmdb_api = require('../../utils/smmdb');
const SMMDB = new smmdb_api()

module.exports = class CourseCommand extends Command {
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
                    type: [['SMB1', 'M1'], ['SMB3', 'M3'], ['SMW', 'MW'], ['NSMBU', 'SMBU', 'NSMB', 'WU', 'MU']],
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

    async exec(msg, { title, type, gamestyle }) {
        msg.reply('This is a WIP command, and as such does not work. Please try again later')
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
