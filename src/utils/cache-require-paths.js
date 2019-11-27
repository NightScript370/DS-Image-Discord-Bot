import { createRequire, _resolveFilename } from 'module';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const commonJSrequire = createRequire(import.meta.url);
const SAVE_FILENAME = process.env.CACHE_REQUIRE_PATHS_FILE ? process.env.CACHE_REQUIRE_PATHS_FILE : process.cwd() + '/.cache-require-paths.json';

let nameCache;
try {
	nameCache = existsSync(SAVE_FILENAME) ? JSON.parse(readFileSync(SAVE_FILENAME, 'utf-8')) : {};
} catch {
	nameCache = {};
}

let currentModuleCache;
let pathToLoad;

global.require = function cachePathsRequire(name) {
	currentModuleCache = nameCache[this.filename];
	if (!currentModuleCache) {
		currentModuleCache = {};
		nameCache[this.filename] = currentModuleCache;
	}

	// Some people hack Object.prototype to insert their own properties on
    // every dictionary (for example, the 'should' testing framework). Check
    // that the key represents a path.
	if (currentModuleCache[name]
	 && typeof currentModuleCache[name] === 'string'
	 && existsSync(currentModuleCache[name]) // the file must exist for a cache hit
	)
		pathToLoad = currentModuleCache[name];
	else {
		pathToLoad = _resolveFilename(name, this);
		currentModuleCache[name] = pathToLoad;
	}

	return commonJSrequire.call(this, pathToLoad);
};

/* function printCache() {
	for (let fromFilename of Object.keys(nameCache)) {
		console.log(fromFilename);

		let moduleCache = nameCache[fromFilename];
		for (let name of Object.keys(moduleCache)) {
			console.log(' ', name, '->', moduleCache[name])
		}
	}
} */

process.once('exit', () => {
	try {
		writeFileSync(SAVE_FILENAME, JSON.stringify(nameCache, null, 2), 'utf-8');
	} catch (err) {
		console.error('cache-require-paths: Failed saving cache: ' + err.toString());
	}
});
