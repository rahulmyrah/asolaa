import crypto from 'node:crypto';
import { getSql, neonStatus } from './neonDb.js';

const TOKEN_TTL_SECONDS = 60 * 60 * 12;

const base64url = (value) => Buffer.from(value).toString('base64url');

const getAuthSecret = () => process.env.AUTH_SECRET || 'asolaa-local-dev-secret';

const sign = (payload) => crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');

const hashPassword = (password, salt = crypto.randomBytes(16).toString('base64url')) => {
    const key = crypto.scryptSync(password, salt, 64).toString('base64url');
    return `scrypt:${salt}:${key}`;
};

const verifyPassword = (password, storedHash) => {
    const [scheme, salt, expectedKey] = storedHash.split(':');
    if (scheme !== 'scrypt' || !salt || !expectedKey) return false;
    const actualKey = hashPassword(password, salt).split(':')[2];
    return crypto.timingSafeEqual(Buffer.from(actualKey), Buffer.from(expectedKey));
};

const publicUser = (user) => ({
    uid: user.id,
    id: user.id,
    email: user.email,
    displayName: user.name,
    role: user.role,
    photoURL: null,
});

export const createToken = (user) => {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    }));
    const unsigned = `${header}.${payload}`;
    return `${unsigned}.${sign(unsigned)}`;
};

export const verifyToken = async (token) => {
    if (!token) return null;
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;
    const unsigned = `${header}.${payload}`;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(unsigned)))) return null;

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;

    const sql = getSql();
    if (!sql) return null;
    const rows = await sql`
        select id, email, name, role, active
        from internal_users
        where id = ${parsed.sub} and active = true
        limit 1
    `;
    return rows[0] ? publicUser(rows[0]) : null;
};

export const registerInternalUser = async ({ email, password, name, inviteCode }) => {
    if (!neonStatus().configured) {
        throw new Error('DATABASE_URL is required for Neon-managed authentication.');
    }

    if (process.env.INTERNAL_SIGNUP_CODE && inviteCode !== process.env.INTERNAL_SIGNUP_CODE) {
        throw new Error('Invalid internal signup code.');
    }

    if (!email || !password || !name) {
        throw new Error('Name, email, and password are required.');
    }

    if (password.length < 10) {
        throw new Error('Password must be at least 10 characters.');
    }

    const sql = getSql();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUsers = await sql`select count(*)::int as count from internal_users`;
    const role = existingUsers[0].count === 0 ? 'admin' : 'seo';

    const rows = await sql`
        insert into internal_users (email, name, password_hash, role)
        values (${normalizedEmail}, ${name.trim()}, ${hashPassword(password)}, ${role})
        returning id, email, name, role
    `;

    return publicUser(rows[0]);
};

export const loginInternalUser = async ({ email, password }) => {
    if (!neonStatus().configured) {
        throw new Error('DATABASE_URL is required for Neon-managed authentication.');
    }

    const sql = getSql();
    const normalizedEmail = email.trim().toLowerCase();
    const rows = await sql`
        select id, email, name, role, password_hash, active
        from internal_users
        where email = ${normalizedEmail}
        limit 1
    `;
    const user = rows[0];
    if (!user || !user.active || !verifyPassword(password, user.password_hash)) {
        throw new Error('Invalid email or password.');
    }

    await sql`update internal_users set last_login_at = now() where id = ${user.id}`;
    return publicUser(user);
};

export const authConfigStatus = () => ({
    neon: neonStatus(),
    authSecretConfigured: Boolean(process.env.AUTH_SECRET),
    signupCodeEnabled: Boolean(process.env.INTERNAL_SIGNUP_CODE),
});
