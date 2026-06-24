INSERT INTO users (email, password_hash, settings)
VALUES (
    'demo@dealsight.local',
    'replace_with_bcrypt_hash',
    '{"target_roi": 8, "default_ltv": 75}'
)
ON CONFLICT (email) DO NOTHING;

WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@dealsight.local'
)
INSERT INTO deals (user_id, title, address, postcode, strategy, purchase_price, data, status)
SELECT id, '3 Bed Semi, Manchester', 'Manchester', NULL, 'BRRR', 180000,
       '{"arv": 260000, "notes": "Price: GBP 180k, ARV: GBP 260k"}',
       'Reviewing'
FROM demo_user
UNION ALL
SELECT id, 'City Flat, Liverpool', 'Liverpool', NULL, 'BTL', 110000,
       '{"rent": 850, "notes": "Price: GBP 110k, Rent: GBP 850"}',
       'Offer Made'
FROM demo_user
UNION ALL
SELECT id, 'Terrace, Birmingham', 'Birmingham', NULL, 'FLIP', 140000,
       '{"refurb": 40000, "arv": 210000, "notes": "Price: GBP 140k, Refurb: GBP 40k, ARV: GBP 210k"}',
       'Under Offer'
FROM demo_user
UNION ALL
SELECT id, 'HMO, Sheffield', 'Sheffield', NULL, 'R2R', 5000,
       '{"setup": 5000, "net_cashflow": 800, "notes": "Setup: GBP 5k, Net Cashflow: GBP 800/mo"}',
       'Reviewing'
FROM demo_user
UNION ALL
SELECT id, 'Cottage, Bristol', 'Bristol', NULL, 'BTL', 320000,
       '{"yield": 6, "notes": "Price: GBP 320k, Yield: 6%"}',
       'Reviewing'
FROM demo_user;
