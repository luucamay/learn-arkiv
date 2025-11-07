// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Learn Arkiv',
			logo: {
				src: './src/assets/arkiv-logo.svg',
				replacesTitle: true
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/arkiv-network' }],
			sidebar: [
				{
					label: 'Fullstack Tutorial',
					autogenerate: { directory: 'tutorial' },
				},
			],
		}),
	],
});
