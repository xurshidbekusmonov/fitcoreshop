-- Apply after checkout and the admin API have been verified on the new deployment.
begin;

alter table public.orders enable row level security;
alter table public.products enable row level security;

revoke all privileges on public.orders, public.products from public, anon, authenticated;
grant select on public.products to anon, authenticated;
grant select, insert on public.orders to service_role;
grant select, insert, update, delete on public.products to service_role;

drop policy if exists "Allow anonymous insert into orders" on public.orders;
drop policy if exists "Read storefront products" on public.products;
create policy "Read storefront products"
  on public.products for select to anon, authenticated using (true);

commit;
