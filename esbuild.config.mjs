import Vue from "esbuild-plugin-vue3";
import esbuild from "esbuild";
import process from "process";
import { writeFileSync } from "node:fs";
import builtins from "builtin-modules";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

writeFileSync("./main.css", "");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["./src/main.ts"],
	plugins: [Vue({ isProd: prod })],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	minify: prod,
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
	alias: {
		vue: "vue/dist/vue.esm-bundler.js",
	},
});

const css = await esbuild.context({
	entryPoints: ["./src/main.css"],
	outfile: "styles.css",
	bundle: true,
	allowOverwrite: true,
	minify: prod,
});

if (prod) {
	await context.rebuild();
	await css.rebuild();
	process.exit(0);
} else {
	await Promise.all([context.watch(), css.watch()]);
}
