module.exports = {
	type: "object",
	extendable: true,
	keys: {
		messageDelete: "channel",
		messagePinned: "channel",
		messageUpdate: "channel",
		configUpdate: "channel",
		memberUpdate: "channel",
		memberLeave: "channel",
		memberJoin: "channel",
		levelUp: "channel",
		commandUsage: "channel"
	}
	default: {
		messageDelete: "discord-logs",
		messagePinned: "discord-logs",
		messageUpdate: "discord-logs",
		configUpdate: "discord-logs",
		memberUpdate: "discord-logs",
		memberLeave: "discord-logs",
		memberJoin: "discord-logs",
		levelUp: "discord-logs",
		commandUsage: "discord-logs"
}