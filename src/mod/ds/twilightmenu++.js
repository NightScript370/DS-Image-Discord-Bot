import * as discordJS from 'discord.js'
const { MessageEmbed } = discordJS

let supportedFormats = [
    "Nintendo DS titles",
    "Sega Game Gear/Master System titles",
    "NES/Famicom titles",
    "Super NES/Famicom titles",
    "Sega Genesis titles",
    "(Super) Gameboy (Color) Titles",
 // "Gameboy Advanced Titles",
    "DSTWO plugins (requires you to have a DSTWO)",
    "RocketVideoPlayer videos"
]
let styles = [
    "Nintendo DSi",
    "Nintendo 3DS",
    "R4",
    "Acekard/akMenu",
    "SEGA Saturn"
]
let socialLinks = [
    "[GBATemp Thread](https://gbatemp.net/threads/ds-i-3ds-twilight-menu-gui-for-ds-i-games-and-ds-i-menu-replacement.472200/)",
	"[Github Repository](https://github.com/DS-Homebrew/TWiLightMenu/releases)",
	"[Discord Server](https://discord.gg/yqSut8c)"
]

export const alias = ['twilightmenu++', 'twilight menu', 'twlmenu', 'twilight', 'twlmenu++', 'twilight menu++', 'twlm++', 'twlm', 'twilightmenu', 'twilightm++', 'twilightm', 'srloader', 'dsmenu++', 'dsmenu', 'dsixion'];
export const message = "**TWiLight Menu++** is an open-source DSi Menu upgrade/replacement allowing you to navigate your SD card and launch a variety of different applications."
export const embed = new MessageEmbed()
	.setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585668151191011338/Rocket_Video_Player_logo_2.png')
    .addField('Supported Formats', supportedFormats.map(format => `• ${format}`).join("\n"))
    .addField('Styles', styles.map(style => `• ${style}`).join("\n"))
    .addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setColor('#A701E9')
	.setImage('https://cdn.discordapp.com/attachments/286686210225864725/611221324400033810/twlmenu_on_consoles_2_1610_fixed.jpg')
	.setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif');