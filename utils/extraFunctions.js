const { length, list, nth, List } = require("list")

List.prototype.random = function () {
	return nth(Math.floor(Math.random() * length(this)), this)
}

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.removeByStart = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (string.startsWith(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (string.startsWith(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

Array.prototype.removeByEnd = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (string.endsWith(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (string.endsWith(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

Array.prototype.removeByContent = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (string.includes(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (string.includes(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

Array.prototype.filterByStart = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (!string.startsWith(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (!string.startsWith(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

Array.prototype.filterByEnd = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (!string.endsWith(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (!string.endsWith(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

Array.prototype.filterByContent = function (values, ignoreCaps=false) {
	if (typeof ignoreCaps !== 'boolean')
		throw new Error('Invalid string or option');

	let cleanarray = [];
	for (var string of this) {
		if (ignoreCaps)
			string = string.toLowerCase()

		if (Array.isArray(values)) {
			for (var value of values) {
				if (ignoreCaps)
					value = value.toLowerCase()

				if (!string.includes(value))
					continue;

				cleanarray.push(value)
			}
		} else {
			if (ignoreCaps)
				values = values.toLowerCase()

			if (!string.includes(values))
				continue;

			cleanarray.push(values)
		}
	}

	return cleanarray;
}

// Converts Katakana to Hiragana
String.prototype.toHiragana = function() {
	let returnString = "";
	for(let i=0;i<this.length;i++) {
		let c = this.charCodeAt(i);
		if(c >= 0x30A1 && c <= 0x30F6)	c -= 96;
		returnString += String.fromCharCode(c);
	}
	return returnString;
}

// Converts Hiragana to Katakana
String.prototype.toKatakana = function() {
	let returnString = "";
	for(let i=0;i<this.length;i++) {
		let c = this.charCodeAt(i);
		if(c >= 0x3041 && c <= 0x3096)	c += 96;
		returnString += String.fromCharCode(c);
	}
	return returnString;
}
