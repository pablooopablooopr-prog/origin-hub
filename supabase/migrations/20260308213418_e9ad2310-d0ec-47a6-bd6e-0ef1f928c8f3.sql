-- Add Madrid coordinates to ORIGEN company (Alcalá 372, Madrid)
UPDATE companies SET latitude = 40.4350, longitude = -3.6700 WHERE id = 'a91260d4-e919-4d52-b005-5ab3dea106d9' AND latitude IS NULL;

-- Add Madrid coordinates to AEVUM company (Calle Goya, Madrid)
UPDATE companies SET latitude = 40.4256, longitude = -3.6822 WHERE id = '2e45fbab-53ad-44e3-8e7e-f086ec23e880' AND latitude IS NULL;