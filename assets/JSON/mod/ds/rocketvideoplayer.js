import { RichEmbed } from 'discord.js'

let socialLinks = [
    "[GBAtemp Thread](https://gbatemp.net/threads/release-rocket-video-player-play-videos-with-the-ultimate-in-picture-quality.539163/)",
	"[Github Repository](https://github.com/RocketRobz/RocketVideoPlayer/releases)",
	"[Discord Server](https://discord.gg/yqSut8c)"
]

export const alias = ['rocketvideoplayer', 'rvidplayer', 'rvp'];
export const message = "**Rocket Video Player** is an open-source video player powered by Rocket Video Technology. It can be used on a Nintendo DSi, a Nintendo 3DS or a Nintendo DS Flashcart by playing a .rvid video file from your SD card."
export const embed = new RichEmbed()
	.setThumbnail('https://cdn.discordapp.com/attachments/283770736215195648/585668151191011338/Rocket_Video_Player_logo_2.png')
	.addField('Social Links', socialLinks.map(feature => `• ${feature}`).join("\n"))
	.setColor('#A701E9')
	.setImage('https://cdn.discordapp.com/attachments/283771381735489537/579915898240892928/IMG_20190519_235944_994_cropped_and_resized.png')
	.setFooter('Made by RocketRobz', 'https://cdn.discordapp.com/attachments/283770736215195648/585294979220504576/RocketRobz-avatar.gif');