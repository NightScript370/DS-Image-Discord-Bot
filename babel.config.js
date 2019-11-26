module.exports = {
	"presets": [
	  ["@babel/preset-env", { "targets": { "node": "12"
		} }]
	],
	"plugins": [
	  "@babel/plugin-syntax-dynamic-import",
	  "@babel/plugin-transform-modules-commonjs",
	  "@babel/plugin-proposal-export-default-from",
	  "@babel/plugin-proposal-export-namespace-from",
	  //"add-module-exports",
	  //"transform-remove-strict-mode",
	  ["@babel/plugin-proposal-class-properties", { "loose": true }]
	]
  }