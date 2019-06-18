const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class HackingGuidesCommand extends Command {
  constructor() {
    super('consolehackguide', {
      aliases: ['consolehackguide'],
      category: 'Useful',
      description: {
				content: 'Returns a link to a Nintendo Hacking Guide.',
        usage: '',
        example: ''
			},
			args: [
        {
					id: 'guideLink',
					type: ['3ds', 'dsi', 'flashcard', 'wii', 'wiiu', 'switch'],
          prompt: {
            start: "What's the Nintendo Console Hacking Guide you'd like to see?",
            retry: "There is not a thing we can get a guide for. Try again."
          },
          match: 'content'
        }
      ]
    });
  }

  async exec(msg, { guideLink }) {
    let embed = this.client.util.embed()

    switch (guideLink.toLowerCase()) {
      case '3ds':
        embed
          .setTitle('3DS Hacking Guide', 'https://3ds.hacks.guide')
          .setColor(49151)
          .setThumbnail('https://cdn.bulbagarden.net/upload/0/0f/Nintendo_3DS_Aqua_Blue.png')
          .addField('Do you need help modding your 3DS?', 'Follow [this](https://3ds.hacks.guide) 3DS guide, which will take you from a regular stock 3DS to a full Boot9Strap modified console.')
          .addField('Advantages to modding a 3DS', stripIndents`
                    - Run any software compatible, regardless of if Nintendo signed it or if it was made for your region
                    - Run game backups without requiring a physical cartridge
                    - Redirect the Software Data to the SD card, used for game modification.
                    - Customize your HOME Menu with user-created themes
                    - Experience software the way you'd like it with screenshots and cheat codes
                    - Backup, edit, and restore save data
                    - Play older software using their respective emulator.
                    - Stream live gameplay to your PC wirelessly with NTR CFW (requires a New system)`)
          .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png')
        break;
      case 'dsi':
          embed
            .setTitle('DSi Hacking Guide', 'https://dsi.cfw.guide')
            .setColor(16776918)
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/8/8b/Nintendo_dsi.png')
            .addField('Do you need help modding your Nintendo DSi?', 'Follow [this](https://dsi.cfw.guide) DSi guide, which will take you from regular stock DSi to a full HiyaCFW modified console.')
            .addField('Advantages to modding a DSi', stripIndents`
                    - Redirect your NAND to the SD
                    - Full SD NAND access
                    - All flashcards become compatible
                    - You can replace your home menu with TWiLightMenu++ for load games
                    - Launch DSiWares and even 3DS exclusive DSiWares from your SD
                    - You can use homebrew apps and un-signed apps
                    - You can use FreeNAND for use others DSi's NAND even of different regions`)
            .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png')
        break;
      case 'flashcard':
        embed
          .setTitle('Flashcard Setup guide', 'https://ds-homebrew.github.io/flashcard')
          .setColor(16767232)
          .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584841742772076575/flashcard.png')
          .addField('Do you need help setting up your flashcard?', 'Follow [this](https://ds-homebrew.github.io/flashcard) guide for setup and find out its compatibility on 3DS and DSi')
          .addField('Advantages to using a Flashcard', stripIndents`
                    - Play all DS games
                    - Roms are automatically AP patched
                    - Use cheat codes
                    - Use it for mod your 3DS using NTRBOOT HAX`)
          .setFooter('Guide by NightYoshi370', 'https://cdn.discordapp.com/avatars/178261738364338177/cf26b18ccdf91e6fdfb0720d8402ba36.png?size=2048')
        break;
      case 'wii':
        embed
          .setTitle('Wii Hacking Guide', 'https://wii.guide/')
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
          .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png')
        break;
      case 'wiiu':
        embed
          .setTitle('Wii U Hacking Guide', 'https://wiiu.hacks.guide/')
          .setColor(1050)
          .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584854074617233424/unknown_1.png')
          .addField('Do you need help modding your Nintendo Wii U?', 'Follow [this](https://wiiu.hacks.guide/) Wii U guide, which will take you from regular stock Wii U to a full Coldboot Haxchi modified console.')
          .addField('Advantages to modding a Wii U', stripIndents`
                    - Play all game discs and eShop games, regardless of region
                    - Backup, edit, and restore saves for many games
                    - Play games for older systems with various emulators, using RetroArch or other standalone emulators.
                    - Install homebrew titles to your system, and have them appear on your system menu
                    - Dump your discs to a format you can install, and play them without needing the disc`)
          .setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png')
        break;
      case 'switch':
        embed
          .setTitle('Switch Hacking Guide', 'https://nh-server.github.io/switch-guide/')
          .setColor(1179392)
          .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584859910882328674/switch.png')
          .addField('Do you need help modding your Nintendo Switch?', 'Follow [this](https://nh-server.github.io/switch-guide/) Switch guide, which will take you from regular stock Switch to a full Atmosphere CFW modified console.')
          .addField('Advantages to modding a Switch', stripIndents`
                    - Customize your HOME Menu with user-created themes and splash screens
                    - Use “ROM hacks” for games that you own
                    - Backup, edit, and restore saves for many games
                    - Play games for older systems with various emulators, using RetroArch or other standalone emulators
                    - Safely update to the latest system version without fear of losing access to homebrew`)
          .setFooter('Guide by Nintendo Homebrew', 'https://camo.githubusercontent.com/68f8c313af4f08a3a2db45c22154253bec6ee758/687474703a2f2f692e696d6775722e636f6d2f5348544c474f762e706e67')
    }

    msg.channel.send({embed})
  }
};