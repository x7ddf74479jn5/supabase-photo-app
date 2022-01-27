#!/usr/bin/env zx

const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const SUPABASE_API_ENDPOINT = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`;
const output = 'src/types/supabase.ts';

await $`npx openapi-typescript ${SUPABASE_API_ENDPOINT} --output ${output}`;
