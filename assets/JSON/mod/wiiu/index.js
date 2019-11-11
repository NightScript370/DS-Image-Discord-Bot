import { RichEmbed } from 'discord.js'

let features = [
	"Run unsigned software (such as homebrew)",
	"Store and Run Application backups without region-locking and disc ownership",
	"Run retro software using their emulator",
	"Backup, edit, and restore saves for many games"
]

export const message = "Nintendo Wii U Modding guide: https://wiiu.hacks.guide/\n"
	+ "This guide will install The Homebrew Launcher on your Nintendo Wii U, your primary interface to run homebrew."
export const embed = new RichEmbed()
	.setColor(1050)
	.setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584854074617233424/unknown_1.png')
	.addField('Advantages to modding a Nintendo Wii U', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by Plailect', 'https://pbs.twimg.com/profile_images/698944593715310592/wTDlD5rA_400x400.png');