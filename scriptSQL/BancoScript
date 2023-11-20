--
-- PostgreSQL database cluster dump
--

-- Started on 2023-11-09 17:29:36

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
-- Database "tcc" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-11-09 17:29:36

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
-- TOC entry 3379 (class 1262 OID 19192)
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
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administrador_id_seq OWNED BY public.administrador.id;


--
-- TOC entry 225 (class 1259 OID 52075)
-- Name: horarios_configurados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horarios_configurados (
    id integer NOT NULL,
    horario time without time zone NOT NULL,
    ativo boolean DEFAULT true
);


ALTER TABLE public.horarios_configurados OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 52074)
-- Name: horarios_configurados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horarios_configurados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.horarios_configurados_id_seq OWNER TO postgres;

--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 224
-- Name: horarios_configurados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_configurados_id_seq OWNED BY public.horarios_configurados.id;


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
    cliente_cpf character varying
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
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 216
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horarios_disponiveis_id_seq OWNED BY public.horarios_disponiveis.id;


--
-- TOC entry 223 (class 1259 OID 52056)
-- Name: horariosusuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.horariosusuarios (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    horario_id integer NOT NULL,
    dia date NOT NULL,
    horario time without time zone NOT NULL,
    cpf character varying NOT NULL
);


ALTER TABLE public.horariosusuarios OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 52055)
-- Name: horariosusuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.horariosusuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.horariosusuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 222
-- Name: horariosusuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.horariosusuarios_id_seq OWNED BY public.horariosusuarios.id;


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
-- TOC entry 3384 (class 0 OID 0)
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
    telefone character varying,
    bloqueado boolean
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
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3200 (class 2604 OID 35611)
-- Name: administrador id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador ALTER COLUMN id SET DEFAULT nextval('public.administrador_id_seq'::regclass);


--
-- TOC entry 3204 (class 2604 OID 52078)
-- Name: horarios_configurados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_configurados ALTER COLUMN id SET DEFAULT nextval('public.horarios_configurados_id_seq'::regclass);


--
-- TOC entry 3199 (class 2604 OID 35612)
-- Name: horarios_disponiveis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis ALTER COLUMN id SET DEFAULT nextval('public.horarios_disponiveis_id_seq'::regclass);


--
-- TOC entry 3203 (class 2604 OID 52059)
-- Name: horariosusuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horariosusuarios ALTER COLUMN id SET DEFAULT nextval('public.horariosusuarios_id_seq'::regclass);


--
-- TOC entry 3201 (class 2604 OID 35613)
-- Name: log_alteracoes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes ALTER COLUMN id SET DEFAULT nextval('public.log_alteracoes_id_seq'::regclass);


--
-- TOC entry 3198 (class 2604 OID 35614)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3366 (class 0 OID 35600)
-- Dependencies: 218
-- Data for Name: administrador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrador (id, email, senha) FROM stdin;
1	feliperafaeldocouto@hotmail.com	teste
\.


--
-- TOC entry 3373 (class 0 OID 52075)
-- Dependencies: 225
-- Data for Name: horarios_configurados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_configurados (id, horario, ativo) FROM stdin;
2	15:00:00	t
3	12:00:00	t
\.


--
-- TOC entry 3365 (class 0 OID 35586)
-- Dependencies: 217
-- Data for Name: horarios_disponiveis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horarios_disponiveis (id, dia, horario, disp, valor, cliente_cpf) FROM stdin;
11	2023-10-01	12:00:00	1	300	\N
5	2023-09-05	08:00:00	1	250	\N
7	2023-09-05	10:00:00	1	250	\N
6	2023-09-05	09:00:00	1	250	\N
8	2023-09-30	12:00:00	1	250	\N
9	2023-09-30	12:00:00	1	250	\N
12	2023-09-21	12:00:00	1	100	\N
3	2023-09-04	09:00:00	1	250	\N
4	2023-09-04	10:00:00	1	250	\N
1	2023-09-04	08:00:00	1	250	\N
13	2023-11-09	15:00:00	1	\N	\N
14	2023-11-09	12:00:00	1	\N	\N
\.


--
-- TOC entry 3371 (class 0 OID 52056)
-- Dependencies: 223
-- Data for Name: horariosusuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.horariosusuarios (id, usuario_id, horario_id, dia, horario, cpf) FROM stdin;
4	85	1	2023-09-04	08:00:00	132.139.579-50
\.


--
-- TOC entry 3368 (class 0 OID 35604)
-- Dependencies: 220
-- Data for Name: log_alteracoes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_alteracoes (id, acao, observacao, dia, horario, data_hora, valor) FROM stdin;
7	Inclusao	\N	2023-10-01	12:00:00	2023-09-15 14:50:50.77681	300
8	Inclusao	\N	2023-09-21	12:00:00	2023-09-21 17:41:05.232924	100
\.


--
-- TOC entry 3363 (class 0 OID 27390)
-- Dependencies: 215
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, senha, nome, cpf, tokenuser, tokenvalidado, horario_id, telefone, bloqueado) FROM stdin;
85	feliperafaeldocouto@hotmail.com	ffff	felipe	132.139.579-50	65693	t	\N	\N	\N
\.


--
-- TOC entry 3386 (class 0 OID 0)
-- Dependencies: 219
-- Name: administrador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administrador_id_seq', 1, false);


--
-- TOC entry 3387 (class 0 OID 0)
-- Dependencies: 224
-- Name: horarios_configurados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_configurados_id_seq', 3, true);


--
-- TOC entry 3388 (class 0 OID 0)
-- Dependencies: 216
-- Name: horarios_disponiveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horarios_disponiveis_id_seq', 14, true);


--
-- TOC entry 3389 (class 0 OID 0)
-- Dependencies: 222
-- Name: horariosusuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.horariosusuarios_id_seq', 4, true);


--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 221
-- Name: log_alteracoes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_alteracoes_id_seq', 8, true);


--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 214
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 97, true);


--
-- TOC entry 3211 (class 2606 OID 35616)
-- Name: administrador administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrador
    ADD CONSTRAINT administrador_pkey PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 52081)
-- Name: horarios_configurados horarios_configurados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_configurados
    ADD CONSTRAINT horarios_configurados_pkey PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 35591)
-- Name: horarios_disponiveis horarios_disponiveis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horarios_disponiveis
    ADD CONSTRAINT horarios_disponiveis_pkey PRIMARY KEY (id);


--
-- TOC entry 3215 (class 2606 OID 52061)
-- Name: horariosusuarios horariosusuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horariosusuarios
    ADD CONSTRAINT horariosusuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3213 (class 2606 OID 35618)
-- Name: log_alteracoes log_alteracoes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_alteracoes
    ADD CONSTRAINT log_alteracoes_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 27395)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3218 (class 2606 OID 52067)
-- Name: horariosusuarios fk_horario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horariosusuarios
    ADD CONSTRAINT fk_horario FOREIGN KEY (horario_id) REFERENCES public.horarios_disponiveis(id);


--
-- TOC entry 3219 (class 2606 OID 52062)
-- Name: horariosusuarios fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.horariosusuarios
    ADD CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


-- Completed on 2023-11-09 17:29:37

--
-- PostgreSQL database dump complete
--

-- Completed on 2023-11-09 17:29:37

--
-- PostgreSQL database cluster dump complete
--

