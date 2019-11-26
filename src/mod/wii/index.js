const MessageEmbed = require('discord.js')

let features = [
	"Use recreated services such as Wiimifi and RiiConnect24 to replace the discontinued Nintendo Wi-fi Connection & WiiConnect24",
	"Run unsigned software (such as homebrew)",
	"Store and Run game backups on a USB device",
	"Customize the functionality of the Wii Home Menu",
	"Run retro software using their emulator",
	"Modify your software using Riivolution"
]

export const message = "Nintendo Wii Modding guide: https://wii.guide/\n"
	+ "This guide will install The Homebrew Launcher on your Nintendo Wii, your primary interface to run homebrew."
export const embed = new MessageEmbed()
	.setColor(16711731)
	.setThumbnail('https://www.nintendoservicecentre.co.uk/images/products/2100866A.png')
	.addField('Advantages to modding a Nintendo Wii', features.map(feature => `- ${feature}`).join("\n"))
	.setFooter('Guide by Team RiiConnect24', 'https://yt3.ggpht.com/a/AGF-l78HICOL8kkki_Tfm9OUBFUrkAX1ai16lkTW=s900-c-k-c0xffffffff-no-rj-mo');