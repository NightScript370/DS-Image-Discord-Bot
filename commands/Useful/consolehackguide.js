const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class HackingGuidesCommand extends Command {
    constructor() {
        super('consolehackguide', {
            aliases: ['consolehackguide'],
            category: 'Useful',
            description: {
				content: 'Returns a link to a Hacking Guide.',
                usage: '<console you\'d like to hack>',
                example: ''
			},
			args: [
                {
					id: 'guide',
					type: [['3ds', '3dsxl', '3dsll', '2ds', 'new3ds', 'new3dsxl', 'new3dsll', 'new2ds', 'new2dsxl', 'new2dsll'], 'dsi', 'flashcard', 'wii', 'wiiu', ['switch', 'nx']],
                    prompt: {
                        start: "What's the Nintendo Console Hacking Guide you'd like to see?",
                        retry: "There is not a thing we can get a guide for. Try again."
                    },
                    match: 'content'
                }
            ]
        });
    }

    async exec(msg, { guide }) {
        let embed = this.client.util.embed()

        switch (guide.toLowerCase()) {
            case '3ds':
                embed
                    .setTitle('Nintendo 3DS Hacking Guide', 'https://3ds.hacks.guide')
                    .setColor(49151)
                    .setThumbnail('https://cdn.bulbagarden.net/upload/0/0f/Nintendo_3DS_Aqua_Blue.png')
                    .addField('Do you need help modding your 3DS?', 'Follow [this](https://3ds.hacks.guide) 3DS guide, which will take you from a regular stock 3DS to a full Boot9Strap modified console.')
                    .addField('Advantages to modding a 3DS', stripIndents`
                             - Redirect your NAND to the SD card
                             - Run any software compatible, regardless of if Nintendo signed it or if it was made for your region
                             - Run game backups without requiring a physical cartridge
                             - Redirect the Software Data to the SD card, used for software modification.
                             - Customize your HOME Menu with user-created themes
                             - Experience software the way you'd like it with screenshots and cheat codes
                             - Backup, edit, and restore save data
                             - Play older software using their respective emulator.
                             - Stream live gameplay to your PC wirelessly with NTR CFW (requires a New system)`)
                    .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png');
                break;
            case 'dsi':
                embed
                    .setTitle('Nintendo DSi Hacking Guide', 'https://dsi.cfw.guide')
                    .setColor(16776918)
                    .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/8/8b/Nintendo_dsi.png')
                    .addField('Do you need help modding your Nintendo DSi?', 'Follow [this](https://dsi.cfw.guide) DSi guide, which will take you from regular stock DSi to a full HiyaCFW modified console.')
                    .addField('Advantages to modding a DSi', stripIndents`
                             - Redirect your NAND to the SD card
                             - All flashcards become compatible
                             - Replace your home menu with TWiLightMenu++, an SD card file manager
                             - Launch any DSiWare (out-of-region & 3DS exclusives) from your SD card
                             - You can use homebrew apps and un-signed apps
                             - You can use FreeNAND for use others DSi's NAND even of different regions`)
                    .setFooter('Guide by RocketRobz');
                break;
            case 'flashcard':
                embed
                    .setTitle('Nintendo DS Flashcard Setup guide', 'https://ds-homebrew.github.io/flashcard')
                    .setColor(16767232)
                    .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584841742772076575/flashcard.png')
                    .addField('Do you need help setting up your flashcard?', 'Follow [this](https://ds-homebrew.github.io/flashcard) guide for setup and find out its compatibility on 3DS and DSi')
                    .addField('Advantages to using a Flashcard', stripIndents`
                             - Play any DS ROMs
                             - Use cheat codes
                             - Use it for mod your 3DS using NTRBOOT HAX`)
                    .setFooter('Guide by NightYoshi370', 'https://cdn.discordapp.com/avatars/178261738364338177/cf26b18ccdf91e6fdfb0720d8402ba36.png?size=2048');
                break;
            case 'wii':
                embed
                    .setTitle('Nintendo Wii Hacking Guide', 'https://wii.guide/')
                    .setColor(16711731)
                    .setThumbnail('https://www.nintendoservicecentre.co.uk/images/products/2100866A.png')
                    .addField('Do you need help modding your Nintendo Wii?', 'Follow [this](https://wii.guide/) Wii guide, which will take you from regular stock Wii to a full Homebrew modified console.')
                    .addField('Advantages to modding a Wii', stripIndents`
                             - Use Wii services such as Nintendo Wi-Fi Connection and WiiConnect24 again, even though it has been discontinued
                             - Run any software compatible, regardless if Nintendo signed it or it's not for your region
                             - Dump and run both Wii and GameCube software without requiring a Disk
                             - Redirect Software data to the SD card to play Game Modifications
                             - Customize the functionality of the Wii Menu
                             - Play retro software using their respective emulator`)
                    .setFooter('Guide by Team RiiConnect24', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png');
                break;
            case 'wiiu':
                embed
                    .setTitle('Nintendo Wii U Hacking Guide', 'https://wiiu.hacks.guide/')
                    .setColor(1050)
                    .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584854074617233424/unknown_1.png')
                    .addField('Do you need help modding your Nintendo Wii U?', 'Follow [this](https://wiiu.hacks.guide/) Wii U guide, which will take you from regular stock Wii U to a full Coldboot Haxchi modified console.')
                    .addField('Advantages to modding a Nintendo Wii U', stripIndents`
                             - Play all game discs and eShop games, regardless of region
                             - Backup, edit, and restore saves for many games
                             - Play games for older systems with various emulators, using RetroArch or other standalone emulators.
                             - Install homebrew titles to your system, and have them appear on your system menu
                             - Dump your discs to a format you can install, and play them without needing the disc`)
                    .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png');
                break;
            case 'switch':
                embed
                    .setTitle('Nintendo Switch Hacking Guide', 'https://nh-server.github.io/switch-guide/')
                    .setColor(1179392)
                    .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584859910882328674/switch.png')
                    .addField('Do you need help modding your Nintendo Switch?', 'Follow [this](https://nh-server.github.io/switch-guide/) Switch guide, which will take you from regular stock Switch to a full Atmosphere CFW modified console.')
                    .addField('Advantages to modding a Nintendo Switch', stripIndents`
                             - Customize your HOME Menu with user-created themes and splash screens
                             - Use “ROM hacks” for games that you own
                             - Backup, edit, and restore saves for many games
                             - Play games for older systems with various emulators, using RetroArch or other standalone emulators
                             - Safely update to the latest system version without fear of losing access to homebrew`)
                    .setFooter('Guide by Nintendo Homebrew', 'https://camo.githubusercontent.com/68f8c313af4f08a3a2db45c22154253bec6ee758/687474703a2f2f692e696d6775722e636f6d2f5348544c474f762e706e67');
        }

        msg.channel.send({embed});
    }
};