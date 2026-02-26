import { defineConfig } from 'rolldown';

export default defineConfig([
    {
        input: 'app/index.ts',
        output: {
            file: 'dist/app.js'
        },
        tsconfig: true
    },
    {
        input: 'server/index.ts',
        output: {
            file: 'dist/server.js'
        },
        tsconfig: true
    }
])
