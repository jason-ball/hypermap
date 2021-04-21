--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5
-- Dumped by pg_dump version 13.2

-- Started on 2021-04-21 01:03:38 EDT

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
-- TOC entry 3848 (class 1262 OID 16671)
-- Name: hypermap; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE hypermap WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';


ALTER DATABASE hypermap OWNER TO postgres;

\connect hypermap

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
-- TOC entry 208 (class 1255 OID 16855)
-- Name: clear_old_purpleair_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.clear_old_purpleair_data() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	DELETE FROM purpleair_history WHERE time < (now() - '7 days'::interval);
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.clear_old_purpleair_data() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 16674)
-- Name: map_layer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_layer (
    layer_id integer NOT NULL,
    display_name character varying(64) NOT NULL,
    description text
);


ALTER TABLE public.map_layer OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16672)
-- Name: map_layer_layer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.map_layer_layer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.map_layer_layer_id_seq OWNER TO postgres;

--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 202
-- Name: map_layer_layer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.map_layer_layer_id_seq OWNED BY public.map_layer.layer_id;


--
-- TOC entry 205 (class 1259 OID 16706)
-- Name: arcgis_layer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arcgis_layer (
    layer_id integer DEFAULT nextval('public.map_layer_layer_id_seq'::regclass) NOT NULL,
    arcgis_id text NOT NULL
);


ALTER TABLE public.arcgis_layer OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16687)
-- Name: geojson_layer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geojson_layer (
    layer_id integer DEFAULT nextval('public.map_layer_layer_id_seq'::regclass) NOT NULL,
    geojson jsonb NOT NULL
);


ALTER TABLE public.geojson_layer OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16721)
-- Name: purpleair_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purpleair_history (
    purpleair_id integer NOT NULL,
    "time" timestamp with time zone NOT NULL,
    pm2_5 numeric(4,2) NOT NULL,
    temperature integer,
    humidity integer,
    corrected_pm2_5 numeric(4,2),
    correction_method character varying(7),
    latitude numeric(6,4) NOT NULL,
    longitude numeric(6,4) NOT NULL,
    end_time timestamp with time zone,
    server_time timestamp with time zone
);


ALTER TABLE public.purpleair_history OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16749)
-- Name: latest_purpleair_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.latest_purpleair_data AS
 SELECT h.purpleair_id,
    h."time",
    h.pm2_5,
    h.temperature,
    h.humidity,
    h.corrected_pm2_5,
    h.correction_method,
    h.latitude,
    h.longitude,
    h.end_time,
    h.server_time
   FROM (public.purpleair_history h
     JOIN ( SELECT purpleair_history.purpleair_id,
            max(purpleair_history."time") AS "time"
           FROM public.purpleair_history
          GROUP BY purpleair_history.purpleair_id) m ON (((h.purpleair_id = m.purpleair_id) AND (h."time" = m."time"))))
  ORDER BY h.purpleair_id;


ALTER TABLE public.latest_purpleair_data OWNER TO postgres;

--
-- TOC entry 3702 (class 2604 OID 16677)
-- Name: map_layer layer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_layer ALTER COLUMN layer_id SET DEFAULT nextval('public.map_layer_layer_id_seq'::regclass);


--
-- TOC entry 3706 (class 2606 OID 16682)
-- Name: map_layer MapLayer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_layer
    ADD CONSTRAINT "MapLayer_pkey" PRIMARY KEY (layer_id);


--
-- TOC entry 3710 (class 2606 OID 16729)
-- Name: arcgis_layer arcgis_layer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arcgis_layer
    ADD CONSTRAINT arcgis_layer_pkey PRIMARY KEY (layer_id);


--
-- TOC entry 3708 (class 2606 OID 16727)
-- Name: geojson_layer geojson_layer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geojson_layer
    ADD CONSTRAINT geojson_layer_pkey PRIMARY KEY (layer_id);


--
-- TOC entry 3712 (class 2606 OID 16725)
-- Name: purpleair_history purpleair_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purpleair_history
    ADD CONSTRAINT purpleair_history_pkey PRIMARY KEY (purpleair_id, "time");


--
-- TOC entry 3715 (class 2620 OID 16856)
-- Name: purpleair_history on_purpleair_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_purpleair_insert AFTER INSERT ON public.purpleair_history FOR EACH ROW EXECUTE FUNCTION public.clear_old_purpleair_data();


--
-- TOC entry 3714 (class 2606 OID 16733)
-- Name: arcgis_layer arcgis_layer_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arcgis_layer
    ADD CONSTRAINT arcgis_layer_fk FOREIGN KEY (layer_id) REFERENCES public.map_layer(layer_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3713 (class 2606 OID 16738)
-- Name: geojson_layer geojson_layer_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geojson_layer
    ADD CONSTRAINT geojson_layer_fk FOREIGN KEY (layer_id) REFERENCES public.map_layer(layer_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2021-04-21 01:03:42 EDT

--
-- PostgreSQL database dump complete
--

