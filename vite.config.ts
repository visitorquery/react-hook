import react from '@vitejs/plugin-react';
import * as path from "node:path";
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		react({
		  jsxRuntime: 'classic', 
		}),
		dts({include: ['src']})
	],
	build  : {
		minify       : 'esbuild',
		emptyOutDir  : true,
		lib          : {
			entry  : path.resolve(__dirname, 'src/index.ts'),
			formats: ["es", "cjs"],
			name   : "visitorquery-react",
			fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
		},
		rollupOptions: {
			external: [
				'react',
				"react/jsx-runtime",
				'react-dom',
			],
			output  : {
				globals: {
					'react'            : 'react',
					'react-dom'        : 'ReactDOM',
				},
			},
		},
	},

});
