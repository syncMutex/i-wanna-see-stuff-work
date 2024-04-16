import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@css": fileURLToPath(new URL("./src/css", import.meta.url))
		}
	},
	base: "/i-wanna-see-stuff-work/",
	esbuild: {
		keepNames: true
	}
})
