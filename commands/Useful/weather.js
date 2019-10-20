const { Command } = require('discord-akairo');
const weather = require("util").promisify(require('weather-js').find);

module.exports = class weatherCommand extends Command {
	constructor() {
		super("weather", {
			category: 'Useful',
			aliases: ["weather", "天気"],
			description: {
				content: 'Returns the weather for the location you specify',
			},
 			args: [
				{
					id: 'area',
					description: "This is the location you would like to get weather information",
					type: 'string',
					prompt: {
						start: "What's the location you'd like to recieve weather information for?",
						retry: "There is not a thing we can get weather information for. Try again."
					},
					match: 'content'
				}
			]
		});
	}

	async exec(message, { area }) {
		const __ = (k, ...v) => global.lang.getString(message.author.lang, k, ...v)

		let result = await weather({ search: area, degreeType: 'C' }); 
		if (isEmpty(result))
			return message.channel.send(__("There were no results found for your location. Please try again later."));

		let current = result[0].current;
		let location = result[0].location;

		let embed = this.client.util.embed()
			.setThumbnail(current.imageUrl)
			.addInline(__('Timezone'), `UTC${location.timezone}`)
			.addInline(__('Degree Type'), location.degreetype)
			.addInline(__('Temperature'), `${current.temperature} Degrees`)
			.addInline(__('Feels Like'), `${current.feelslike} Degrees`)
			.addInline(__('Winds'), current.winddisplay)
			.addInline(__('Humidity'), `${current.humidity}%`);

		message.util.send(__('{0} weather in {1}', current.skytext, current.observationpoint), message.channel.embedable ? {embed} : {});

		return result;
	}
};

function isEmpty(value) { //Function to check if value is really empty or not
	return (!value || value.length === 0);
}