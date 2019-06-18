const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

module.exports = class HackingGuidesCommand extends Command {
  constructor() {
    super('dshomebrew', {
      aliases: ['dshomebrew'],
      category: 'Useful',
      description: {
				content: 'Returns information on Nintendo DS Homebrew.',
        usage: '',
        example: ''
			},
			args: [
        {
					id: 'guideLink',
					type: [['twlmenu', 'twilight', 'twilightmenu', 'twlmenu++', 'twilightmenu++'], 'nds-bootstrap', 'rocketvideoplayer'],
          prompt: {
            start: "What's the Nintendo DS Homebrew you'd like to see?",
            retry: "There is not a thing we can get information for. Try again."
          },
          match: 'content'
        }
      ]
    });
  }

  async exec(msg, { guideLink }) {
    let embed = this.client.util.embed()

    switch (guideLink.toLowerCase()) {
      case 'twlmenu':
        embed
          .setTitle('TWiLight Menu++')
          .setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585297998875983872/unknown.png')
          .setDescription('**TWiLight Menu++** is an open-source DSi Menu upgrade/replacement, and frontend for nds-bootstrap for DSi, 3DS, and flashcards.')
          .addField('Social Links', '[Github Repository](https://github.com/DS-Homebrew/TWiLightMenu) | '
                                  + '[GBATemp Thread](https://gbatemp.net/threads/ds-i-3ds-twilight-menu-gui-for-ds-i-games-and-ds-i-menu-replacement.472200/) | '
                                  + '[Discord Server](https://discord.gg/yqSut8c)')
          .setColor('#A701E9')
          .setImage('https://cdn.discordapp.com/attachments/283770736215195648/585304808773124097/image0.jpg')
          .setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif')
        break;
      case 'rocketvideoplayer':
        embed
          .setAuthor('Rocket Video Player', 'https://cdn.discordapp.com/attachments/283770736215195648/585679174312656906/iconfinder_theaters_326711_fit_in_circle.png')
          .setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585668151191011338/Rocket_Video_Player_logo_2.png')
          .setDescription('**Rocket Video Player** is an open-source video player powered by Rocket Video Technology. It can be used on a Nintendo DSi, a Nintendo 3DS or a Nintendo DS Flashcart by playing a .rvid video file from your SD card.')
          .addField('Social Links', '[GBAtemp Thread](https://gbatemp.net/threads/release-rocket-video-player-play-videos-with-the-ultimate-in-picture-quality.539163/) | '
                                  + '[Github Repository](https://github.com/RocketRobz/RocketVideoPlayer/releases) | '
                                  + '[Discord Server](https://discord.gg/yqSut8c)')
          .setColor('#A701E9')
          .setImage('https://cdn.discordapp.com/attachments/283771381735489537/579915898240892928/IMG_20190519_235944_994_cropped_and_resized.png')
          .setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif')
        break;
      case 'nds-bootstrap':
        embed
          .setTitle('nds-bootstrap')
          .setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/585529778627674122/df6f574fd4b252a788278f28c64c7ec2af011d4d_s2_n2.png')
          .setDescription('**nds-bootstrap** is an open-source application that allows Nintendo DS/DSi ROMs and homebrew to be natively utilised rather than using an emulator. nds-bootstrap works on Nintendo DSi/3DS SD cards through CFW and on Nintendo DS through flashcarts.')
          .addField('Social Links', '[Github Repository](https://github.com/ahezard/nds-bootstrap) | '
                                  + '[GBATemp Thread](https://gbatemp.net/threads/nds-bootstrap-loader-run-commercial-nds-backups-from-an-sd-card.454323/) | '
                                  + '[Discord Server](https://discord.gg/yqSut8c)')
          .setColor('#999A9D')
          .setImage('https://cdn.discordapp.com/attachments/472516090711375872/585526755968942100/10d50b710aa28acd6f1fd43f856c364cc33ffc4b_s2_n2.png')
          .setFooter('Made by ahezard', 'https://cdn.discordapp.com/attachments/283770736215195648/585305344222298112/ahezard-avatar.gif')
        break;
      case 'lolsnes':
        embed
          .setTitle('lolsnes')
          
          .setFooter('Made by Arisotura', 'http://kuribo64.net/board/userpic/1_1533043859.png')
    }

    msg.channel.send({embed})
  }
};