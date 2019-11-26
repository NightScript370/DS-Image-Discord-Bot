const MessageEmbed = require('discord.js')

let features = [
	"Customize your HOME Menu with user-created themes and splash screens",
	"Use “ROM hacks” for games that you own",
	"Backup, edit, and restore saves for applications",
	"Play games for older systems with various emulators, using RetroArch or other standalone emulators"
]

export const message = "Nintendo Switch Modding guide: https://nh-server.github.io/switch-guide/\n"
	+ "This guide will install Atmosphere, the latest and safest CFW."
export const embed = new MessageEmbed()
	.setColor(1179392)
	.setThumbnail('https://cdn.discordapp.com/attachments/472516090711375872/584859910882328674/switch.png')
	.addField('Advantages to modding a Nintendo Switch', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by Nintendo Homebrew', 'https://camo.githubusercontent.com/68f8c313af4f08a3a2db45c22154253bec6ee758/687474703a2f2f692e696d6775722e636f6d2f5348544c474f762e706e67');