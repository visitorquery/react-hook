import react from '@vitejs/plugin-react';
import * as path from "node:path";
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [react(), dts({include: ['src']})],
	build  : {
		minify       : 'esbuild',
		emptyOutDir  : true,
		lib          : {
			entry  : path.resolve(__dirname, 'src/index.ts'),
			formats: ["es"],
			name   : "visitorquery-react",
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
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
		},
	},

});
