import * as List from "list";

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	let result = target;

	if (search instanceof Array) {
		for (var splitvar of search) {
			result = result.split(splitvar).join(replacement)
		}
	} else {
		result = result.split(search).join(replacement)
	}

	return result;
};

List.prototype.random = function () {
	return List.nth(Math.floor(Math.random() * this.length))
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

if (!Array.prototype.flat) {
	Array.prototype.flat = function() {
		var depth = arguments[0];
		depth = depth === undefined ? 1 : Math.floor(depth);
		if (depth < 1)
			return Array.prototype.slice.call(this);

		return (function flat(arr, depth) {
			var len = arr.length >>> 0;
			var flattened = [];
			var i = 0;
			while (i < len) {
				if (i in arr) {
					var el = arr[i];
					if (Array.isArray(el) && depth > 0)
						flattened = flattened.concat(flat(el, depth - 1));
					else
						flattened.push(el);
				}
				i++;
			}
			return flattened;
		})(this, depth);
	};
}