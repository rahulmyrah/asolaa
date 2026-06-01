import express from 'express';
import {
    authConfigStatus,
    createToken,
    loginInternalUser,
    registerInternalUser,
    verifyToken,
} from '../services/internalAuth.js';

const router = express.Router();

const getBearerToken = (req) => {
    const header = req.headers.authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : '';
};

router.get('/status', (req, res) => {
    res.json({ success: true, ...authConfigStatus() });
});

router.post('/register', async (req, res) => {
    try {
        const user = await registerInternalUser(req.body);
        const token = createToken(user);
        res.json({ success: true, user, token });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await loginInternalUser(req.body);
        const token = createToken(user);
        res.json({ success: true, user, token });
    } catch (error) {
        res.status(401).json({ success: false, error: error.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const user = await verifyToken(getBearerToken(req));
        if (!user) {
            return res.status(401).json({ success: false, error: 'Not authenticated.' });
        }
        res.json({ success: true, user });
    } catch {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
    }
});

export default router;
