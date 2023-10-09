--
-- PostgreSQL database cluster dump
--

-- Started on 2023-09-14 21:45:24

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-09-14 21:45:24

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

-- Completed on 2023-09-14 21:45:24

--
-- PostgreSQL database dump complete
--

--
-- Database "tcc" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-09-14 21:45:24

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
-- TOC entry 3356 (class 1262 OID 16398)
-- Name: tcc; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE tcc WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';


ALTER DATABASE tcc OWNER TO postgres;

\connect tcc

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16416)
-- Name: administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrador (
    id integer NOT NULL,
    email character varying(100),
    senha character varying(30)
);


ALTER TABLE public.administrador OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16415)
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
-- Dependencies: 218
-- Name: administrador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_seq OWNED BY public.administrador.id;


--
-- TOC entry 214 (class 1259 OID 16399)
-- Name: horarios_disponiveis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios_disponiveis (
    id integer NOT NULL,
    dia date NOT NULL,
    horario time without time zone NOT NULL,
    disp boolean NOT NULL,
    observacao character varying(500),
    cpf character varying(12),
    valor integer
);


ALTER TABLE public.horarios_disponiveis OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16402)
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
-- Dependencies: 215
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_disponiveis_id_seq OWNED BY public.horarios_disponiveis.id;


--
-- TOC entry 221 (class 1259 OID 16425)
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
-- TOC entry 220 (class 1259 OID 16424)
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
-- Dependencies: 220
-- Name: log_alteracoes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_alteracoes_id_seq OWNED BY public.log_alteracoes.id;


--
-- TOC entry 216 (class 1259 OID 16403)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(30) NOT NULL,
    nome character varying(255),
    cpf character varying(255),
    tokenuser character varying(20)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16408)
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
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3190 (class 2604 OID 16419)
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- TOC entry 3188 (class 2604 OID 16409)
-- Name: horarios_disponiveis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis ALTER COLUMN id SET DEFAULT nextval('public.horarios_disponiveis_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 16428)
-- Name: log_alteracoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes ALTER COLUMN id SET DEFAULT nextval('public.log_alteracoes_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16410)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3348 (class 0 OID 16416)
-- Dependencies: 219
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, email, senha) FROM stdin;
1	feliperafaeldocouto@hotmail.com	teste
\.


--
-- TOC entry 3343 (class 0 OID 16399)
-- Dependencies: 214
-- Data for Name: horarios_disponiveis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_disponiveis (id, dia, horario, disp, observacao, cpf, valor) FROM stdin;
1	2023-09-04	08:00:00	t	\N	\N	\N
3	2023-09-04	09:00:00	t	\N	\N	\N
4	2023-09-04	10:00:00	f	\N	\N	\N
5	2023-09-05	08:00:00	t	\N	\N	\N
6	2023-09-05	09:00:00	f	\N	\N	\N
7	2023-09-05	10:00:00	t	\N	\N	\N
8	2023-09-30	10:00:00	t	\N	\N	100
9	2023-09-30	10:00:00	t	\N	\N	100
10	2023-09-30	10:00:00	t	\N	\N	100
\.


--
-- TOC entry 3350 (class 0 OID 16425)
-- Dependencies: 221
-- Data for Name: log_alteracoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_alteracoes (id, acao, observacao, dia, horario, data_hora, valor) FROM stdin;
1	Bloqueio de Horário	\N	2023-09-04	09:00:00	2023-09-14 21:12:19.321186	\N
2	Bloqueio de Horário	\N	2023-09-04	09:00:00	2023-09-14 21:14:41.642831	\N
3	Bloqueio de Horário	\N	2023-09-04	09:00:00	2023-09-14 21:15:58.419088	\N
4	Bloqueio de Horário	\N	2023-09-04	09:00:00	2023-09-14 21:17:47.861259	\N
5	Bloqueio de Horário	testeeee	2023-09-04	09:00:00	2023-09-14 21:18:24.617164	\N
6	Inclusao	\N	2023-09-30	10:00:00	2023-09-14 21:42:38.205753	100
\.


--
-- TOC entry 3345 (class 0 OID 16403)
-- Dependencies: 216
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, senha, nome, cpf, tokenuser) FROM stdin;
76	feliperafaeldocouto@hotmail.com	ffff	fffff	132.139.579-50	64815
77	rodolpho@artean.com.br	10203040	10203040	01122329229	87305
\.


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 218
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 1, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 215
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_disponiveis_id_seq', 10, true);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 220
-- Name: log_alteracoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_alteracoes_id_seq', 6, true);


--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 77, true);


--
-- TOC entry 3198 (class 2606 OID 16421)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- TOC entry 3194 (class 2606 OID 16412)
-- Name: horarios_disponiveis horarios_disponiveis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis
    ADD CONSTRAINT horarios_disponiveis_pkey PRIMARY KEY (id);


--
-- TOC entry 3200 (class 2606 OID 16433)
-- Name: log_alteracoes log_alteracoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes
    ADD CONSTRAINT log_alteracoes_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 16414)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


-- Completed on 2023-09-14 21:45:25

--
-- PostgreSQL database dump complete
--

-- Completed on 2023-09-14 21:45:25

--
-- PostgreSQL database cluster dump complete
--

