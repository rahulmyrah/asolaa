const DATAFORSEO_BASE_URL = 'https://api.dataforseo.com/v3';

const LOCATION_CODES = {
    us: 2840,
    usa: 2840,
    'united states': 2840,
    'united states of america': 2840,
    gb: 2826,
    uk: 2826,
    'united kingdom': 2826,
    england: 2826,
    ca: 2124,
    canada: 2124,
    au: 2036,
    australia: 2036,
    in: 2356,
    india: 2356,
};

const LANGUAGE_CODES = {
    en: 'en',
    eng: 'en',
    english: 'en',
    hi: 'hi',
    hindi: 'hi',
    es: 'es',
    spanish: 'es',
    fr: 'fr',
    french: 'fr',
    de: 'de',
    german: 'de',
};

const hasCredentials = () => Boolean(process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD);

const getAuthHeader = () => {
    const token = Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');
    return `Basic ${token}`;
};

const normalizeCountry = (country = 'us') => {
    const key = String(country).trim().toLowerCase();
    return LOCATION_CODES[key] || LOCATION_CODES.us;
};

const normalizeLanguage = (language = 'en') => {
    const key = String(language).trim().toLowerCase();
    return LANGUAGE_CODES[key] || 'en';
};

const postDataForSeo = async (path, payload) => {
    if (!hasCredentials()) {
        return {
            ok: false,
            status: 'missing_credentials',
            message: 'DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD are required on the server.',
            data: null,
        };
    }

    const response = await fetch(`${DATAFORSEO_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            Authorization: getAuthHeader(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    const failedTask = data.tasks?.find((task) => task.status_code >= 40000);
    if (!response.ok || data.status_code >= 40000 || data.tasks_error > 0 || failedTask) {
        return {
            ok: false,
            status: 'api_error',
            message: failedTask?.status_message || data.status_message || `DataForSEO request failed with HTTP ${response.status}`,
            data,
        };
    }

    return { ok: true, status: 'ok', data };
};

const normalizeObjectKeys = (value) => {
    if (Array.isArray(value)) {
        return value.map(normalizeObjectKeys);
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [
            key === '' ? 'unknown' : key,
            normalizeObjectKeys(item),
        ]));
    }

    return value;
};

export const getKeywordSuggestions = async ({ keyword, country = 'us', language = 'en', limit = 50 }) => {
    const result = await postDataForSeo('/dataforseo_labs/google/keyword_suggestions/live', [{
        keyword,
        location_code: normalizeCountry(country),
        language_code: normalizeLanguage(language),
        include_seed_keyword: true,
        limit,
    }]);

    if (!result.ok) return { ...result, items: [] };

    const items = result.data?.tasks?.[0]?.result?.[0]?.items || [];
    return {
        ...result,
        items: items.map((item) => ({
            keyword: item.keyword,
            searchVolume: item.keyword_info?.search_volume || 0,
            cpc: item.keyword_info?.cpc || 0,
            competition: item.keyword_info?.competition || 0,
            difficulty: item.keyword_properties?.keyword_difficulty || null,
            intent: item.search_intent_info?.main_intent || 'unknown',
        })).filter((item) => item.keyword),
    };
};

export const getSerpCompetitors = async ({ keyword, country = 'us', language = 'en', depth = 10 }) => {
    const result = await postDataForSeo('/serp/google/organic/live/advanced', [{
        keyword,
        location_code: normalizeCountry(country),
        language_code: normalizeLanguage(language),
        depth,
    }]);

    if (!result.ok) return { ...result, items: [] };

    const items = result.data?.tasks?.[0]?.result?.[0]?.items || [];
    return {
        ...result,
        items: items
            .filter((item) => item.type === 'organic')
            .map((item) => ({
                title: item.title,
                url: item.url,
                domain: item.domain,
                rank: item.rank_group || item.rank_absolute,
                description: item.description,
            })),
    };
};

export const getBacklinkSummary = async ({ target }) => {
    const result = await postDataForSeo('/backlinks/summary/live', [{
        target,
        include_subdomains: true,
        backlinks_status_type: 'all',
        internal_list_limit: 10,
    }]);

    if (!result.ok) return { ...result, summary: null };

    const summary = normalizeObjectKeys(result.data?.tasks?.[0]?.result?.[0] || null);
    return { ...result, summary };
};

export const dataForSeoStatus = () => ({
    configured: hasCredentials(),
    requiredEnv: ['DATAFORSEO_LOGIN', 'DATAFORSEO_PASSWORD'],
});
