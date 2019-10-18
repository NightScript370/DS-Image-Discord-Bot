let json = require("../assets/JSON/CommandCategories")

module.exports = (categories) => {
	let JSONdata;

	Array.from(categories.keys()).forEach(catName => {
		JSONdata = json[catName];
		if (JSONdata && typeof JSONdata == 'object')
			Object.keys(JSONdata).forEach(key => categories.get(catName).set(key, JSONdata[key]))
	})

	return categories;
}