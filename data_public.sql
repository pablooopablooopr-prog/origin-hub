SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict xjF8YzPa8EyPCGEpz0BlRTcTfhR70G3Rd77PcKDBTyzzX83qzpyhIhOtycQcRfj

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _service_role_canary; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("id", "name", "slug", "description", "icon", "color", "parent_id", "sort_order", "is_active", "created_at") VALUES
	('e337573b-9187-4b27-97c8-431e71c260ca', 'Bodegas y Vinos', 'bodegas-vinos', 'Vinos, cavas y experiencias vinícolas', '🍷', '#722F37', NULL, 1, true, '2026-01-07 17:37:17.96047+00'),
	('1a3aec40-1d0b-43ad-a075-aef2736365d1', 'Quesos Artesanales', 'quesos', 'Quesos de leche cruda y artesanos', '🧀', '#F5DEB3', NULL, 2, true, '2026-01-07 17:37:17.96047+00'),
	('323385c7-9da7-4022-bfb7-ad69a36c484f', 'Aceites y Olivos', 'aceites', 'Aceite de oliva virgen extra', '🫒', '#808000', NULL, 3, true, '2026-01-07 17:37:17.96047+00'),
	('e4a2b45a-de5f-4243-8040-7be3910e05b4', 'Panadería y Dulces', 'panaderia-dulces', 'Pan artesano y repostería tradicional', '🍞', '#DEB887', NULL, 4, true, '2026-01-07 17:37:17.96047+00'),
	('8048edd0-0e0d-4dc7-a3b7-f985603904ce', 'Embutidos y Carnes', 'embutidos', 'Jamones, cecinas y embutidos', '🥓', '#8B0000', NULL, 5, true, '2026-01-07 17:37:17.96047+00'),
	('43fe1871-3e24-48cf-82ed-0d1d458c24b4', 'Mariscos y Pescados', 'mariscos', 'Productos del mar y conservas', '🦐', '#4169E1', NULL, 6, true, '2026-01-07 17:37:17.96047+00'),
	('2b35e5f7-7c4e-46ca-853e-3977ff2aaf2e', 'Productos Ecológicos', 'ecologicos', 'Cultivo ecológico certificado', '🌱', '#228B22', NULL, 7, true, '2026-01-07 17:37:17.96047+00'),
	('93b7f8be-ee54-439c-91b7-71d62a6739a7', 'Miel y Apicultura', 'miel', 'Miel cruda y productos de la colmena', '🍯', '#FFD700', NULL, 8, true, '2026-01-07 17:37:17.96047+00'),
	('d00f6e47-3b58-40c6-850c-30034a11ca3f', 'Conservas Artesanales', 'conservas', 'Conservas tradicionales caseras', '🫙', '#CD853F', NULL, 9, true, '2026-01-07 17:37:17.96047+00'),
	('1708d6ca-7511-465d-af88-b35900a39b4f', 'Frutos Secos', 'frutos-secos', 'Almendras, nueces y frutos del campo', '🥜', '#A0522D', NULL, 10, true, '2026-01-07 17:37:17.96047+00'),
	('e235e264-ce2e-4859-90cb-7e111c3ef9a4', 'Carnicería', 'carniceria', NULL, NULL, NULL, NULL, 11, true, '2026-02-18 17:07:42.940415+00'),
	('7b81458b-1592-4732-86de-0f8d8f6dfc32', 'Restaurante', 'restaurante', NULL, NULL, NULL, NULL, 12, true, '2026-02-18 17:07:42.940415+00'),
	('b199b556-71f5-45b4-a110-19c62c159272', 'Charcutería', 'charcuteria', NULL, NULL, NULL, NULL, 13, true, '2026-02-18 17:07:42.940415+00'),
	('8b54d60f-5204-45e0-9f76-30d7be98b08b', 'Frutería', 'fruteria', NULL, NULL, NULL, NULL, 14, true, '2026-02-18 17:07:42.940415+00'),
	('06c209b6-793b-418a-9439-fe09eb7f9b2d', 'Verdulería', 'verduleria', NULL, NULL, NULL, NULL, 15, true, '2026-02-18 17:07:42.940415+00'),
	('d8d43fd6-c1e9-47eb-a600-4c3fbbf23254', 'Pescadería', 'pescaderia', NULL, NULL, NULL, NULL, 16, true, '2026-02-18 17:07:42.940415+00'),
	('0c236274-c0f1-46b8-b369-ecc3f0888610', 'Chocolatería', 'chocolateria', NULL, NULL, NULL, NULL, 17, true, '2026-02-18 17:07:42.940415+00'),
	('6866486b-4161-44a9-ac53-be60580f26dd', 'Pastelería', 'pasteleria', NULL, NULL, NULL, NULL, 18, true, '2026-02-18 17:07:42.940415+00'),
	('daef5d3f-37d8-464d-bea1-775b1e0e30b4', 'Cervecería Artesanal', 'cerveceria-artesanal', NULL, NULL, NULL, NULL, 19, true, '2026-02-18 17:07:42.940415+00'),
	('58b36cbe-0c5c-412b-8eb8-84dc9d4c5676', 'Granja Ecológica', 'granja-ecologica', NULL, NULL, NULL, NULL, 20, true, '2026-02-18 17:07:42.940415+00'),
	('ff3f61a5-f806-42bf-a2d8-e8ec7926d883', 'Taller Artesanal', 'taller-artesanal', NULL, NULL, NULL, NULL, 21, true, '2026-02-18 17:07:42.940415+00'),
	('2669a85d-e51d-4d59-aee5-c5afacf96815', 'Mercado Local', 'mercado-local', NULL, NULL, NULL, NULL, 22, true, '2026-02-18 17:07:42.940415+00'),
	('d1343b82-30da-4947-85ca-00033619f661', 'Herboristería', 'herboristeria', NULL, NULL, NULL, NULL, 23, true, '2026-02-18 17:07:42.940415+00'),
	('69ca108e-8a0b-45b4-b602-1c286d2d3b34', 'Almazara', 'almazara', NULL, NULL, NULL, NULL, 24, true, '2026-02-18 17:07:42.940415+00'),
	('d31a7890-d3bf-4f26-a446-9a1bde9d9c18', 'Vivero', 'vivero', NULL, NULL, NULL, NULL, 25, true, '2026-02-18 17:07:42.940415+00'),
	('9a2362c0-5e11-4743-a8e6-7f106ff5106f', 'Ahumadero', 'ahumadero', NULL, NULL, NULL, NULL, 26, true, '2026-02-18 17:07:42.940415+00'),
	('76d7b583-d116-436d-827e-edbc0bd136dc', 'Cafetería Especialidad', 'cafeteria-especialidad', NULL, NULL, NULL, NULL, 27, true, '2026-02-18 17:07:42.940415+00'),
	('944b33cb-1825-4176-97e2-cafcfe9a113c', 'Sidrería', 'sidreria', NULL, NULL, NULL, NULL, 28, true, '2026-02-18 17:07:42.940415+00'),
	('ff92dbd0-aab3-48d6-ac1f-35588d141c14', 'Destilería', 'destileria', NULL, NULL, NULL, NULL, 29, true, '2026-02-18 17:07:42.940415+00'),
	('7447d476-57a1-4c77-85a7-7de4600926eb', 'Obrador', 'obrador', NULL, NULL, NULL, NULL, 30, true, '2026-02-18 17:07:42.940415+00');


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."regions" ("id", "name", "slug", "description", "coordinates", "image_url", "is_active", "created_at") VALUES
	('7f4074f5-1efb-4997-b1c3-c0cd44cfa251', 'La Rioja', 'la-rioja', 'Tierra de vinos y tradiciones centenarias', '{"lat": 42.3, "lng": -2.5}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('a923bd71-5ec4-40ad-a1d9-63aeb8277484', 'Castilla y León', 'castilla-leon', 'Hornos centenarios y dulces artesanos', '{"lat": 41.6, "lng": -4.7}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('aa667e4c-81e0-48fd-b3e1-33cc1e64124f', 'Andalucía', 'andalucia', 'Aceites, jamones y productos del mar', '{"lat": 37.5, "lng": -4.7}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('4841e066-deaf-4e73-8743-7a413d10a784', 'Galicia', 'galicia', 'Mariscos, vinos y tradición pesquera', '{"lat": 42.5, "lng": -7.5}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('f0c7770c-f967-470e-b679-a81a1269d637', 'País Vasco', 'pais-vasco', 'Sidra, quesos y gastronomía de altura', '{"lat": 43.0, "lng": -2.6}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('a6ff466e-3652-4d6f-828f-e7fbb88d7e17', 'Cataluña', 'cataluna', 'Cavas, aceites y productos mediterráneos', '{"lat": 41.8, "lng": 1.5}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('5964ad82-108c-4870-b126-77f68a9ec53a', 'Asturias', 'asturias', 'Quesos, sidra y productos del mar', '{"lat": 43.3, "lng": -5.8}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('f7997bb0-2b22-43a2-a1df-408f322c098d', 'Valencia', 'valencia', 'Arroz, naranjas y productos de huerta', '{"lat": 39.5, "lng": -0.4}', NULL, true, '2026-01-07 17:37:17.96047+00'),
	('02b5dd6b-52e4-4746-98c7-8842ee7aea61', 'Aragón', 'aragon', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('5df353c6-544a-4297-9543-fbf2723d8ddb', 'Cantabria', 'cantabria', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('14257cb2-11a8-4f14-b82c-687ec2f76a5b', 'Castilla-La Mancha', 'castilla-la-mancha', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('80eba354-7a9b-4818-8dc0-051dec587f3a', 'Comunidad de Madrid', 'comunidad-de-madrid', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('756964a4-8c77-4c33-bb76-d9f187602e3d', 'Extremadura', 'extremadura', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('8b1c6dc9-a15e-441a-98e6-545a1216d75c', 'Islas Baleares', 'islas-baleares', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('7b393255-bc44-437e-a158-c3993ba94ce8', 'Islas Canarias', 'islas-canarias', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('5f95af61-33b5-457b-a01f-dd723951a34a', 'Murcia', 'murcia', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00'),
	('267e3549-b148-432e-abbb-e5b990befa98', 'Navarra', 'navarra', NULL, NULL, NULL, true, '2026-02-18 17:18:31.931804+00');


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."companies" ("id", "user_id", "business_name", "contact_person", "email", "phone", "address", "description", "authenticity_story", "status", "created_at", "updated_at", "region_id", "category_id", "logo_url", "cover_image_url", "website", "social_media", "latitude", "longitude", "avg_rating", "total_reviews", "stripe_account_id", "stripe_onboarding_status", "stripe_charges_enabled", "stripe_payouts_enabled", "stripe_details_submitted", "stripe_connected_at", "stripe_onboarded_at", "slug", "welcome_sent_at") VALUES
	('a91260d4-e919-4d52-b005-5ab3dea106d9', '374b39f8-b0aa-4034-951e-dd16cff126ff', 'ORIGEN', 'Origen', 'info@origen.it.com', '633804448', 'Alcalá 372, 3C, ESC EXT', 'Quesería', 'Desde 1991. Empresa familiar', 'approved', '2026-01-21 17:06:32.788103+00', '2026-02-12 12:05:31.075788+00', NULL, NULL, NULL, NULL, 'https://origen.it.com', '{}', NULL, NULL, 0, 0, 'acct_1234567890ABCDEFG', 'not_started', false, false, false, NULL, NULL, 'origen', NULL);


--
-- Data for Name: pack_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pack_templates" ("id", "name", "type", "color", "description", "requirements", "created_at") VALUES
	('b8ab7975-38c2-4f0e-b011-2729ea043e2b', 'Pack Raíz', 'raiz', '#8B4513', 'Pack básico con productos esenciales de la región', '["Productos locales", "Historia del productor", "Certificaciones básicas"]', '2025-09-28 17:45:21.824764+00'),
	('63d8c1d8-562f-4c8d-a849-629ada9683fe', 'Pack Esencia', 'esencia', '#FF8C00', 'Pack intermedio con productos premium y experiencias', '["Productos premium", "Experiencia completa", "Sostenibilidad", "Historia detallada"]', '2025-09-28 17:45:21.824764+00'),
	('e26a0cb6-414b-4460-a8bd-3b04a00657c5', 'Pack Gourmet', 'gourmet', '#8A2BE2', 'Pack premium con productos exclusivos y experiencias únicas', '["Productos exclusivos", "Experiencia premium", "Certificaciones avanzadas", "Trazabilidad completa"]', '2025-09-28 17:45:21.824764+00');


--
-- Data for Name: company_packs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company_packs" ("id", "company_id", "template_id", "title", "slug", "status", "price", "shipping_policy", "sustainability_info", "tags", "created_at", "updated_at", "name", "is_active", "is_published", "published_at", "is_demo", "moderation_status") VALUES
	('ff51896f-b608-44f5-8e8a-8904a38dcf54', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Pack Esencia (DEMO)', 'pack-esencia-demo', 'published', 60.00, NULL, NULL, '{}', '2026-02-11 21:06:01.759344+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('bac9b07a-10ea-40ef-a978-1b2fa8b1bd85', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Pack Ruta ORIGEN Test', 'pack-ruta-origen-test', 'published', 60.00, NULL, NULL, NULL, '2026-02-09 21:02:25.289763+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-02-12 17:32:42.927216+00', true, 'approved'),
	('91000000-0000-0000-0000-000000000001', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Pack Esencia · Sierra Mediterránea (DEMO)', 'pack-esencia-sierra-mediterranea-demo', 'published', 60.00, NULL, NULL, '{esencia,premium,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('91000000-0000-0000-0000-000000000002', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Pack Esencia · Maridaje de Territorio (DEMO)', 'pack-esencia-maridaje-territorio-demo', 'published', 60.00, NULL, NULL, '{esencia,km0,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('91000000-0000-0000-0000-000000000003', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Pack Temporada · Edición Limitada (DEMO)', 'pack-temporada-edicion-limitada-demo', 'published', 90.00, NULL, NULL, '{temporada,edicion-limitada,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('91000000-0000-0000-0000-000000000004', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Recomendado por ORIGEN · Selección Esencia (DEMO)', 'recomendado-origen-seleccion-esencia-demo', 'published', 90.00, NULL, NULL, '{recomendado,origen,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('92000000-0000-0000-0000-000000000001', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Ruta ORIGEN · Dehesa y Almazara (DEMO)', 'ruta-origen-dehesa-almazara-demo', 'published', 90.00, NULL, NULL, '{ruta-origen,experiencia,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('92000000-0000-0000-0000-000000000002', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Ruta ORIGEN · Mar y Obrador (DEMO)', 'ruta-origen-mar-obrador-demo', 'published', 90.00, NULL, NULL, '{ruta-origen,mar,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('92000000-0000-0000-0000-000000000003', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Ruta ORIGEN · Vino y Queso (DEMO)', 'ruta-origen-vino-queso-demo', 'published', 90.00, NULL, NULL, '{ruta-origen,vino,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved'),
	('92000000-0000-0000-0000-000000000004', 'a91260d4-e919-4d52-b005-5ab3dea106d9', NULL, 'Ruta ORIGEN · Pan y Dulce Tradición (DEMO)', 'ruta-origen-pan-dulce-tradicion-demo', 'published', 90.00, NULL, NULL, '{ruta-origen,panaderia,demo}', '2026-03-02 23:11:17.997085+00', '2026-03-02 23:42:07.442245+00', NULL, true, true, '2026-03-02 23:11:17.997085+00', true, 'approved');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "user_id", "full_name", "email", "phone", "address", "created_at", "updated_at", "avatar_url", "notification_email", "notification_sms", "notification_offers", "notification_newsletter", "welcome_sent_at") VALUES
	('0c0c40a6-f006-4393-bfcd-0a0b4438b085', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Pablo Rodríguez Gómez', 'rudick_97@hotmail.es', '', '', '2026-01-21 14:32:00.417572+00', '2026-01-21 14:51:04.756256+00', 'https://xivonturgevryfycspdl.supabase.co/storage/v1/object/public/customer-avatars/fe6af856-9315-41f8-b5cf-7f9a4f3d4770/1769007064580.jpeg', true, false, true, true, NULL),
	('9233b567-5fe0-4755-8c39-dedc801fcda6', '374b39f8-b0aa-4034-951e-dd16cff126ff', 'pablo', 'pablo@contactaevum.com', NULL, NULL, '2026-01-21 17:04:50.992361+00', '2026-01-21 17:04:50.992361+00', NULL, true, false, true, true, NULL),
	('9a8dc708-b232-4e8a-a9cc-7c2f2d5763e9', '96c7b577-cc4b-4493-8352-55901435d031', 'Pablo Rodríguez Gómez', 'pablooopablopr@hotmail.com', '660384661', 'University Ave ste 108', '2026-02-11 17:01:54.975033+00', '2026-02-11 19:40:13.97174+00', 'https://xivonturgevryfycspdl.supabase.co/storage/v1/object/public/customer-avatars/96c7b577-cc4b-4493-8352-55901435d031/1770838786673.jpeg', true, false, true, true, NULL),
	('92ca8342-ef8a-490f-91a4-d0adb1e53e3e', '34b6b828-0370-463e-87c1-7239849be728', 'pablo', 'roberto.rgomez@outlook.com', NULL, NULL, '2026-02-17 18:52:26.384111+00', '2026-02-17 18:52:26.384111+00', NULL, true, false, true, true, NULL),
	('281c86e4-0738-462e-b545-9f0f6221f3e0', '1e3b23a1-5cfa-4d5a-b85d-20903891968e', 'Pablo', 'pablooopablooopr@gmail.com', NULL, NULL, '2026-03-03 00:05:26.144266+00', '2026-03-03 00:05:26.144266+00', NULL, true, false, true, true, NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: checkout_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: company_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: favorite_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pack_analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pack_elements; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pack_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pack_products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pack_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: promotional_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."routes" ("id", "creator_id", "region_id", "title", "slug", "description", "narrative", "duration", "difficulty", "image_url", "is_featured", "is_public", "total_stops", "avg_rating", "total_participants", "practical_info", "daily_recommendations", "created_at", "updated_at", "base_price_per_person", "is_active", "created_by", "is_demo", "moderation_status") VALUES
	('f784e5bc-fd46-42e8-a82a-7a4bb1e5eb83', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', NULL, '[DEMO] Panadería Dulce Tradición', 'panaderia-dulce-tradicion', 'Ruta demo para testear el flujo completo.', NULL, NULL, 'Fácil', NULL, false, true, 0, 0, 0, '{}', '[]', '2026-02-11 21:06:01.759344+00', '2026-02-18 20:55:53.185193+00', 9.90, true, '374b39f8-b0aa-4034-951e-dd16cff126ff', true, 'approved'),
	('934e4072-54c2-4e49-a83a-5753e9e918f9', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', NULL, 'Ruta Test ORIGEN', 'ruta-test', 'Ruta de prueba para validar compra/acceso.', 'Una ruta sencilla para testear el flujo.', '1h', 'Fácil', 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6', false, true, 3, 0, 0, '{}', '[]', '2026-02-09 10:53:38.842364+00', '2026-02-20 14:16:36.398244+00', 9.90, true, 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', false, 'approved');


--
-- Data for Name: route_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."route_access" ("id", "user_id", "route_id", "valid_from", "valid_until", "created_at") VALUES
	('b29876e3-0597-40ee-8933-55936ea9c48d', '374b39f8-b0aa-4034-951e-dd16cff126ff', '934e4072-54c2-4e49-a83a-5753e9e918f9', '2026-02-09 11:35:18.663211+00', NULL, '2026-02-09 11:35:18.663211+00');


--
-- Data for Name: route_company_packs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."route_company_packs" ("id", "route_id", "company_pack_id", "created_at") VALUES
	('40ab6f84-10c4-44f2-97a3-41e5224459de', '934e4072-54c2-4e49-a83a-5753e9e918f9', 'bac9b07a-10ea-40ef-a978-1b2fa8b1bd85', '2026-02-09 21:39:02.477355+00');


--
-- Data for Name: route_purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: route_stops; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."route_stops" ("id", "route_id", "company_id", "name", "type", "type_icon", "description", "what_to_do", "address", "schedule", "latitude", "longitude", "images", "highlights", "external_link", "position", "created_at", "is_premium", "created_by") VALUES
	('776d6664-6c64-4060-94fc-889597230238', '934e4072-54c2-4e49-a83a-5753e9e918f9', NULL, 'Parada 3 · Aceite de Oliva', 'aceite', NULL, 'Cata breve y compra opcional.', '[]', 'Calle Test 3, Ciudad', NULL, 40.4182, -3.7052, '[]', '[]', NULL, 3, '2026-02-09 10:54:27.740049+00', false, 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770'),
	('f67fbf40-b16e-4145-bc79-e2f5de184e95', '934e4072-54c2-4e49-a83a-5753e9e918f9', NULL, 'Parada 1 · Panadería', NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL, '[]', '[]', NULL, 1, '2026-02-09 21:46:01.365396+00', false, 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770'),
	('c87aba5b-afca-40b6-8e8c-e4139162d0d3', '934e4072-54c2-4e49-a83a-5753e9e918f9', NULL, 'Parada 2 · Quesería', 'queseria', NULL, 'Visita a la tienda y recomendación de productos.', '[]', 'Calle Test 2, Ciudad', NULL, 40.4175, -3.7045, '[]', '[]', NULL, 2, '2026-02-09 10:54:27.740049+00', true, 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770');


--
-- Data for Name: saved_routes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: stop_company_packs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stop_company_packs" ("stop_id", "company_pack_id", "created_at") VALUES
	('f67fbf40-b16e-4145-bc79-e2f5de184e95', 'bac9b07a-10ea-40ef-a978-1b2fa8b1bd85', '2026-02-09 21:46:55.543495+00');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "user_id", "role", "created_at") VALUES
	('a14300b7-9b0f-44fc-9de5-de2e36f34c38', '374b39f8-b0aa-4034-951e-dd16cff126ff', 'admin', '2026-02-10 12:45:44.768353+00');


--
-- Data for Name: webhook_context_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: webhook_whoami_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: _service_role_canary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."_service_role_canary_id_seq"', 1, false);


--
-- Name: webhook_context_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."webhook_context_log_id_seq"', 1, false);


--
-- Name: webhook_whoami_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."webhook_whoami_log_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict xjF8YzPa8EyPCGEpz0BlRTcTfhR70G3Rd77PcKDBTyzzX83qzpyhIhOtycQcRfj

RESET ALL;
