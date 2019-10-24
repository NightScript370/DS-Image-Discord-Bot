const { website: websiteConfig } = require("../config.js");
const List = require("list-array");
const path = require("path");
const fs = require('fs')
const routers = fs.readdirSync(path.join(process.cwd(), 'website', 'router'));

module.exports = (client) => {
	let website = require('fastify')({ logger: true, ignoreTrailingSlash: true })
		.register(require('point-of-view'), {
			engine: {
				ejs: require('ejs')
			},
			templates: 'pages',
			options: {
				filename: path.resolve('pages')
			}
		})
	website.URL = websiteConfig.url;

	website.register(require('fastify-helmet'))
		.then(console.log("[WEBSITE] Helmet loaded"))
		.catch(console.error("[WEBSITE] FAILED TO LOAD HELMET"))

	let routerModule
	for (let router of routers) {
		routerModule = require("./router/" + router)(client);
		website.get(router.replace('.js', ''), Array.isArray(routerModule) ? ...routerModule : routerModule)
	}

	routerModule = require("./router/" + websiteConfig.mainPage.replace(".js", '') + '.js')(client)
	website.express.get('/', Array.isArray(routerModule) ? ...routerModule : routerModule);

	website.express.get('*', (request, response) => response.redirect("/"));

	website.server = http.createServer(website.express);
	website.server.listen(website.express.get('port'));

	return website
}