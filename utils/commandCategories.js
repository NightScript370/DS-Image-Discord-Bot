let json = require("../assets/JSON/CommandCategories")

module.exports = (categories) => {
	let JSONdata;

	let category = Array.from(Object.keys(categories))

	for (let catName of category) {
		JSONdata = json[catName];
		if (JSONdata && typeof JSONdata == 'object')
			Object.keys(JSONdata).forEach(key => categories.get(catName)[key] = JSONdata[key])
	}

	return categories;
}