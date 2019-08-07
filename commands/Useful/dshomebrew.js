const { Command } = require('discord-akairo');

module.exports = class HackingGuidesCommand extends Command {
  constructor() {
    super('dshomebrew', {
      aliases: ['dshomebrew', 'dshax'],
      category: 'Useful',
      description: {
				content: 'Returns information on Nintendo DS Homebrew.',
        usage: '[The specific homebrew you would like to view information on]',
        example: ['twilightmenu++']
			},
			args: [
        {
					id: 'homebrew',
          description: 'List the specific homebrew you would like to view information on.',
					type: [['twlmenu', 'twilight', 'twilightmenu', 'twlmenu++', 'twilightmenu++'], 'nds-bootstrap', 'rocketvideoplayer', 'lolsnes', 'nesDS', ['pkmn-chest', 'pkmn chest'], ['relaunch', 'buttonboot', 'button boot', 'button-boot']],
          prompt: {
            start: "What's the Nintendo DS Homebrew you'd like to see?",
            retry: "There is not a thing we can get information for. Try again."
          },
          match: 'content'
        }
      ]
    });
  }

  async exec(msg, { homebrew }) {
    let embed = this.client.util.embed()
    let text = '';

    switch (homebrew.toLowerCase()) {
      case 'twlmenu':
        text = '**TWiLight Menu++** is an open-source DSi Menu upgrade/replacement, and frontend for nds-bootstrap for DSi, 3DS, and flashcards.';

        embed
          .setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585297998875983872/unknown.png')
          .addInline('Social Links', '• [Github Repository](https://github.com/DS-Homebrew/TWiLightMenu) \n'
                                   + '• [GBATemp Thread](https://gbatemp.net/threads/ds-i-3ds-twilight-menu-gui-for-ds-i-games-and-ds-i-menu-replacement.472200/) \n'
                                   + '• [Discord Server](https://discord.gg/yqSut8c)')
          .addInline('Supported Formats', '• `.nds` and `.dsi` via nds-bootstrap \n'
                                        + '• `.gg` and `.sms` via S8DS \n'
                                        + '• `.nes` via nesDS \n'
                                        + '• `.sfc` and `.smc` via SNEmulDS \n'
                                        + '• `.gb` and `.gbc` via GameYob \n'
                                        + '• `.gba` via GBARunner2')
          .setColor('#A701E9')
          .setImage('https://media.discordapp.net/attachments/283770736215195648/608017242659225651/image0.jpg')
          .setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif')
        break;
      case 'rocketvideoplayer':
        text = '**Rocket Video Player** is an open-source video player powered by Rocket Video Technology. It can be used on a Nintendo DSi, a Nintendo 3DS or a Nintendo DS Flashcart by playing a .rvid video file from your SD card.';

        embed
          .setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585668151191011338/Rocket_Video_Player_logo_2.png')
          .addField('Social Links', '• [GBAtemp Thread](https://gbatemp.net/threads/release-rocket-video-player-play-videos-with-the-ultimate-in-picture-quality.539163/) \n'
                                  + '• [Github Repository](https://github.com/RocketRobz/RocketVideoPlayer/releases) \n'
                                  + '• [Discord Server](https://discord.gg/yqSut8c)')
          .setColor('#A701E9')
          .setImage('https://cdn.discordapp.com/attachments/283771381735489537/579915898240892928/IMG_20190519_235944_994_cropped_and_resized.png')
          .setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif')
        break;
      case 'nds-bootstrap':
        text = '**nds-bootstrap** is an open-source application that allows Nintendo DS/DSi ROMs and homebrew to be natively utilised rather than using an emulator. nds-bootstrap works on Nintendo DSi/3DS SD cards through CFW and on Nintendo DS through flashcarts.';

        embed
          .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/585529778627674122/df6f574fd4b252a788278f28c64c7ec2af011d4d_s2_n2.png')
          .addField('Social Links', '• [Github Repository](https://github.com/ahezard/nds-bootstrap) \n'
                                  + '• [GBATemp Thread](https://gbatemp.net/threads/nds-bootstrap-loader-run-commercial-nds-backups-from-an-sd-card.454323/) \n'
                                  + '• [Discord Server](https://discord.gg/yqSut8c)')
          .setColor('#999A9D')
          .setImage('https://cdn.discordapp.com/attachments/472516090711375872/585526755968942100/10d50b710aa28acd6f1fd43f856c364cc33ffc4b_s2_n2.png')
          .setFooter('Made by ahezard', 'https://cdn.discordapp.com/attachments/283770736215195648/585305344222298112/ahezard-avatar.gif')
        break;
      case 'lolsnes':
        text = '**lolSnes** is an open-source Super Nintendo Enterntainment System (SNES for short) emulator for a Nintendo DS flashcard or a DSi/3DS SD card using nds-bootstrap with RAM Disks.';

        embed
          .setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/596832265971957761/image.jpg')
          .addField('Social Links', '• [Website](http://lolsnes.kuribo64.net/) \n'
                                  + '• [Github Repository](https://github.com/Arisotura/lolSnes)')
          .setColor('#F8E800')
          .setImage('http://lolsnes.kuribo64.net/img/lolsnes/lolsnes_release.png')
          .setFooter('Made by Arisotura', 'http://kuribo64.net/board/userpic/1_1533043859.png')
        break;
      case 'nesDS':
        text = '**nesDS** is an open-source Nintendo Enterntainment System (NES for short) emulator for a Nintendo DS flashcard or a DSi/3DS SD card.';

        embed
          .setColor("RED")
          .addField('Social Links', '[Github Repository](https://github.com/RocketRobz/NesDS) ([DSi Edition](https://github.com/ApacheThunder/NesDS))')
          .setFooter('Made by loopy, FluBBa, Dwedit, tepples, kuwanger, chishm, Mamiya, minitroopa, huiminghao, CotoDev & ApacheThunder')
          break;
      case 'pkmn-chest':
        text = "**pkmn-chest** is a Pokémon Bank style app that lets you store and edit Pokémon from the 4th and 5th generation games on your DS(i).";

        embed
          .setThumbnail('https://github.com/Universal-Team/pkmn-chest/raw/master/resources/icon.png')
          .setColor("GREEN")
          .addField('Social Links', '• [Github Repository](https://github.com/Universal-Team/pkmn-chest)'
                                  + '• [Discord Server](https://discord.gg/KDJCfGF)')
          .setImage('https://universal-team.github.io/assets/images/pkmn-chest/box.png')
          .setFooter('Made by Universal Team (Maily by Pk11)');
          break;
      case 'relaunch':
        text = "**Relaunch** is a Nintendo DS(i) homebrew that allows the ability to launch an `.nds` file depending on which button you have pressed, similar to NoCash's Unlaunch.";

        embed
          .setColor("GREEN")
          .setThumbnail('https://media.discordapp.net/attachments/283770736215195648/607029361052352620/thing.png')
          .addField('Social Links', '• [Github Repository](https://github.com/Universal-Team/Relaunch)'
                                  + '• [Discord Server](https://discord.gg/KDJCfGF)')
          .setImage('https://media.discordapp.net/attachments/590552111289466890/602310646901768233/2019-07-20_20.25.46.png')
          .setFooter('Made by Universal Team (Maily by Flame)');
          break;
    }

    msg.channel.send(text, {embed})
  }
};