INSERT INTO color (name, hex_code) VALUES
    ('Red',    '#FF0000'),
    ('Green',  '#1d9b1d'),
    ('Blue',   '#0000FF'),
    ('Black',  '#000000'),
    ('White',  '#FFFFFF'),
    ('Gray',   '#808080'),
    ('Yellow', '#FFFF00'),
    ('Orange', '#FFA500'),
    ('Purple', '#800080'),
    ('Pink',   '#FFC0CB'),
    ('Brown',  '#A52A2A'),
    ('Beige',  '#F5F5DC'),
    ('Navy',   '#000080'),
    ('Teal',   '#008080'),
    ('Maroon', '#800000');
    
INSERT INTO delivery_price (id, city, price) VALUES
    (1, 'cairoAndGiza', 350),
    (2, 'restOfCities', 550);

INSERT INTO merchant_configurations (config_key, config_value)
VALUES
    -- Existing keys
    ('merchant_brand_name', 'OTP'),
    ('merchant_contact_phone_1', '+20 111 889 9959'),
    ('merchant_contact_phone_2', '+20 115 888 0605'),
    ('merchant_facebook_url', ''),
    ('merchant_instagram_url', ''),
    ('merchant_twitter_url', ''),
    ('merchant_tiktok_url', ''),
    ('merchant_whatsapp_number', ''),
    ('merchant_contact_email', 'hello@yourbrand.com'),
    ('merchant_address', 'El Nozha El Gedida, Gesr El Suez'),
    ('merchant_address_note', 'Cairo, Egypt — our main studio and pickup point.'),
    ('merchant_working_days', 'Sat – Thu'),
    ('merchant_working_hours', '10:00 AM – 8:00 PM'),
    ('merchant_maps_url', 'https://maps.google.com/?q=El+Nozha+El+Gedida,+Gesr+El+Suez,+Cairo'),
    ('merchant_support_languages', 'English & Arabic')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);