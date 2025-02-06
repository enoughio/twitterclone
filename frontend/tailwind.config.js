import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"black",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgba(30,135,182,255)",
					secondary: "rgba(28,32,31,255)",
				},
			},
		],
	},
};
