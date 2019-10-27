module.exports = {
	type: "object",
	extendable: true,
	keys: {
		channel: "channel",
		multiplier: "int"
	}
	default: {
		multiplier: "1"
	},
	uniqueKey: "channel"
}