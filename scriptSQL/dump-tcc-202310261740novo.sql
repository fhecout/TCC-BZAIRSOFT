--
-- PostgreSQL database cluster dump
--

-- Started on 2023-10-26 17:40:08

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

-- Started on 2023-10-26 17:40:08

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

-- Completed on 2023-10-26 17:40:08

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

-- Started on 2023-10-26 17:40:09

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
-- TOC entry 3357 (class 1262 OID 19192)
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
-- TOC entry 3358 (class 0 OID 0)
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
    disp integer NOT NULL,
    valor integer,
    cliente_cpf integer
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
-- TOC entry 3359 (class 0 OID 0)
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
-- TOC entry 3360 (class 0 OID 0)
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
-- TOC entry 3361 (class 0 OID 0)
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
-- TOC entry 3348 (class 0 OID 35600)
-- Dependencies: 218
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, email, senha) FROM stdin;
1	feliperafaeldocouto@hotmail.com	teste
\.


--
-- TOC entry 3347 (class 0 OID 35586)
-- Dependencies: 217
-- Data for Name: horarios_disponiveis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_disponiveis (id, dia, horario, disp, valor, cliente_cpf) FROM stdin;
8	2023-09-30	12:00:00	3	250	\N
9	2023-09-30	12:00:00	2	250	\N
5	2023-09-05	08:00:00	2	250	\N
6	2023-09-05	09:00:00	2	250	\N
7	2023-09-05	10:00:00	2	250	\N
1	2023-09-04	08:00:00	2	250	\N
11	2023-10-01	12:00:00	2	300	\N
12	2023-09-21	12:00:00	1	100	\N
4	2023-09-04	10:00:00	1	250	\N
3	2023-09-04	09:00:00	2	250	84
\.


--
-- TOC entry 3350 (class 0 OID 35604)
-- Dependencies: 220
-- Data for Name: log_alteracoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_alteracoes (id, acao, observacao, dia, horario, data_hora, valor) FROM stdin;
7	Inclusao	\N	2023-10-01	12:00:00	2023-09-15 14:50:50.77681	300
8	Inclusao	\N	2023-09-21	12:00:00	2023-09-21 17:41:05.232924	100
\.


--
-- TOC entry 3345 (class 0 OID 27390)
-- Dependencies: 215
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, senha, nome, cpf, tokenuser, tokenvalidado, horario_id, telefone) FROM stdin;
84	feliperafaeldocouto@hotmail.com	felipe	ffff	132.139.579-50	29542	t	\N	felipe
\.


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 1, false);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 216
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_disponiveis_id_seq', 12, true);


--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_alteracoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_alteracoes_id_seq', 8, true);


--
-- TOC entry 3365 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 84, true);


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


--
-- TOC entry 3201 (class 2606 OID 51962)
-- Name: horarios_disponiveis fk_usuario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis
    ADD CONSTRAINT fk_usuario_id FOREIGN KEY (cliente_cpf) REFERENCES public.usuarios(id);


-- Completed on 2023-10-26 17:40:09

--
-- PostgreSQL database dump complete
--

-- Completed on 2023-10-26 17:40:09

--
-- PostgreSQL database cluster dump complete
--

