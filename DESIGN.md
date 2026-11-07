# FitCoreShop design

Direction: light catalog, graphite sports banner and yellow actions, implemented from FITCORESHOP_Antigravity_Design_Prompt.md supplied by the owner. The written specification overrides the earlier black and gold design. The reference image mentioned in that document was not supplied.

The homepage includes a searchable header, working catalog menu, static campaign banner using actual catalog products, service row, four goal category cards, category/brand/price/availability filters, price sorting, load-more pagination, real brand filters and delivery information. Products, prices and IDs remain in the existing Supabase database. No fake ratings, stock, discounts, partner claims or contact channels are added.

Mobile uses a two-column catalog from 360px and a draft filter sheet. Cart and checkout retain the existing persisted cart and order contracts, with light surfaces, keyboard trapping, Escape and focus restoration. No real orders were submitted during verification. Images remain external existing catalog assets, with a local neutral fallback. Transparent cutout assets were not supplied, so hero products use white studio cards rather than fabricated labels or altered packaging.

Build: Tailwind v4 is compiled with the installed Turbopack loader; no Tailwind CDN runtime is used. Existing admin behavior and API endpoints are retained. Production publication is explicitly authorized by the owner in chat.
