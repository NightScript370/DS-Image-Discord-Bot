let json = require("../assets/JSON/CommandCategories")

module.exports = (categories) => {
	let JSONdata;

	Array.from(Object.keys(categories)).foreach(catName => {
		JSONdata = json[catName];
		if (JSONdata && typeof JSONdata == 'object')
			Object.keys(JSONdata).forEach(key => categories.get(catName)[key] = JSONdata[key])
	})

	return categories;
}