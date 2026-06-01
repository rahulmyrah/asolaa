import { neon } from '@neondatabase/serverless';

let sqlClient = null;

export const neonStatus = () => ({
    configured: Boolean(process.env.DATABASE_URL),
    requiredEnv: ['DATABASE_URL'],
});

export const getSql = () => {
    if (!process.env.DATABASE_URL) return null;
    if (!sqlClient) {
        sqlClient = neon(process.env.DATABASE_URL);
    }
    return sqlClient;
};

const one = (rows) => rows?.[0] || null;

export const saveSeoAudit = async (audit) => {
    const sql = getSql();
    if (!sql) return null;

    const rows = await sql`
        insert into seo_audits (
            id,
            website_url,
            domain,
            niche,
            country,
            language,
            target_audience,
            overall_score,
            grade,
            report
        )
        values (
            ${audit.id},
            ${audit.input.url},
            ${audit.domain},
            ${audit.input.niche || null},
            ${audit.input.country || 'us'},
            ${audit.input.language || 'en'},
            ${audit.input.targetAudience || null},
            ${audit.scores.overall},
            ${audit.grade},
            ${JSON.stringify(audit)}
        )
        on conflict (id) do update set
            report = excluded.report,
            overall_score = excluded.overall_score,
            grade = excluded.grade
        returning id, created_at
    `;

    return one(rows);
};

export const getSeoAudit = async (auditId) => {
    const sql = getSql();
    if (!sql) return null;

    const rows = await sql`
        select report
        from seo_audits
        where id = ${auditId}
        limit 1
    `;

    return one(rows)?.report || null;
};

export const listSeoAudits = async (limit = 20) => {
    const sql = getSql();
    if (!sql) return [];

    return sql`
        select
            id,
            website_url as "websiteUrl",
            domain,
            niche,
            country,
            overall_score as "overallScore",
            grade,
            created_at as "createdAt"
        from seo_audits
        order by created_at desc
        limit ${limit}
    `;
};

export const saveSeoStrategy = async ({ auditId, source, strategy }) => {
    const sql = getSql();
    if (!sql) return null;

    const rows = await sql`
        insert into seo_strategies (audit_id, source, strategy)
        values (${auditId || null}, ${source}, ${JSON.stringify(strategy)})
        returning id, created_at
    `;

    return one(rows);
};

export const saveContentBrief = async ({ auditId, keyword, funnelStage, source, brief }) => {
    const sql = getSql();
    if (!sql) return null;

    const rows = await sql`
        insert into seo_content_briefs (audit_id, keyword, funnel_stage, source, brief)
        values (${auditId || null}, ${keyword}, ${funnelStage || 'MOFU'}, ${source}, ${JSON.stringify(brief)})
        returning id, created_at
    `;

    return one(rows);
};

export const savePublishingQueueItems = async (items) => {
    const sql = getSql();
    if (!sql) return [];

    const saved = [];
    for (const item of items) {
        const rows = await sql`
            insert into publishing_queue (
                id,
                campaign_name,
                platform,
                title,
                content,
                status,
                requires_human_approval,
                note,
                payload
            )
            values (
                ${item.id},
                ${item.campaignName},
                ${item.platform},
                ${item.title},
                ${item.content || null},
                ${item.status},
                ${item.requiresHumanApproval},
                ${item.note || null},
                ${JSON.stringify(item)}
            )
            on conflict (id) do nothing
            returning id
        `;
        saved.push(one(rows) || { id: item.id });
    }
    return saved;
};

export const listPublishingQueueItems = async (limit = 100) => {
    const sql = getSql();
    if (!sql) return [];

    return sql`
        select payload
        from publishing_queue
        order by created_at desc
        limit ${limit}
    `.then((rows) => rows.map((row) => row.payload));
};

export const saveBacklinkOutreachItems = async (items) => {
    const sql = getSql();
    if (!sql) return [];

    const saved = [];
    for (const item of items) {
        const rows = await sql`
            insert into backlink_outreach (
                id,
                campaign_name,
                prospect,
                title,
                priority,
                status,
                subject,
                body,
                requires_human_approval,
                payload
            )
            values (
                ${item.id},
                ${item.campaignName},
                ${item.prospect},
                ${item.title || null},
                ${item.priority || 'medium'},
                ${item.status},
                ${item.subject || null},
                ${item.body || null},
                ${item.requiresHumanApproval},
                ${JSON.stringify(item)}
            )
            on conflict (id) do nothing
            returning id
        `;
        saved.push(one(rows) || { id: item.id });
    }
    return saved;
};

export const listBacklinkOutreachItems = async (limit = 100) => {
    const sql = getSql();
    if (!sql) return [];

    return sql`
        select payload
        from backlink_outreach
        order by created_at desc
        limit ${limit}
    `.then((rows) => rows.map((row) => row.payload));
};
