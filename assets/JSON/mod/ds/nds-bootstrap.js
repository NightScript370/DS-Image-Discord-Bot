import { RichEmbed } from 'discord.js'

let socialLinks = [
    "[GBATemp Thread](https://gbatemp.net/threads/nds-bootstrap-loader-run-commercial-nds-backups-from-an-sd-card.454323/)",
	"[Discord Server](https://discord.gg/yqSut8c)",
	"[Github Repository](https://github.com/ahezard/nds-bootstrap)"
]

export const alias = ['nds-bootstrap', 'ndsbootstrap', 'ndsbp'];
export const message = "**nds-bootstrap** is an open-source application that allows Nintendo DS/DSi ROMs and homebrew to be natively utilised rather than using an emulator. nds-bootstrap works on Nintendo DSi/3DS SD cards through CFW and on Nintendo DS through flashcarts."
export const embed = new RichEmbed()
	.setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/585529778627674122/df6f574fd4b252a788278f28c64c7ec2af011d4d_s2_n2.png')
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setColor('#999A9D')
	.setImage('https://cdn.discordapp.com/attachments/472516090711375872/585526755968942100/10d50b710aa28acd6f1fd43f856c364cc33ffc4b_s2_n2.png')
	.setFooter('Made by ahezard', 'https://cdn.discordapp.com/attachments/283770736215195648/585305344222298112/ahezard-avatar.gif');