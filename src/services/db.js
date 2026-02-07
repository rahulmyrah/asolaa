import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';

// --- Apps ---

export const addTrackedApp = async (userId, app) => {
    try {
        const appRef = doc(db, USERS_COLLECTION, userId, 'apps', app.id.toString());

        const appData = {
            ...app,
            trackedAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
        };

        await setDoc(appRef, appData);
        return appData;
    } catch (error) {
        console.error("Error adding tracked app:", error);
        throw error;
    }
};

export const getTrackedApps = async (userId) => {
    try {
        const appsRef = collection(db, USERS_COLLECTION, userId, 'apps');
        const q = query(appsRef, orderBy('trackedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching tracked apps:", error);
        throw error;
    }
};

export const removeTrackedApp = async (userId, appId) => {
    try {
        const appRef = doc(db, USERS_COLLECTION, userId, 'apps', appId.toString());
        await deleteDoc(appRef);
        return true;
    } catch (error) {
        console.error("Error removing tracked app:", error);
        throw error;
    }
};

// --- Keywords ---

export const getTrackedKeywords = async (userId) => {
    try {
        const keywordsRef = collection(db, USERS_COLLECTION, userId, 'keywords');
        const q = query(keywordsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Error getting keywords:", error);
        return [];
    }
};

export const addTrackedKeyword = async (userId, keywordData) => {
    try {
        // Use keyword text as ID to prevent duplicates
        const keywordId = keywordData.keyword.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const docRef = doc(db, USERS_COLLECTION, userId, 'keywords', keywordId);

        await setDoc(docRef, {
            ...keywordData,
            createdAt: serverTimestamp()
        });
        return { ...keywordData, id: keywordId };
    } catch (error) {
        console.error("Error adding keyword:", error);
        throw error;
    }
};

export const removeTrackedKeyword = async (userId, keyword) => {
    try {
        const keywordId = keyword.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await deleteDoc(doc(db, USERS_COLLECTION, userId, 'keywords', keywordId));
    } catch (error) {
        console.error("Error removing keyword:", error);
        throw error;
    }
};

export const saveKeywordList = async (userId, listName, keywords) => {
    try {
        const listRef = doc(collection(db, USERS_COLLECTION, userId, 'keywordLists'));
        await setDoc(listRef, {
            name: listName,
            keywords,
            createdAt: serverTimestamp()
        });
        return listRef.id;
    } catch (error) {
        console.error("Error saving keyword list:", error);
        throw error;
    }
};

// --- History / Analytics ---

export const addAppSnapshot = async (userId, appId, snapshotData) => {
    try {
        const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const snapshotRef = doc(db, USERS_COLLECTION, userId, 'apps', appId.toString(), 'history', dateStr);

        await setDoc(snapshotRef, {
            ...snapshotData,
            date: dateStr,
            savedAt: serverTimestamp()
        });
        return { ...snapshotData, date: dateStr };
    } catch (error) {
        console.error("Error adding snapshot:", error);
        return null; // Fail silently for analytics
    }
};

export const getAppHistory = async (userId, appId, days = 30) => {
    try {
        const historyRef = collection(db, USERS_COLLECTION, userId, 'apps', appId.toString(), 'history');
        const q = query(historyRef, orderBy('date', 'desc'), limit(days));
        const snapshot = await getDocs(q);

        // Return reversed (oldest to newest) for charts
        return snapshot.docs.map(doc => doc.data()).reverse();
    } catch (error) {
        console.error("Error getting history:", error);
        return [];
    }
};
