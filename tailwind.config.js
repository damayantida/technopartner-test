/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all of your component files.
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				primary: '#FEFFFF',
			},
			fontFamily: {
				ubuntu: ['Ubuntu_400Regular'],
				'ubuntu-bold': ['Ubuntu_700Bold'],
			},
		},
	},
	plugins: [],
};
