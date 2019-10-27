module.exports = {
	type: "object",
	extendable: true,
	keys: {
		channel: "channel",
		minimum: "int",
		reaction: "emote"
	},
	default: {
		channel: "starboard",
		minimum: "3",
		reaction: "⭐"
	},
	uniqueKey: "channel"
}