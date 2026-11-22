alter table public.orders add column if not exists request_id uuid;

create unique index if not exists orders_request_id_key
  on public.orders (request_id);
