--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: appuser
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO appuser;

--
-- Name: myschema; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA myschema;


ALTER SCHEMA myschema OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: befast; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.befast (
    id character varying(255) NOT NULL,
    b character varying,
    e character varying,
    f character varying,
    a character varying,
    s character varying,
    t character varying,
    case_id character varying(255),
    last_modified_on text
);


ALTER TABLE public.befast OWNER TO postgres;

--
-- Name: cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cases (
    id character varying(255) NOT NULL,
    patient_id character varying(255),
    status character varying(255),
    onset text,
    created_on text,
    finished_on text,
    doctor character varying
);


ALTER TABLE public.cases OWNER TO postgres;

--
-- Name: ct_result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ct_result (
    id character varying(255) NOT NULL,
    case_id character varying(255),
    result character varying(255),
    last_modified_on text
);


ALTER TABLE public.ct_result OWNER TO postgres;

--
-- Name: injection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.injection (
    id character varying(255) NOT NULL,
    case_id character varying(255),
    bolus numeric,
    drip numeric,
    bolus_timestamp text,
    drip_timestamp text,
    last_modified_on text DEFAULT CURRENT_TIMESTAMP,
    doctor character varying(255)
);


ALTER TABLE public.injection OWNER TO postgres;

--
-- Name: nihss; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nihss (
    id character varying(255) NOT NULL,
    score integer,
    case_id character varying(255),
    round integer NOT NULL,
    last_modified_on text,
    start_on text,
    checklist jsonb
);


ALTER TABLE public.nihss OWNER TO postgres;

--
-- Name: patient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient (
    id character varying(255) NOT NULL,
    name character varying(255),
    gender character varying(50),
    age integer,
    dob date,
    weight double precision,
    height double precision,
    address character varying(255),
    symptoms character varying(255),
    reg_id character varying(13)
);


ALTER TABLE public.patient OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: thrombolytic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thrombolytic (
    id character varying(255) NOT NULL,
    case_id character varying(255),
    last_modified_on text,
    is_met boolean,
    checklist jsonb
);


ALTER TABLE public.thrombolytic OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(255) NOT NULL,
    role character varying(255),
    password character varying(255),
    name character varying(255),
    email character varying(255),
    status boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: befast; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.befast (id, b, e, f, a, s, t, case_id, last_modified_on) FROM stdin;
010d5154-02a1-4c9b-9116-a3dffd284bdc	11	11	11	111	00	00	5b9403c1-a472-470d-b59d-057103356dec	2024-10-08T03:40:10.227+00:00
1e2dff0f-2206-49ae-9721-0967da405fc6	10	00	00	000	00	00	60288296-ca8d-4373-a89a-fcdd1f4a2a8f	2024-10-08T03:50:56.786+00:00
\.


--
-- Data for Name: cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cases (id, patient_id, status, onset, created_on, finished_on, doctor) FROM stdin;
5b9403c1-a472-470d-b59d-057103356dec	fda4b3b1-f670-4e79-af48-f5e5355fbd13	Admit	2024-10-08T03:30:54.287+00:00	2024-10-08T03:39:18.863+00:00	2024-10-08T03:42:38.852+00:00	\N
60288296-ca8d-4373-a89a-fcdd1f4a2a8f	2e94f08f-3354-486a-8696-e579839ef9ca	Active	2024-10-08T01:20:57.608+00:00	2024-10-08T03:47:18.391+00:00	\N	\N
\.


--
-- Data for Name: ct_result; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ct_result (id, case_id, result, last_modified_on) FROM stdin;
6e36def9-74a4-42b4-900f-1285bdd2bef8	5b9403c1-a472-470d-b59d-057103356dec	Ischemic	2024-10-08T03:40:45.269+00:00
\.


--
-- Data for Name: injection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.injection (id, case_id, bolus, drip, bolus_timestamp, drip_timestamp, last_modified_on, doctor) FROM stdin;
43148335-b5ab-4d48-9555-38a077b9a357	5b9403c1-a472-470d-b59d-057103356dec	\N	56.7	2024-10-08T03:42:13.315+07:00	2024-10-08T03:42:14.481+07:00	2024-10-08T03:42:17.314Z	Docter Strange
\.


