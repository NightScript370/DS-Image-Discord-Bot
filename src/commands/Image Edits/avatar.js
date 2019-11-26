const { Command } = require('discord-akairo')
const createCanvas, loadImage  = require('canvas')

module.exports = class AmiiboCommand extends Command {
	constructor() {
		super('avatar', {
			aliases: ['ava', 'av', 'avat', 'profilepic', 'profilepicture', 'avatars', 'profilepictures', 'avata', 'avatar', 'pfp', 'avy'],
			category: 'Useful',
			clientPermissions: ['ATTACH_FILES'],
			description: {
				content: "Sends the author the user's avatar. It's in GIF form so you can star it.",
				usage: '<user mention or user ID>',
				example: '178261738364338177'
			},
			args: [
				{
					id: 'user',
					type: 'user-commando',
					default: msg => msg.author,
					match: 'rest'
				},
				{
					id: 'size',
					description: 'Keep in mind that changing the avatar size to anything other than a power of 2 from 16-2048 will lose the avatar\'s animation if it is a GIF.',
					type: 'integer',
					match: 'option',
					flag: 'size:',
					default: null
				},
				{
					id: 'width',
					description: "Changing this will lose the avatar's animation if it's A GIF",
					type: 'integer',
					match: 'option',
					flag: 'x:',
					default: null
				},
				{
					id: 'height',
					description: "Changing this will lose the avatar's animation if it's A GIF",
					type: 'integer',
					match: 'option',
					flag: 'y:',
					default: null
				}
			]
		});
	}

	async exec(msg, { user, size, width, height }) {
		let avatar;
		// If there are no (additional) params, no point in editing the avatar
		if (size == null && width == null && height == null ) {
			avatar = await user.displayAvatarURL({ size: 512 });
			if (!(avatar.split(/[#?]/gmi))[0].endsWith('.gif')) avatar = await user.displayAvatarURL({ format: 'png', size: 512 })

			return this.uploadAvatar(msg, user, avatar)
		} else if ((size == 16 || size == 32 || size == 64 || size == 128 || size == 256 || size == 512 || size == 1024 || size == 2048)
							&& width == null && height == null) {
			avatar = await user.displayAvatarURL({ size: size });
			if (!(avatar.split(/[#?]/gmi))[0].endsWith('.gif')) avatar = await user.displayAvatarURL({ format: 'png', size: size })
			return this.uploadAvatar(msg, user, avatar);
		}

		avatar = user.displayAvatarURL({ format: 'png', size: 2048 });
		if (size == null) size = 512

		if (width == null) width = size
		if (height == null) height = size

		const data = await loadImage(avatar);
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(data, 0, 0, width, height);

		const attachment = canvas.toBuffer();
		if (Buffer.byteLength(attachment) > 8e+6) return msg.util.reply('Resulting image was above 8 MB.');
		return this.uploadAvatar(msg, user, canvas)
	}
	
	uploadAvatar(message, user, avatar) {
		let text;
		
		if (user.tag == message.author.tag)
			text = 'Here is your avatar';
		else
			text = `Here is ${user.tag}'s avatar`;

		message.util.reply(text, { files: [{ attachment: avatar, name: `${user.username}-avatar.gif` }] })
	}
};