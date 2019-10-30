const { parameters } = require("../extraFunctions")

module.exports = (client, website) => {
	const homepageRouter = (request, response) => {
		let object = parameters(client, request);

		object.subtitle = "Home";
		object.features = [
			{
				icon: "level-up",
				text: "Leveling system",
				subtext: "with configurable point multipliers"
			},
			{
				icon_html: `<div style="display: flex; justify-content: center;align-items: center;"><div class="three-cogs fa-1x">
					<i class="fa fa-cog fa-spin fa-2x fa-fw"></i>
					<i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
					<i class="fa fa-cog fa-spin fa-1x fa-fw"></i>
				</div></div>`,
				text: "Customizable settings system",
				subtext: "to suit each different server"
			},
			{
				icon: "star",
				text: "Starboard system"
			},
			{
				icon: "file-code-o",
				text: "Over 100 fun and helpful commands",
				subtext: "with new ones added daily"
			},
			{
				icon: "music",
				text: "Listen to audio from Youtube",
				subtext: "with support for playlists"
			},
			{
				icon: "users",
				text: "A helpful and interactive community",
				subtext: "willing to help"
			}
		]

		response.view("index", object)
	}

	return homepageRouter;
}