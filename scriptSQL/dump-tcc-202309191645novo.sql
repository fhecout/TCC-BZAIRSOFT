--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-09-19 16:45:35

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 35600)
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    id integer NOT NULL,
    email character varying(100),
    senha character varying(30)
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 35603)
-- Name: administrador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administrador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administrador_id_seq OWNER TO postgres;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_seq OWNED BY public.administrador.id;


--
-- TOC entry 217 (class 1259 OID 35586)
-- Name: horarios_disponiveis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios_disponiveis (
    id integer NOT NULL,
    dia date NOT NULL,
    horario time without time zone NOT NULL,
    disp boolean NOT NULL,
    valor integer
);


ALTER TABLE public.horarios_disponiveis OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 35585)
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_disponiveis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.horarios_disponiveis_id_seq OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 216
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_disponiveis_id_seq OWNED BY public.horarios_disponiveis.id;


--
-- TOC entry 220 (class 1259 OID 35604)
-- Name: log_alteracoes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_alteracoes (
    id integer NOT NULL,
    acao character varying(255) NOT NULL,
    observacao text,
    dia date,
    horario time without time zone,
    data_hora timestamp without time zone DEFAULT now(),
    valor integer
);


ALTER TABLE public.log_alteracoes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 35610)
-- Name: log_alteracoes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_alteracoes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.log_alteracoes_id_seq OWNER TO postgres;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_alteracoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_alteracoes_id_seq OWNED BY public.log_alteracoes.id;


--
-- TOC entry 215 (class 1259 OID 27390)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(30) NOT NULL,
    nome character varying(255) NOT NULL,
    cpf character varying(255) NOT NULL,
    tokenuser character varying(20),
    tokenvalidado boolean,
    horario_id integer,
    telefone character varying
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 27389)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3190 (class 2604 OID 35611)
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 35612)
-- Name: horarios_disponiveis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis ALTER COLUMN id SET DEFAULT nextval('public.horarios_disponiveis_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 35613)
-- Name: log_alteracoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes ALTER COLUMN id SET DEFAULT nextval('public.log_alteracoes_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 35614)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3347 (class 0 OID 35600)
-- Dependencies: 218
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, email, senha) FROM stdin;
1	feliperafaeldocouto@hotmail.com	teste
\.


--
-- TOC entry 3346 (class 0 OID 35586)
-- Dependencies: 217
-- Data for Name: horarios_disponiveis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_disponiveis (id, dia, horario, disp, valor) FROM stdin;
1	2023-09-04	08:00:00	t	250
3	2023-09-04	09:00:00	t	250
4	2023-09-04	10:00:00	f	250
5	2023-09-05	08:00:00	t	250
6	2023-09-05	09:00:00	f	250
7	2023-09-05	10:00:00	t	250
8	2023-09-30	12:00:00	t	250
9	2023-09-30	12:00:00	t	250
11	2023-10-01	12:00:00	t	300
\.


--
-- TOC entry 3349 (class 0 OID 35604)
-- Dependencies: 220
-- Data for Name: log_alteracoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_alteracoes (id, acao, observacao, dia, horario, data_hora, valor) FROM stdin;
7	Inclusao	\N	2023-10-01	12:00:00	2023-09-15 14:50:50.77681	300
\.


--
-- TOC entry 3344 (class 0 OID 27390)
-- Dependencies: 215
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, senha, nome, cpf, tokenuser, tokenvalidado, horario_id, telefone) FROM stdin;
76	feliperafaeldocouto@hotmail.com	ffff	fffff	132.139.579-50	64815	\N	\N	\N
77	rodolpho@artean.com.br	10203040	10203040	01122329229	87305	\N	\N	\N
78	felipe@artean.com.br	felipe2004	felipe	132.139.579-52	72802	t	\N	\N
\.


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 1, false);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 216
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_disponiveis_id_seq', 11, true);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_alteracoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_alteracoes_id_seq', 7, true);


--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 77, true);


--
-- TOC entry 3198 (class 2606 OID 35616)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 35591)
-- Name: horarios_disponiveis horarios_disponiveis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis
    ADD CONSTRAINT horarios_disponiveis_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 35618)
-- Name: log_alteracoes log_alteracoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes
    ADD CONSTRAINT log_alteracoes_pkey PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 27395)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


-- Completed on 2023-09-19 16:45:35

--
-- PostgreSQL database dump complete
--

