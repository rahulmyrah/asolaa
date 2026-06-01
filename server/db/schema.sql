create extension if not exists pgcrypto;

create table if not exists internal_users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    name text not null,
    password_hash text not null,
    role text not null default 'seo',
    active boolean not null default true,
    last_login_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists seo_projects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    website_url text not null,
    niche text,
    country text default 'us',
    language text default 'en',
    target_audience text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists seo_audits (
    id text primary key,
    project_id uuid references seo_projects(id) on delete set null,
    website_url text not null,
    domain text not null,
    niche text,
    country text default 'us',
    language text default 'en',
    target_audience text,
    overall_score integer,
    grade text,
    report jsonb not null,
    created_at timestamptz not null default now()
);

create table if not exists seo_strategies (
    id uuid primary key default gen_random_uuid(),
    audit_id text references seo_audits(id) on delete cascade,
    source text not null default 'fallback',
    strategy jsonb not null,
    created_at timestamptz not null default now()
);

create table if not exists seo_content_briefs (
    id uuid primary key default gen_random_uuid(),
    audit_id text references seo_audits(id) on delete set null,
    keyword text not null,
    funnel_stage text default 'MOFU',
    source text not null default 'fallback',
    brief jsonb not null,
    created_at timestamptz not null default now()
);

create table if not exists publishing_queue (
    id text primary key,
    campaign_name text not null,
    platform text not null,
    title text not null,
    content text,
    status text not null,
    requires_human_approval boolean not null default true,
    note text,
    payload jsonb not null,
    created_at timestamptz not null default now()
);

create table if not exists backlink_outreach (
    id text primary key,
    campaign_name text not null,
    prospect text not null,
    title text,
    priority text default 'medium',
    status text not null default 'needs_review',
    subject text,
    body text,
    requires_human_approval boolean not null default true,
    payload jsonb not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_seo_audits_created_at on seo_audits(created_at desc);
create index if not exists idx_seo_audits_domain on seo_audits(domain);
create index if not exists idx_seo_strategies_audit_id on seo_strategies(audit_id);
create index if not exists idx_seo_content_briefs_keyword on seo_content_briefs(keyword);
create index if not exists idx_publishing_queue_created_at on publishing_queue(created_at desc);
create index if not exists idx_backlink_outreach_created_at on backlink_outreach(created_at desc);
create index if not exists idx_internal_users_email on internal_users(lower(email));
