import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '')
	const apiUrl = env.VITE_API_URL || 'http://localhost:4000/api'
	const backendOrigin = apiUrl.replace(/\/api\/?$/, '') || 'http://localhost:4000'

	return {
		plugins: [react(), tailwindcss()],
		server: {
			proxy: {
				'/api': {
					target: backendOrigin,
					changeOrigin: true,
				},
				'/uploads': {
					target: backendOrigin,
					changeOrigin: true,
				},
			},
		},
	}
})
