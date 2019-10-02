let json = require("../assets/JSON/CommandCategories")

module.exports = (categories) => {
	let category;
	let JSONdata;
	let JSONkeys;

	let keyNames = Array.from(categories.keys());

	for (var catName of keyNames) {
		category = categories.get(catName);
		JSONdata = json[catName];

		if (JSONdata && typeof JSONdata == 'object') {
			JSONkeys = JSONdata.keys();
			for (var JSONkey of JSONkeys) {
				category[JSONkey] = JSONdata[JSONkey];
			}
		}
	}

	return categories;
}