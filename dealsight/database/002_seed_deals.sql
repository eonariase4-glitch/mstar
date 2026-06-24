INSERT INTO users (email, password_hash, settings)
VALUES (
    'demo@dealsight.local',
    'replace_with_bcrypt_hash',
    '{"target_roi": 8, "default_ltv": 75}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@dealsight.local'
)
DELETE FROM deals
WHERE user_id IN (SELECT id FROM demo_user)
  AND title IN (
      '3 Bed Semi, Manchester',
      'City Flat, Liverpool',
      'Terrace, Birmingham',
      'HMO, Sheffield',
      'Cottage, Bristol'
  );

WITH demo_user AS (
    SELECT id FROM users WHERE email = 'demo@dealsight.local'
)
INSERT INTO deals (user_id, title, address, postcode, strategy, purchase_price, data, status)
SELECT demo_user.id, seed.title, seed.address, seed.postcode, seed.strategy, seed.purchase_price, seed.data, seed.status
FROM demo_user
CROSS JOIN (
    VALUES
        (
            '3 Bed Semi, Manchester',
            'Manchester',
            NULL::varchar(10),
            'BRRR',
            180000::numeric,
            '{"arv": 260000, "notes": "Price: GBP 180k, ARV: GBP 260k"}'::jsonb,
            'Reviewing'
        ),
        (
            'City Flat, Liverpool',
            'Liverpool',
            NULL::varchar(10),
            'BTL',
            110000::numeric,
            '{"rent": 850, "notes": "Price: GBP 110k, Rent: GBP 850"}'::jsonb,
            'Offer Made'
        ),
        (
            'Terrace, Birmingham',
            'Birmingham',
            NULL::varchar(10),
            'FLIP',
            140000::numeric,
            '{"refurb": 40000, "arv": 210000, "notes": "Price: GBP 140k, Refurb: GBP 40k, ARV: GBP 210k"}'::jsonb,
            'Under Offer'
        ),
        (
            'HMO, Sheffield',
            'Sheffield',
            NULL::varchar(10),
            'R2R',
            5000::numeric,
            '{"setup": 5000, "net_cashflow": 800, "notes": "Setup: GBP 5k, Net Cashflow: GBP 800/mo"}'::jsonb,
            'Reviewing'
        ),
        (
            'Cottage, Bristol',
            'Bristol',
            NULL::varchar(10),
            'BTL',
            320000::numeric,
            '{"yield": 6, "notes": "Price: GBP 320k, Yield: 6%"}'::jsonb,
            'Reviewing'
        )
) AS seed(title, address, postcode, strategy, purchase_price, data, status);
