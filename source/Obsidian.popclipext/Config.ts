// #popclip
// name: Obsidian
// identifier: com.pilotmoon.popclip.extension.obsidian
// description: Capture text to Obsidian.
// popclip version: 4586
// app: { name: Obsidian, link: https://obsidian.md/ }
// icon: iconify:simple-icons:obsidian

export const options: Option[] = [
	{
		identifier: "info",
		type: "heading",
		label: "Important!",
		description:
			"See the extension's README about required preparation steps in Obsidian.",
	},
	{
		identifier: "vaultName",
		label: "Vault Name (required)",
		type: "string",
		description: "Name of the vault in Obsidian.",
	},
	{
		identifier: "fileName",
		label: "File Name",
		type: "string",
		description: "Optional destination file. Leave blank to use Daily Note.",
	},
	{
		identifier: "heading",
		label: "Heading",
		type: "string",
		description:
			"Optional heading to insert captures under. Leave blank to append at the bottom of the file.",
	},
];

type ObsidianOptions = {
	vaultName: string;
	fileName: string;
	heading: string;
};

function capture(markdown: string, options: ObsidianOptions) {
	const url = new URL("obsidian://advanced-uri");
	url.searchParams.append("vault", options.vaultName);
	if (options.fileName) {
		url.searchParams.append("filename", options.fileName);
	} else {
		url.searchParams.append("daily", "true");
	}
	if (options.heading) {
		url.searchParams.append("heading", options.heading);
	}
	url.searchParams.append("data", markdown);
	url.searchParams.append("mode", "append");
	popclip.openUrl(url.href.replaceAll("+", "%20"));
}

export const action: Action<ObsidianOptions> = {
	captureHtml: true,
	code(input, options, context) {
		let content = "\n" + input.markdown.trim();
		if (context?.browserUrl) {
			content += `\n[${context?.browserTitle || "Source"}](${
				context?.browserUrl
			})`;
		}
		capture(content, options);
	},
};

export async function test() {
	capture("in clippings file, no heading", {
		vaultName: "Dry, Dark Place",
		fileName: "Clippings",
		heading: "",
	});
	await sleep(100);
	capture("in clippings file, with heading", {
		vaultName: "Dry, Dark Place",
		fileName: "Clippings",
		heading: "My Heading",
	});
	await sleep(100);
	capture("in daily note file, no heading", {
		vaultName: "Dry, Dark Place",
		fileName: "",
		heading: "",
	});
	await sleep(100);
	capture("in daily note file, with heading", {
		vaultName: "Dry, Dark Place",
		fileName: "",
		heading: "My Heading",
	});
}
