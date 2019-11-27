import * as discordJS from 'discord.js'
const { MessageEmbed } = discordJS

let socialLinks = [
	"[Website](http://lolsnes.kuribo64.net/)",
	"[Github Repository](https://github.com/Arisotura/lolSnes)"
]

export const alias = ['lolSnes', 'lolsnes'];
export const message = "**lolSnes** is an open-source Super Nintendo Enterntainment System (SNES for short) emulator made for the Nintendo DS using a flashcard."
export const embed = new MessageEmbed()
	.setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/596832265971957761/image.jpg')
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setColor('#F8E800')
	.setImage('http://lolsnes.kuribo64.net/img/lolsnes/lolsnes_release.png')
	.setFooter('Made by Arisotura', 'http://kuribo64.net/board/userpic/1_1533043859.png');