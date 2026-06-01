import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');

const splitStatements = (sqlText) => sqlText
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required to apply the Neon schema.');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const schema = await fs.readFile(schemaPath, 'utf8');
const statements = splitStatements(schema);

for (const statement of statements) {
    await sql.query(statement);
}

console.log(`Applied ${statements.length} Neon schema statements.`);