--
-- Data for Name: nihss; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nihss (id, score, case_id, round, last_modified_on, start_on, checklist) FROM stdin;
582d5b97-0bab-4383-a7b3-93d80eaf07ae	27	5b9403c1-a472-470d-b59d-057103356dec	0	2024-10-08T03:41:51.931+00:00	2024-10-08T03:41:48.072+00:00	{"ataxia": 0, "neglect": 0, "sensory": 0, "bestGaze": 2, "dysarthria": 0, "facialPalsy": 3, "twoCommands": 2, "motorLeftArm": 3, "motorLeftLeg": 3, "twoQuestions": 2, "motorRightArm": 3, "motorRightLeg": 3, "bestVisualField": 3, "bestLanguageAphasia": 0, "levelOfConsciousness": 3}
\.


--
-- Data for Name: patient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient (id, name, gender, age, dob, weight, height, address, symptoms, reg_id) FROM stdin;
ace74fbd-2ca2-431d-a45b-e8ee45fd852b	beck	\N	54	\N	\N	\N	\N		\N
9576f220-88d0-4677-9f6c-9b0d755d7054	James	Male	21	2002-11-21	76	183	456 Oak St	Cough, Fever	1234567890980
e60fbb27-fd79-4be2-871f-14344ecec5f1	Test	Male	-1	2024-10-29	\N	\N	Hangdong	\N	\N
603f61da-fda9-45ca-aa32-3789d8fa7e34	Teerit	Female	0	2024-09-28	\N	\N	Hangdong	\N	\N
e80dcef2-f652-42cd-b34b-87f2c70ecc2c	Teerit	Female	0	2024-09-28	\N	\N	Hangdong	\N	\N
921fb2c6-92a0-4161-96b7-01097d1665c9	Jane Doe	Female	29	1995-01-01	65	165	456 Oak St	Cough, Fever	\N
fd0d8bca-48eb-434c-8ef3-1e14fd4481b9	Teerit	Male	-1	2024-10-16	\N	\N	Hangdong	\N	\N
e9eb43ad-ff77-4d6f-8f0e-2d13a5df7306	Teerit Youngmeesuk	Female	-1	2024-10-24	\N	-69	Hangdong	\N	\N
e3fb3aee-bad0-473f-9983-6adb35e9b2ae	Gigi	\N	54	\N	\N	\N	\N		\N
e0d253e2-1b50-4647-8d37-911bd7a8d192	Beck	Male	21	2002-11-20	75	183	\N	\N	\N
a218f161-60f9-4c86-b286-207a2ee8e1ee	test	Male	21	2002-12-21	50	\N	239 Huay Kaew Rd, Suthep, Mueang Chiang Mai District	\N	\N
3cf2f6e4-6c21-4196-82ad-deae0bbbf972	test	\N	54	\N	\N	\N	\N	\N	\N
2256fd6b-23ec-40ef-8a40-679e0f802beb	Beck	Male	54	\N	\N	\N		\N	\N
6226b34a-796a-406c-bada-5c5660028f3e	John Doe Updated	Male	34	1990-01-02	75	180	456 New Address	\N	\N
c71ffbd1-73d9-4ca7-b476-cf34933d97ee	Beck	\N	54	\N	\N	\N	\N	\N	\N
945dd03f-abf5-4baa-845e-ece59be00531	John Doe Updated	Male	34	1990-01-04	75	180	456 New Address	\N	\N
e2122fae-7730-410a-9119-ebe9a20f73d4	Teerit Youngmeesuk	Male	-5	2028-10-26	70	5.645465743425578e+26	223/80 Sanphakwan	\N	1234567890980
2e2bbb5e-0dec-41ea-8ed9-acab4d742ee2	สมศรี สุขใจ	Female	0	2024-09-29	\N	\N	223/80 Sanphakwan Hangdong Chiangmai	\N	\N
9e3d48d6-0512-4f8d-bab6-279a8630b6ba	Teerit Youngmeesuk	Female	-1	2024-10-08	\N	\N	456 Oak St	\N	\N
293f0f4d-6d24-4a15-a647-f6ed93316add	New	Female	-1	2024-10-09	\N	\N	456 Oak St	\N	\N
77e816c5-376f-411d-9481-70452f5ad05f	Teerit Youngmeesuk	Female	6	2017-10-24	\N	\N	456 Oak St	\N	\N
f04abb24-b791-4664-8c7a-f1c393e55a5f	Natsinee Sasanasopa	Female	19	2004-10-08	\N	\N	239 Huay Kaew Rd, Suthep, Mueang Chiang Mai District	\N	\N
e8dd49f6-f3b5-4176-ada1-a583c290692a	Phanthat Muenphrap	Female	41	1983-10-05	50	\N	239 Huay Kaew Rd, Suthep, Mueang Chiang Mai District	\N	\N
6176e2af-82a8-4db4-a583-30a397b9abe1	john	\N	54	\N	\N	\N	\N	\N	\N
724ca372-32d4-45ee-b738-51144d6f5c2d	beck		54	\N	80	\N			\N
ca473098-da44-491f-a223-3f2c45118fea	new		54	\N	\N	\N			\N
1bf02325-0966-4095-8270-5e1c65fc06e0	test	\N	54	\N	\N	\N	\N		\N
8840f1a8-0c24-49d4-8e90-2b7e4499072c	test	\N	54	\N	\N	\N	\N		\N
f35a2ee9-031b-41e0-bc35-c57eb493438b	Phanthat Muenphrap	Male	-1	2024-11-07	\N	\N	\N		\N
9f34ecaa-cc10-4689-bcf7-958be7970589	Teerit	Male	54	\N	\N	\N	\N		\N
e4f71950-e2ef-41ed-99ac-804c5f99d096	Teerit Youngmeesuk	Male	21	2002-11-19	70	173			1509966245131
2c82d9c3-d2a9-46f0-a0f3-91972ea077ef	Beck	\N	54	\N	\N	\N	\N		\N
239a2e75-0c84-40b9-b680-4776fc013f42	Beck	\N	54	\N	\N	\N	223/80 Sanphakwan		\N
d14c1501-d760-4854-8909-d8247b6cd3b4	territ	\N	54	\N	\N	\N	\N		\N
51e7085f-3bdc-4ede-b095-abd7034a41b3	Beck	Male	21	2002-11-21	70	173			1509966245131
f63ecf18-27c5-4abe-a62d-384120a361ce	Mike Dean	Male	29	1995-01-01	65	165	456 Oak St	Cough, Fever	\N
1c6e66d8-a72e-49a1-ba17-e26e95b47292	beck	\N	54	\N	\N	\N	\N		\N
c3b82093-341d-45ef-abf2-6a6285f43405	beck	\N	54	\N	\N	\N	\N		\N
817adaa5-2e6f-43b0-9487-113403a719c3	gb	\N	54	\N	\N	\N	\N		\N
7674ca0b-acc8-4c6a-adb9-84d5154b76cd	James Doe	Male	28	1996-01-01	80	178	456 Oak St	Cough, Fever	\N
ae3bede5-1846-41a7-b54a-cf4b22f7bc04	James Doe	Male	28	1996-01-01	80	178	456 Oak St		\N
772d54b8-e80c-4ef3-8ca2-0a34e813b4e7	James Doe	Male	28	1996-01-01	80	178	456 Oak St		\N
7ffd9479-5bd6-4d59-8ef7-538724c81699	James Doe	Male	28	1996-01-01	80	178	456 Oak St		\N
7036a17c-5d13-43fb-a69c-02ae0d238ce7	James Doe	Male	28	1996-01-01	80	178	456 Oak St		\N
a152aa5e-5979-49bf-82a2-0fbcf731258f	James Doe	Male	28	1996-01-01	80	178	456 Oak St		\N
9af4b045-b023-4514-93ac-dd183380b0bb	James Doe	Male	28	1996-01-01	80	178	456 Oak St	\N	\N
fcc58eb6-d416-43b7-9149-b93011655fac	beck	\N	54	\N	\N	\N	\N	\N	\N
f1d37407-c3e8-4cad-b67c-2da5415d5486	James Doe	Male	28	1996-01-01	80	178	456 Oak St	\N	\N
e87567a5-1be5-460d-836f-b4f22c7f6dd8	John Doe	Male	34	1989-12-31	\N	\N	123 Main St	\N	\N
157d213b-40d9-4f15-b896-aa71f5d8ab0a	b		54	\N	\N	\N		\N	\N
7c1f39fa-176e-40f1-b568-f205fa18a84e	Beck	Male	54	\N	65	\N	\N	\N	\N
10d054ad-4ac3-4a97-a967-fa411baf29f8	b	\N	54	\N	\N	\N	\N	\N	\N
dc746b8c-015e-45cf-ab1c-c931e2b2652e	b	Male	54	\N	\N	\N	\N	\N	\N
a4aa9233-3228-4470-9125-886b37947f16	b	\N	54	\N	\N	\N	\N	\N	\N
7a297ffa-6565-4fac-94fd-a60260aca7e8	New	\N	54	\N	50	\N	\N	\N	\N
f0faa628-fc09-457c-a385-9da7d7a82bbf	test	Male	21	2002-12-21	\N	\N	239 Huay Kaew Rd, Suthep, Mueang Chiang Mai District	\N	\N
fda4b3b1-f670-4e79-af48-f5e5355fbd13	Phanthat Muenphrap	Male	34	1990-01-02	70	170		\N	1509966245131
2e94f08f-3354-486a-8696-e579839ef9ca	beck		54	\N	\N	\N		\N	\N
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
bU8_coGlMUWjpR5zBXfhge29COJrkec1	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-08T11:52:46.673Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 03:50:26
qZbUM4PJv3UFNl4b7jHrDqQTfMMD2xOp	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:34:09.943Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:34:10
eETZ_DFnPupL7Lf8iYoPjd-V415Ggfnm	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:34:27.910Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:34:28
_jTOkJkdrbedMaPXQ4wkN8GpHSx6eV22	{"cookie":{"originalMaxAge":86399999,"expires":"2024-10-09T01:36:05.002Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:36:06
eUhcP5_x14Ee1gKmWN6-Cr5ivMqwBVUt	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:42:24.215Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:42:51
n0CD1hVNALW39RiYOAvuQ70ibRsZNNqb	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:36:05.813Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:36:07
1eEilpuzXQ7yHstMBdF-RXzKsxsrrbaB	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:36:52.680Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:36:53
kGS5RI5WC6ABP5-1HvSaA2DfUssnBbNb	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-17T18:35:20.919Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-17 18:35:31
YfUtHzS9YVxdJRUDp2FbKCSRA_EZxsfo	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:36:59.892Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:37:00
WJJ836NJAzFXAmyiDTO1rM_F4AIQaz6c	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:37:00.587Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:37:01
WSpzBDjBNPR0KuB3OCmU56ajvp8pPSQH	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:44:14.604Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:44:17
iU-C1Jnj_x_Y9GyVUb9Yos1NdST5kfDA	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:37:51.620Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:37:52
XOHv13VuDori75GATueK5aGVD15PA30w	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:40:50.381Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:40:51
jpAwByVYDMWjLAT2AbT5dj1xtaZ3jBiS	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:40:50.382Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:40:51
qWml_tew4giaRtuR5qYbfsOJPTxnA8-T	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:42:24.214Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:42:25
0qEDuWZ3EzJ30vlbR8RsCjs64EuwX2H5	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:45:06.855Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:45:07
5Z40NbVIzGRfU2a80ad0QV62RAWFRYFZ	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:45:06.865Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:45:09
hDn9nmnbhnS1NowI11AybOF26jSsKo0G	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:44:14.603Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:44:15
Or3GRb65ygQQH9MIYXn-bQIW7Qd6FvBy	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:45:23.119Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:45:24
dOOYf5rd20xpqCLL7062ufzWULuy7Fbn	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:45:23.143Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:45:26
gQWNes8MkR7Al7MeczOiefYeNDOKXV7Y	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:47:13.696Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:47:14
r9-IBbhdOvvEVJISy3iypR3Vc6JHcuzZ	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:48:37.645Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:48:38
Wua99iCEqF2gVeZMndMitCOLN0wcuws8	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:51:19.046Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:51:22
i2COzdvdVkPf1wBtlbu-lDSFWAbrfKY9	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:48:53.982Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:48:57
0EsUJOcBgUVYLATi9GSMPQQyNnzG-QKq	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:55:11.299Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:55:14
K-tDvXNAFC8FgG9AGVx-y7pmGriENoIp	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:55:29.305Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"admin","role":"admin","name":"Administrator","email":"admin@admin.com"}}	2024-10-09 01:55:30
PKw7lWXcKReJDkyah_tuXsZ7JN6bwpdw	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:55:52.683Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:55:53
cxr6XvimR5tVB7nvi9f_1OZ0Tabhy7Bf	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:56:07.131Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:56:08
dc7NdgNLgj4A2iUTRSkxrdRMhrtbfP7z	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:56:07.806Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:56:08
2wxM6e6_1c-jrwvvym254l83PRa0dqgp	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:56:34.143Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"}}	2024-10-09 01:58:20
PmnqOiP19Az0Y9v9LonyTDFbFxyBlEKG	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T02:01:27.978Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 02:01:30
XYcHVxDajYjx4mk-ECxISEXgmL5cbyzg	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:59:44.143Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:59:47
dsBkJgfq0ms78egA8fxLoybtKic5fXym	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T01:59:10.322Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 01:59:13
XMWfSNfAu4lpQ6rLErCeNcL5T6-4SUlm	{"cookie":{"originalMaxAge":86400000,"expires":"2024-10-09T03:38:52.680Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"username":"docter","role":"Doctor","name":"Docter Strange","email":"docter@sft.com"}}	2024-10-09 06:39:27
\.


--
-- Data for Name: thrombolytic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thrombolytic (id, case_id, last_modified_on, is_met, checklist) FROM stdin;
66095b38-b6a8-4d72-8a7b-0413dfb2f75d	5b9403c1-a472-470d-b59d-057103356dec	2024-10-08T03:41:03.068+00:00	\N	{"comment": "", "inclusion": {"ageOver18": true, "ischemicStroke": true, "onsetWithinTime": true, "measurableNeurologicalDeficit": true}, "absoluteExclusion": {"lowPlatelets": false, "activeBleeding": false, "anticoagulants": false, "seizureAtOnset": false, "bloodGlucoseLow": false, "recentHeadTrauma": false, "recentGIOrUTBleed": false, "recentMajorSurgery": false, "intracranialHemorrhage": false, "endocarditisOrDissection": false, "uncontrolledHypertension": false}, "relativeExclusion": {"pregnancy": false, "minorSymptoms": false, "majorSurgeryLast3Months": false, "recentGIBleedLast21Days": false, "lumbarOrArterialPuncture": false}}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, role, password, name, email, status) FROM stdin;
docter	Doctor	$2b$10$39UHiFot3yroSjrHikN3wub.yVhj5vbGLnEmCV3RUTgAAyJ/SZdwy	Docter Strange	docter@sft.com	t
admin	admin	$2b$10$Y9R7V8qwBOhPqClaDnFCMOTEDKzUOz9OdrK/JK4ThrBIh.n/ZoQ3S	Administrator	admin@admin.com	t
\.


--
-- Name: befast befast_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.befast
    ADD CONSTRAINT befast_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: ct_result ct_result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ct_result
    ADD CONSTRAINT ct_result_pkey PRIMARY KEY (id);


--
-- Name: injection injection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.injection
    ADD CONSTRAINT injection_pkey PRIMARY KEY (id);


--
-- Name: nihss nihss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nihss
    ADD CONSTRAINT nihss_pkey PRIMARY KEY (id);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: thrombolytic thrombolytic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thrombolytic
    ADD CONSTRAINT thrombolytic_pkey PRIMARY KEY (id);


--
-- Name: befast unique_case_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.befast
    ADD CONSTRAINT unique_case_id UNIQUE (case_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: befast befast_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.befast
    ADD CONSTRAINT befast_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: cases cases_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id);


--
-- Name: ct_result ct_result_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ct_result
    ADD CONSTRAINT ct_result_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: injection injection_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.injection
    ADD CONSTRAINT injection_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: nihss nihss_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nihss
    ADD CONSTRAINT nihss_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: thrombolytic thrombolytic_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thrombolytic
    ADD CONSTRAINT thrombolytic_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;


--
-- Name: SCHEMA myschema; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA myschema TO appuser;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO appuser;


--
-- Name: TABLE befast; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.befast TO appuser;


--
-- Name: TABLE cases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.cases TO appuser;


--
-- Name: TABLE ct_result; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.ct_result TO appuser;


--
-- Name: TABLE nihss; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.nihss TO appuser;


--
-- Name: TABLE patient; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.patient TO appuser;


--
-- Name: TABLE thrombolytic; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.thrombolytic TO appuser;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.users TO appuser;


--
-- PostgreSQL database dump complete
--

