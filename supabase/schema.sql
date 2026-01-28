-- Saud Menu SaaS schema (run in Supabase SQL editor)

-- Tenants (one per customer for MVP)
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  brand_name text not null,
  slug text unique not null,
  theme_id text not null default 'modern_glass', -- modern_glass | warm_cards
  order_mode text not null default 'both',       -- dashboard | whatsapp | both
  whatsapp_number text default '',
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  tenant_slug text not null, -- denormalized for easy public select (set by trigger)
  name text not null,
  description text default '',
  category text default 'بدون قسم',
  price numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  status text not null default 'new',
  order_type text not null,
  extra_info text not null,
  total numeric not null default 0,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Trigger to keep products.tenant_slug synced
create or replace function public.set_product_tenant_slug()
returns trigger language plpgsql as $$
begin
  select slug into new.tenant_slug from public.tenants where id = new.tenant_id;
  return new;
end;
$$;

drop trigger if exists trg_set_product_tenant_slug on public.products;
create trigger trg_set_product_tenant_slug
before insert or update of tenant_id on public.products
for each row execute function public.set_product_tenant_slug();

-- RLS
alter table public.tenants enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Public can read tenants and products by slug (for /m/[slug])
drop policy if exists "public read tenants" on public.tenants;
create policy "public read tenants" on public.tenants for select using (true);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

-- Orders should NOT be public. We'll only write/read orders using service role on server.
-- service_role bypasses RLS (server routes). Leave no public policy for orders.

-- Optional: index
create index if not exists idx_products_tenant_slug on public.products(tenant_slug);
create index if not exists idx_orders_tenant_id on public.orders(tenant_id, created_at desc);
