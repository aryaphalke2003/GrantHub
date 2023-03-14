-- Table: public.access

-- DROP TABLE IF EXISTS public.access;
-- SCHEMA: public

-- DROP SCHEMA IF EXISTS public ;

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION grants;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO grants;


CREATE TABLE IF NOT EXISTS public.access
(
    email text COLLATE pg_catalog."default" NOT NULL,
    project_id integer NOT NULL,
    role role_type NOT NULL,
    CONSTRAINT access_pk PRIMARY KEY (email, project_id),
    CONSTRAINT access_account_email_fk FOREIGN KEY (email)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT access_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.access
    OWNER to grants;

-- Table: public.account

-- DROP TABLE IF EXISTS public.account;

CREATE TABLE IF NOT EXISTS public.account
(
    email text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    dept text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    last_active time without time zone DEFAULT now(),
    has_left boolean NOT NULL DEFAULT false,
    CONSTRAINT account_pk PRIMARY KEY (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.account
    OWNER to grants;

-- Trigger: validate_access_email_trigger

-- DROP TRIGGER IF EXISTS validate_access_email_trigger ON public.account;

CREATE TRIGGER validate_access_email_trigger
    BEFORE INSERT OR UPDATE OF email
    ON public.account
    FOR EACH STATEMENT
    EXECUTE FUNCTION public.validate_access_email();

    -- Table: public.account_activity_log

-- DROP TABLE IF EXISTS public.account_activity_log;

CREATE TABLE IF NOT EXISTS public.account_activity_log
(
    log_id integer NOT NULL DEFAULT nextval('account_activity_log_log_id_seq'::regclass),
    actor text COLLATE pg_catalog."default" NOT NULL,
    synopsis text COLLATE pg_catalog."default" NOT NULL,
    date timestamp with time zone NOT NULL,
    account text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT account_activity_log_pk PRIMARY KEY (log_id),
    CONSTRAINT account_activity_log_account_email_fk FOREIGN KEY (actor)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT account_activity_log_account_email_fk_2 FOREIGN KEY (account)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.account_activity_log
    OWNER to grants;

-- Table: public.account_project_activity_log

-- DROP TABLE IF EXISTS public.account_project_activity_log;

CREATE TABLE IF NOT EXISTS public.account_project_activity_log
(
    log_id integer NOT NULL DEFAULT nextval('account_project_activity_log_log_id_seq'::regclass),
    actor text COLLATE pg_catalog."default" NOT NULL,
    synopsis text COLLATE pg_catalog."default" NOT NULL,
    date timestamp with time zone NOT NULL,
    project_id integer NOT NULL,
    account text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT account_project_activity_log_pk PRIMARY KEY (log_id),
    CONSTRAINT account_project_activity_log_account_email_fk FOREIGN KEY (actor)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT account_project_activity_log_account_email_fk_2 FOREIGN KEY (account)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT account_project_activity_log_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.account_project_activity_log
    OWNER to grants;

    -- Table: public.budget

-- DROP TABLE IF EXISTS public.budget;

CREATE TABLE IF NOT EXISTS public.budget
(
    expense_id integer NOT NULL,
    equipment numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    consumable numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    contingency numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    manpower numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    overhead numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    consultancy_amount numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    others numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    travel numeric(14,2) NOT NULL DEFAULT '-1'::integer,
    CONSTRAINT budget_pk PRIMARY KEY (expense_id),
    CONSTRAINT budget_expense_expense_id_fk FOREIGN KEY (expense_id)
        REFERENCES public.expense (expense_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT positive_consultancy_amount CHECK (consultancy_amount >= 0::numeric),
    CONSTRAINT positive_consumable CHECK (consumable >= 0::numeric),
    CONSTRAINT positive_contingency CHECK (contingency >= 0::numeric),
    CONSTRAINT positive_equipment CHECK (equipment >= 0::numeric),
    CONSTRAINT positive_manpower CHECK (manpower >= 0::numeric),
    CONSTRAINT positive_others CHECK (others >= 0::numeric),
    CONSTRAINT positive_overhead CHECK (overhead >= 0::numeric),
    CONSTRAINT positive_travel CHECK (travel >= 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.budget
    OWNER to grants;

-- Trigger: update_expense_budget_total

-- DROP TRIGGER IF EXISTS update_expense_budget_total ON public.budget;

CREATE TRIGGER update_expense_budget_total
    AFTER INSERT OR UPDATE 
    ON public.budget
    FOR EACH ROW
    EXECUTE FUNCTION public.update_expense_budget_total();


    -- Table: public.expense

-- DROP TABLE IF EXISTS public.expense;

CREATE TABLE IF NOT EXISTS public.expense
(
    expense_id integer NOT NULL DEFAULT nextval('expense_expense_id_seq'::regclass),
    project_id integer NOT NULL,
    particulars text COLLATE pg_catalog."default" NOT NULL,
    voucher_no text COLLATE pg_catalog."default",
    date date,
    amount numeric(14,2) NOT NULL,
    head head_type NOT NULL,
    remarks text COLLATE pg_catalog."default",
    CONSTRAINT expense_pk PRIMARY KEY (expense_id),
    CONSTRAINT expense_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT nonzero_amount CHECK (amount <> 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.expense
    OWNER to grants;
-- Index: expense_project_id_index

-- DROP INDEX IF EXISTS public.expense_project_id_index;

CREATE INDEX IF NOT EXISTS expense_project_id_index
    ON public.expense USING btree
    (project_id ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: validate_expense_date_trigger

-- DROP TRIGGER IF EXISTS validate_expense_date_trigger ON public.expense;

CREATE TRIGGER validate_expense_date_trigger
    AFTER INSERT OR UPDATE OF date
    ON public.expense
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_expense_date();

-- Trigger: validate_expense_head_project_type

-- DROP TRIGGER IF EXISTS validate_expense_head_project_type ON public.expense;

CREATE TRIGGER validate_expense_head_project_type
    BEFORE INSERT OR UPDATE OF head
    ON public.expense
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_expense_head_project_type();

    -- Table: public.fellow

-- DROP TABLE IF EXISTS public.fellow;

CREATE TABLE IF NOT EXISTS public.fellow
(
    fellow_id integer NOT NULL DEFAULT nextval('fellow_fellow_id_seq'::regclass),
    type fellow_type NOT NULL,
    monthly_salary numeric(14,2) NOT NULL,
    hostel boolean NOT NULL,
    hra numeric,
    name text COLLATE pg_catalog."default" NOT NULL,
    project_id integer,
    from_date date NOT NULL,
    to_date date,
    CONSTRAINT fellow_pk PRIMARY KEY (fellow_id),
    CONSTRAINT fellow_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.fellow
    OWNER to grants;

-- Trigger: validate_fellow_hostel_hra

-- DROP TRIGGER IF EXISTS validate_fellow_hostel_hra ON public.fellow;

CREATE TRIGGER validate_fellow_hostel_hra
    BEFORE INSERT OR UPDATE OF hostel, hra
    ON public.fellow
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_fellow_hostel_hra();

    -- Table: public.fellow_salaries

-- DROP TABLE IF EXISTS public.fellow_salaries;

CREATE TABLE IF NOT EXISTS public.fellow_salaries
(
    fellow_id integer NOT NULL,
    expense_id integer NOT NULL,
    CONSTRAINT fellow_salaries_pk PRIMARY KEY (fellow_id, expense_id),
    CONSTRAINT fellow_salaries_expense_expense_id_fk FOREIGN KEY (expense_id)
        REFERENCES public.expense (expense_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT fellow_salaries_fellow_fellow_id_fk FOREIGN KEY (fellow_id)
        REFERENCES public.fellow (fellow_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.fellow_salaries
    OWNER to grants;

    -- Table: public.new_budget

-- DROP TABLE IF EXISTS public.new_budget;

CREATE TABLE IF NOT EXISTS public.new_budget
(
    expense_id integer NOT NULL,
    recurring numeric(14,2) NOT NULL,
    nonrecurring numeric(14,2) NOT NULL,
    split json,
    CONSTRAINT new_budget_pk PRIMARY KEY (expense_id),
    CONSTRAINT new_budget_expense_expense_id_fk FOREIGN KEY (expense_id)
        REFERENCES public.expense (expense_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.new_budget
    OWNER to grants;
    -- Table: public.pending_expense

-- DROP TABLE IF EXISTS public.pending_expense;

CREATE TABLE IF NOT EXISTS public.pending_expense
(
    pending_id integer NOT NULL DEFAULT nextval('pending_expense_pending_id_seq'::regclass),
    project_id integer,
    particulars text COLLATE pg_catalog."default" NOT NULL,
    voucher_no text COLLATE pg_catalog."default",
    date date,
    amount numeric(14,2) NOT NULL,
    head head_type NOT NULL,
    remarks text COLLATE pg_catalog."default",
    issuer text COLLATE pg_catalog."default" NOT NULL,
    status status_type NOT NULL DEFAULT 'pending'::status_type,
    issue_date date NOT NULL DEFAULT now(),
    CONSTRAINT pending_expense_pk PRIMARY KEY (pending_id),
    CONSTRAINT pending_expense_account_email_fk FOREIGN KEY (issuer)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT pending_expense_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pending_expense
    OWNER to grants;
-- Index: pending_expense_issuer_index

-- DROP INDEX IF EXISTS public.pending_expense_issuer_index;

CREATE INDEX IF NOT EXISTS pending_expense_issuer_index
    ON public.pending_expense USING btree
    (issuer COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: pending_expense_project_id_index

-- DROP INDEX IF EXISTS public.pending_expense_project_id_index;

CREATE INDEX IF NOT EXISTS pending_expense_project_id_index
    ON public.pending_expense USING btree
    (project_id ASC NULLS LAST)
    TABLESPACE pg_default;


    -- Table: public.pending_project

-- DROP TABLE IF EXISTS public.pending_project;

CREATE TABLE IF NOT EXISTS public.pending_project
(
    pending_id integer NOT NULL DEFAULT nextval('pending_project_pending_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    from_date date NOT NULL,
    organization text COLLATE pg_catalog."default" NOT NULL,
    total_cost numeric(14,2) NOT NULL,
    remarks text COLLATE pg_catalog."default",
    type project_type NOT NULL,
    issuer_email text COLLATE pg_catalog."default" NOT NULL,
    status status_type NOT NULL DEFAULT 'pending'::status_type,
    issue_date date NOT NULL DEFAULT now(),
    split jsonb NOT NULL,
    pi text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT pending_project_pk PRIMARY KEY (pending_id),
    CONSTRAINT pending_project_account_email_fk FOREIGN KEY (issuer_email)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT pending_project_account_email_fk_2 FOREIGN KEY (pi)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.pending_project
    OWNER to grants;
-- Index: pending_project_issuer_email_index

-- DROP INDEX IF EXISTS public.pending_project_issuer_email_index;

CREATE INDEX IF NOT EXISTS pending_project_issuer_email_index
    ON public.pending_project USING btree
    (issuer_email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

    -- Table: public.project

-- DROP TABLE IF EXISTS public.project;

CREATE TABLE IF NOT EXISTS public.project
(
    project_id integer NOT NULL DEFAULT nextval('project_project_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    from_date date NOT NULL,
    to_date date,
    organization text COLLATE pg_catalog."default" NOT NULL,
    total_cost numeric(14,2) NOT NULL,
    remarks text COLLATE pg_catalog."default",
    type project_type NOT NULL,
    CONSTRAINT project_pk PRIMARY KEY (project_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project
    OWNER to grants;
-- Index: project_name_uindex

-- DROP INDEX IF EXISTS public.project_name_uindex;

CREATE UNIQUE INDEX IF NOT EXISTS project_name_uindex
    ON public.project USING btree
    (name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;


    -- Table: public.project_activity_log

-- DROP TABLE IF EXISTS public.project_activity_log;

CREATE TABLE IF NOT EXISTS public.project_activity_log
(
    log_id integer NOT NULL DEFAULT nextval('project_activity_log_log_id_seq'::regclass),
    project_id integer NOT NULL,
    synopsis text COLLATE pg_catalog."default" NOT NULL,
    actor text COLLATE pg_catalog."default" NOT NULL,
    date timestamp with time zone NOT NULL,
    CONSTRAINT project_activity_log_pk PRIMARY KEY (log_id),
    CONSTRAINT project_activity_log_account_email_fk FOREIGN KEY (actor)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT project_activity_log_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_activity_log
    OWNER to grants;

    -- Table: public.project_heads

-- DROP TABLE IF EXISTS public.project_heads;

CREATE TABLE IF NOT EXISTS public.project_heads
(
    project_id integer NOT NULL,
    heads text[] COLLATE pg_catalog."default",
    CONSTRAINT project_heads_pk PRIMARY KEY (project_id),
    CONSTRAINT project_heads_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_heads
    OWNER to grants;

    -- Table: public.project_pin

-- DROP TABLE IF EXISTS public.project_pin;

CREATE TABLE IF NOT EXISTS public.project_pin
(
    pin_id integer NOT NULL DEFAULT nextval('project_pin_pin_id_seq'::regclass),
    email text COLLATE pg_catalog."default",
    project_id integer,
    CONSTRAINT project_pin_pk PRIMARY KEY (pin_id),
    CONSTRAINT project_pin_account_email_fk FOREIGN KEY (email)
        REFERENCES public.account (email) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
    CONSTRAINT project_pin_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_pin
    OWNER to grantspublic.project_pin;
-- Index: project_pin_email_index

-- DROP INDEX IF EXISTS public.project_pin_email_index;

CREATE INDEX IF NOT EXISTS project_pin_email_index
    ON public.project_pin USING btree
    (email COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;

    -- Table: public.project_sanction

-- DROP TABLE IF EXISTS public.project_sanction;

CREATE TABLE IF NOT EXISTS public.project_sanction
(
    project_id integer NOT NULL,
    equipment numeric(14,2) NOT NULL,
    consumable numeric(14,2) NOT NULL,
    contingency numeric(14,2) NOT NULL,
    manpower numeric(14,2) NOT NULL,
    overhead numeric(14,2) NOT NULL,
    consultancy_amount numeric(14,2) NOT NULL,
    others numeric(14,2) NOT NULL,
    travel numeric(14,2) NOT NULL,
    CONSTRAINT project_sanction_pk PRIMARY KEY (project_id),
    CONSTRAINT project_sanction_project_project_id_fk FOREIGN KEY (project_id)
        REFERENCES public.project (project_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT positive_consultancy_amount CHECK (consultancy_amount >= 0::numeric),
    CONSTRAINT positive_consumable CHECK (consumable >= 0::numeric),
    CONSTRAINT positive_contingency CHECK (contingency >= 0::numeric),
    CONSTRAINT positive_equipment CHECK (equipment >= 0::numeric),
    CONSTRAINT positive_manpower CHECK (manpower >= 0::numeric),
    CONSTRAINT positive_other CHECK (others >= 0::numeric),
    CONSTRAINT positive_overhead CHECK (overhead >= 0::numeric),
    CONSTRAINT positive_travel CHECK (travel >= 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.project_sanction
    OWNER to grants;

-- Trigger: update_project_sanction_total

-- DROP TRIGGER IF EXISTS update_project_sanction_total ON public.project_sanction;

CREATE TRIGGER update_project_sanction_total
    AFTER INSERT OR UPDATE 
    ON public.project_sanction
    FOR EACH ROW
    EXECUTE FUNCTION public.update_project_sanction_total();


    -- SEQUENCE: public.account_activity_log_log_id_seq

-- DROP SEQUENCE IF EXISTS public.account_activity_log_log_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.account_activity_log_log_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY account_activity_log.log_id;

ALTER SEQUENCE public.account_activity_log_log_id_seq
    OWNER TO grants;


    -- SEQUENCE: public.account_project_activity_log_log_id_seq

-- DROP SEQUENCE IF EXISTS public.account_project_activity_log_log_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.account_project_activity_log_log_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY account_project_activity_log.log_id;

ALTER SEQUENCE public.account_project_activity_log_log_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.expense_expense_id_seq

-- DROP SEQUENCE IF EXISTS public.expense_expense_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.expense_expense_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY expense.expense_id;

ALTER SEQUENCE public.expense_expense_id_seq
    OWNER TO grants;


    -- SEQUENCE: public.fellow_fellow_id_seq

-- DROP SEQUENCE IF EXISTS public.fellow_fellow_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.fellow_fellow_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY fellow.fellow_id;

ALTER SEQUENCE public.fellow_fellow_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.pending_expense_pending_id_seq

-- DROP SEQUENCE IF EXISTS public.pending_expense_pending_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.pending_expense_pending_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY pending_expense.pending_id;

ALTER SEQUENCE public.pending_expense_pending_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.pending_project_pending_id_seq

-- DROP SEQUENCE IF EXISTS public.pending_project_pending_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.pending_project_pending_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY pending_project.pending_id;

ALTER SEQUENCE public.pending_project_pending_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.project_activity_log_log_id_seq

-- DROP SEQUENCE IF EXISTS public.project_activity_log_log_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.project_activity_log_log_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY project_activity_log.log_id;

ALTER SEQUENCE public.project_activity_log_log_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.project_pin_pin_id_seq

-- DROP SEQUENCE IF EXISTS public.project_pin_pin_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.project_pin_pin_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY project_pin.pin_id;

ALTER SEQUENCE public.project_pin_pin_id_seq
    OWNER TO grants;

    -- SEQUENCE: public.project_project_id_seq

-- DROP SEQUENCE IF EXISTS public.project_project_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.project_project_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY project.project_id;

ALTER SEQUENCE public.project_project_id_seq
    OWNER TO grants;


    -- FUNCTION: public.update_expense_budget_total()

-- DROP FUNCTION IF EXISTS public.update_expense_budget_total();

CREATE OR REPLACE FUNCTION public.update_expense_budget_total()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    UPDATE expense
    SET amount = -(NEW.equipment + NEW.consumable + NEW.travel + NEW.contingency + NEW.manpower + NEW.overhead +
                 NEW.consultancy_amount + NEW.others)
    WHERE expense_id = NEW.expense_id;
    RETURN NULL;
END;
$BODY$;

ALTER FUNCTION public.update_expense_budget_total()
    OWNER TO grants;


-- FUNCTION: public.update_project_sanction_total()

-- DROP FUNCTION IF EXISTS public.update_project_sanction_total();

CREATE OR REPLACE FUNCTION public.update_project_sanction_total()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    UPDATE project SET total_cost = (NEW.equipment + NEW.consumable + NEW.travel + NEW.contingency + NEW.manpower + NEW.overhead +
                 NEW.consultancy_amount + NEW.others) WHERE project_id = NEW.project_id;
    RETURN NULL;
END;
$BODY$;

ALTER FUNCTION public.update_project_sanction_total()
    OWNER TO grants;
-- FUNCTION: public.validate_access_email()

-- DROP FUNCTION IF EXISTS public.validate_access_email();

CREATE OR REPLACE FUNCTION public.validate_access_email()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    user_type text;
BEGIN
    SELECT type FROM account WHERE email = NEW.email INTO user_type;
    IF user_type = 'admin'
        THEN
            RAISE EXCEPTION 'Admin does not need to be granted permissions to project';
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.validate_access_email()
    OWNER TO grants;
-- FUNCTION: public.validate_cannot_modify_expense_id()

-- DROP FUNCTION IF EXISTS public.validate_cannot_modify_expense_id();

CREATE OR REPLACE FUNCTION public.validate_cannot_modify_expense_id()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    RAISE EXCEPTION 'Cannot modify expense_id';
END;
$BODY$;

ALTER FUNCTION public.validate_cannot_modify_expense_id()
    OWNER TO grants;
-- FUNCTION: public.validate_expense_date()

-- DROP FUNCTION IF EXISTS public.validate_expense_date();

CREATE OR REPLACE FUNCTION public.validate_expense_date()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    project_start date;
    project_end   date;
BEGIN
    IF NEW.date IS NULL
        THEN
            IF OLD IS NULL OR (OLD IS NOT NULL AND OLD.date IS NULL)
                THEN
                    RETURN NEW;
            END IF;
            IF OLD IS NOT NULL
                THEN
                    RAISE EXCEPTION 'Cannot set non-NULL date to NULL';
            END IF;
    END IF;

    SELECT from_date, to_date
    FROM project
    WHERE project_id = NEW.project_id
    INTO project_start, project_end;

--     RAISE EXCEPTION '%, %', NEW.date, project_start;

    IF NEW.date < project_start OR (project_end IS NOT NULL AND NEW.date > project_end)
        THEN
            RAISE EXCEPTION 'Invalid expense date %: Must be within range of project dates % - %', NEW.date, project_start, project_end;
    END IF;

    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.validate_expense_date()
    OWNER TO grants;
-- FUNCTION: public.validate_expense_head_project_type()

-- DROP FUNCTION IF EXISTS public.validate_expense_head_project_type();

CREATE OR REPLACE FUNCTION public.validate_expense_head_project_type()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF EXISTS(SELECT * FROM project WHERE project_id = NEW.project_id AND type = 'sponsored project') AND
       NEW.head = 'consultancy_amount'
        THEN
            RAISE EXCEPTION 'Sponsored project cannot have consulting amount head';
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.validate_expense_head_project_type()
    OWNER TO grants;
-- FUNCTION: public.validate_fellow_hostel_hra()

-- DROP FUNCTION IF EXISTS public.validate_fellow_hostel_hra();

CREATE OR REPLACE FUNCTION public.validate_fellow_hostel_hra()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    IF NEW.hostel THEN
        NEW.hra = NULL;
    ELSE
        NEW.hra = 0::numeric;
    END IF;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.validate_fellow_hostel_hra()
    OWNER TO grants;
-- Type: fellow_type

-- DROP TYPE IF EXISTS public.fellow_type;

CREATE TYPE public.fellow_type AS ENUM
    ('jrf', 'srf', 'ra', 'other');

ALTER TYPE public.fellow_type
    OWNER TO grants;
-- Type: head_type

-- DROP TYPE IF EXISTS public.head_type;

CREATE TYPE public.head_type AS ENUM
    ('equipment', 'consumable', 'contingency', 'manpower', 'overhead', 'consultancy_amount', 'others', 'grant', 'travel');

ALTER TYPE public.head_type
    OWNER TO grants;
-- Type: project_type

-- DROP TYPE IF EXISTS public.project_type;

CREATE TYPE public.project_type AS ENUM
    ('sponsored project', 'consulting');

ALTER TYPE public.project_type
    OWNER TO grants;
-- Type: role_type

-- DROP TYPE IF EXISTS public.role_type;

CREATE TYPE public.role_type AS ENUM
    ('PI', 'Co-PI');

ALTER TYPE public.role_type
    OWNER TO grants;
-- Type: status_type

-- DROP TYPE IF EXISTS public.status_type;

CREATE TYPE public.status_type AS ENUM
    ('pending', 'accepted', 'rejected');

ALTER TYPE public.status_type
    OWNER TO grants;
-- View: public.ui_access

-- DROP VIEW public.ui_access;

CREATE OR REPLACE VIEW public.ui_access
 AS
 SELECT a.email,
    a.role,
    a.project_id,
    c.name,
    c.dept
   FROM access a
     JOIN account c ON a.email = c.email;

ALTER TABLE public.ui_access
    OWNER TO grants;

-- View: public.ui_expenses

-- DROP VIEW public.ui_expenses;

CREATE OR REPLACE VIEW public.ui_expenses
 AS
 SELECT expense.expense_id,
    expense.project_id,
    expense.particulars,
    expense.voucher_no,
    expense.date,
        CASE
            WHEN expense.amount < 0::numeric THEN - expense.amount
            ELSE 0::numeric
        END AS receipt,
        CASE
            WHEN expense.amount > 0::numeric THEN expense.amount
            ELSE 0::numeric
        END AS payment,
    expense.head,
    expense.remarks,
    sum(- expense.amount) OVER (PARTITION BY expense.project_id ORDER BY expense.date) AS balance
   FROM expense;

ALTER TABLE public.ui_expenses
    OWNER TO grants;

-- View: public.ui_fellows

-- DROP VIEW public.ui_fellows;

CREATE OR REPLACE VIEW public.ui_fellows
 AS
 SELECT f.fellow_id,
    f.name,
    f.type,
    f.monthly_salary,
    f.hostel,
    f.hra,
    f.name AS fellow_name,
    f.from_date,
    f.to_date,
    f.project_id,
    p.name AS project,
    e.expense_id AS last_salary_id,
    e.date AS last_salary_date
   FROM fellow f
     LEFT JOIN project p ON f.project_id = p.project_id
     LEFT JOIN ( SELECT fellow_salaries.fellow_id,
            max(fellow_salaries.expense_id) AS last_expense_id
           FROM fellow_salaries
          GROUP BY fellow_salaries.fellow_id) s ON s.fellow_id = f.fellow_id
     LEFT JOIN expense e ON s.last_expense_id = e.expense_id;

ALTER TABLE public.ui_fellows
    OWNER TO grants;

-- View: public.ui_pending_expenses

-- DROP VIEW public.ui_pending_expenses;

CREATE OR REPLACE VIEW public.ui_pending_expenses
 AS
 SELECT p.name,
    pe.pending_id,
    pe.project_id,
    pe.particulars,
    pe.voucher_no,
    pe.date,
    pe.amount,
    pe.head,
    pe.remarks,
    pe.issuer,
    pe.status,
    pe.issue_date
   FROM pending_expense pe
     LEFT JOIN project p ON pe.project_id = p.project_id;

ALTER TABLE public.ui_pending_expenses
    OWNER TO grants;

-- View: public.ui_projects

-- DROP VIEW public.ui_projects;

CREATE OR REPLACE VIEW public.ui_projects
 AS
 SELECT p.project_id,
    p.name,
    p.from_date,
    p.to_date,
    p.organization,
    p.total_cost,
    p.type,
    p.remarks,
    COALESCE(ex.expenditure, 0::numeric) AS expenditure,
    COALESCE(re.received, 0::numeric) AS received,
    pi.email AS pi_email
   FROM project p
     LEFT JOIN ( SELECT e.project_id,
            COALESCE(sum(e.amount), 0::numeric) AS expenditure
           FROM expense e
          WHERE e.amount > 0::numeric
          GROUP BY e.project_id) ex ON ex.project_id = p.project_id
     LEFT JOIN ( SELECT e2.project_id,
            COALESCE(sum(- e2.amount), 0::numeric) AS received
           FROM expense e2
          WHERE e2.amount < 0::numeric
          GROUP BY e2.project_id) re ON re.project_id = p.project_id
     LEFT JOIN ( SELECT a.email,
            a.project_id,
            a.role
           FROM access a
             JOIN account c ON a.email = c.email
          WHERE a.role = 'PI'::role_type) pi ON pi.project_id = p.project_id;

ALTER TABLE public.ui_projects
    OWNER TO grants;

-- PROCEDURE: public.add_account(text, text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.add_account(text, text, text, text, text);

CREATE OR REPLACE PROCEDURE public.add_account(
	_actor text,
	_email text,
	_type text,
	_dept text,
	_name text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _new_jsonb jsonb;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Only admins can add users';
    END IF;
    
    INSERT INTO account VALUES (_email, _type, _dept, _name, DEFAULT);
    SELECT json_agg(a.*) FROM account a WHERE a.email = _email INTO _new_jsonb;
    
    INSERT INTO account_activity_log
    VALUES (DEFAULT, _actor, format('Added user %L', _email), now(), _email);
END;
$BODY$;

ALTER PROCEDURE public.add_account(text, text, text, text, text)
    OWNER TO grants;
-- PROCEDURE: public.add_expense(text, integer, text, date, numeric, head_type, text, text)

-- DROP PROCEDURE IF EXISTS public.add_expense(text, integer, text, date, numeric, head_type, text, text);

CREATE OR REPLACE PROCEDURE public.add_expense(
	_actor text,
	_project_id integer,
	_particulars text,
	_date date,
	_amount numeric,
	_head head_type,
	_voucher_no text,
	_remarks text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _eid   int;
    _pname text;
BEGIN
    IF EXISTS(SELECT * FROM project WHERE project_id = _project_id AND type = 'sponsored project'::project_type) AND
       _head = 'consultancy_amount'::head_type
        THEN
            RAISE EXCEPTION 'consultancy_amount is an invalid head for sponsored projects';
    END IF;
    IF has_access(_actor, _project_id)
        THEN
            SELECT name FROM project WHERE project_id = _project_id INTO _pname;
            IF is_admin(_actor)
                THEN
                    INSERT INTO expense
                    VALUES (DEFAULT, _project_id, _particulars, _voucher_no, _date, _amount, _head, _remarks)
                    RETURNING expense_id INTO _eid;

                    INSERT INTO project_activity_log
                    VALUES (DEFAULT, _project_id,
                            format('Added expense %L to project [%L] %L', _particulars, _project_id, _pname), _actor,
                            now());
                ELSE
                    INSERT INTO pending_expense
                    VALUES (DEFAULT, _project_id, _particulars, _voucher_no, _date, _amount, _head, _remarks, _actor,
                            'pending');
                    INSERT INTO project_activity_log
                    VALUES (DEFAULT, _project_id,
                            format('Added pending expense %L for project [%L] %L', _particulars, _project_id, _pname),
                            _actor,
                            now());
            END IF;
    END IF;

END;
$BODY$;

ALTER PROCEDURE public.add_expense(text, integer, text, date, numeric, head_type, text, text)
    OWNER TO grants;
-- PROCEDURE: public.add_fellow(text, text, integer, fellow_type, numeric, boolean, numeric, date, date)

-- DROP PROCEDURE IF EXISTS public.add_fellow(text, text, integer, fellow_type, numeric, boolean, numeric, date, date);

CREATE OR REPLACE PROCEDURE public.add_fellow(
	_actor text,
	_name text,
	_project_id integer,
	_type fellow_type,
	_salary numeric,
	_hostel boolean,
	_hra numeric,
	_from_date date,
	_to_date date)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    INSERT INTO fellow
    VALUES (DEFAULT, _type, _salary, _hostel, _hra, _name, _project_id, _from_date, _to_date);

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;

    INSERT INTO project_activity_log
    VALUES (DEFAULT, _project_id, format('Added fellow %L to project [%L] %L', _name, _project_id, _pname), _actor,
            now());
END;
$BODY$;

ALTER PROCEDURE public.add_fellow(text, text, integer, fellow_type, numeric, boolean, numeric, date, date)
    OWNER TO grants;
-- PROCEDURE: public.add_head_type(text, integer, text)

-- DROP PROCEDURE IF EXISTS public.add_head_type(text, integer, text);

CREATE OR REPLACE PROCEDURE public.add_head_type(
	_actor text,
	_project_id integer,
	_type text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF NOT is_admin(_actor) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;
    UPDATE project_heads SET heads = array_append(heads, _type) WHERE project_id = _project_id;
END;
$BODY$;

ALTER PROCEDURE public.add_head_type(text, integer, text)
    OWNER TO grants;
-- PROCEDURE: public.add_installment(text, integer, text, text, date, json, text)

-- DROP PROCEDURE IF EXISTS public.add_installment(text, integer, text, text, date, json, text);

CREATE OR REPLACE PROCEDURE public.add_installment(
	_actor text,
	_project_id integer,
	_particulars text,
	_voucher text,
	_date date,
	_split json,
	_remarks text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _tot_val numeric(14, 2);
    _exp_id  int;
    _pname   text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    IF EXISTS(SELECT * FROM project WHERE project_id = _project_id AND type = 'sponsored project'::project_type) AND
       (_split ->> 'consultancy_amount')::numeric <> 0::numeric
        THEN
            RAISE WARNING 'Nonzero consultancy_amount in sponsored project: will be zeroed';
            _split := jsonb_set(_split::jsonb, '{consultancy_amount}', '0')::json;
    END IF;

    SELECT SUM(value::numeric(14, 2)) FROM json_each_text(_split) INTO _tot_val;

    INSERT INTO expense
    VALUES (DEFAULT, _project_id, _particulars, _voucher, _date, -_tot_val, 'grant', _remarks)
    RETURNING expense_id INTO _exp_id;

    INSERT INTO budget
    VALUES (_exp_id, coalesce((_split ->> 'equipment')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'consumable')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'contingency')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'manpower')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'overhead')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'consultancy_amount')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'others')::numeric(14, 2), 0::numeric),
            coalesce((_split ->> 'travel')::numeric(14, 2), 0::numeric));

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;
    
    INSERT INTO project_activity_log
    VALUES (DEFAULT, _project_id, format('Added installment %L to project [%L] %L', _particulars, _project_id, _pname),
            _actor, now());
END ;
$BODY$;

ALTER PROCEDURE public.add_installment(text, integer, text, text, date, json, text)
    OWNER TO grants;
-- PROCEDURE: public.add_installment_new(text, integer, numeric, numeric)

-- DROP PROCEDURE IF EXISTS public.add_installment_new(text, integer, numeric, numeric);

CREATE OR REPLACE PROCEDURE public.add_installment_new(
	_actor text,
	_expense_id integer,
	_recurring numeric,
	_nonrecurring numeric)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF NOT is_admin(_actor) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;
    INSERT INTO new_budget VALUES (_expense_id, _recurring, _nonrecurring, '{}'::json);
END;
$BODY$;

ALTER PROCEDURE public.add_installment_new(text, integer, numeric, numeric)
    OWNER TO grants;
-- PROCEDURE: public.add_project(text, text, date, text, jsonb, text, project_type, text)

-- DROP PROCEDURE IF EXISTS public.add_project(text, text, date, text, jsonb, text, project_type, text);

CREATE OR REPLACE PROCEDURE public.add_project(
	_actor text,
	_name text,
	_from date,
	_org text,
	_split jsonb,
	_remarks text,
	_type project_type,
	_pi text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pid     int;
    _tot_val numeric;
BEGIN
    SELECT SUM(value::numeric(14, 2)) FROM jsonb_each_text(_split) INTO _tot_val;
    IF is_admin(_actor)
        THEN

            INSERT INTO project
            VALUES (DEFAULT, _name, _from, NULL, _org, _tot_val, _remarks, _type)
            RETURNING project_id INTO _pid;
            INSERT INTO project_sanction
            VALUES (_pid, coalesce((_split ->> 'equipment')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'consumable')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'contingency')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'manpower')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'overhead')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'consultancy_amount')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'others')::numeric(14, 2), 0::numeric),
                    coalesce((_split ->> 'travel')::numeric(14, 2), 0::numeric));

            INSERT INTO project_activity_log
            VALUES (DEFAULT, _pid, format('Added project [%L] %L', _pid, _name), _actor, now());

            CALL give_account_access(_actor, _pi, _pid, 'PI'::role_type);
        ELSE
            INSERT INTO pending_project
            VALUES (DEFAULT, _name, _from, _org, _tot_val, _remarks, _type, _actor, DEFAULT, DEFAULT, _split, _pi);

            INSERT INTO account_activity_log
            VALUES (DEFAULT, _actor, format('Added pending project %L', _name), now(), _pi);
    END IF;
END;
$BODY$;

ALTER PROCEDURE public.add_project(text, text, date, text, jsonb, text, project_type, text)
    OWNER TO grants;
-- PROCEDURE: public.alter_access(text, text, integer, role_type)

-- DROP PROCEDURE IF EXISTS public.alter_access(text, text, integer, role_type);

CREATE OR REPLACE PROCEDURE public.alter_access(
	_actor text,
	_email text,
	_project_id integer,
	_role role_type)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pname     text;
    _otheruser text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    IF _role = 'Co-PI' AND NOT exists(SELECT * FROM access WHERE project_id = _project_id AND email <> _email)
        THEN
            RAISE EXCEPTION 'Require at least one PI';
    END IF;
    IF _role = 'Co-PI'
        THEN
            SELECT email FROM access WHERE project_id = _project_id AND email <> _email LIMIT 1 INTO _otheruser;

            UPDATE access
            SET role = 'PI'
            WHERE email = _otheruser
              AND project_id = _project_id;

            UPDATE access
            SET role = _role
            WHERE email = _email
              AND project_id = _project_id;
    END IF;
    IF _role = 'PI'
        THEN
            SELECT email FROM access WHERE project_id = _project_id AND role = 'PI' LIMIT 1 INTO _otheruser;

            UPDATE access
            SET role = 'Co-PI'
            WHERE email = _otheruser
              AND project_id = _project_id;

            UPDATE access
            SET role = _role
            WHERE email = _email
              AND project_id = _project_id;
    END IF;

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;
    INSERT INTO account_project_activity_log
    VALUES (DEFAULT, _actor, format('Altered access of user %L to project [%L] %L', _email, _project_id, _pname), now(),
            _project_id, _otheruser);
    INSERT INTO account_project_activity_log
    VALUES (DEFAULT, _actor, format('Altered access of user %L to project [%L] %L', _email, _project_id, _pname), now(),
            _project_id, _email);

END;
$BODY$;

ALTER PROCEDURE public.alter_access(text, text, integer, role_type)
    OWNER TO grants;
-- PROCEDURE: public.alter_account(text, text, text, text, text, text)

-- DROP PROCEDURE IF EXISTS public.alter_account(text, text, text, text, text, text);

CREATE OR REPLACE PROCEDURE public.alter_account(
	_actor text,
	_name text,
	_old_email text,
	_email text,
	_type text,
	_dept text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE account
    SET name  = _name,
        email = _email,
        type  = _type,
        dept  = _dept
    WHERE email = _old_email;

    INSERT INTO account_activity_log
    VALUES (DEFAULT, _actor, format('Updated user data for %L', _email), now(), _email);
END;
$BODY$;

ALTER PROCEDURE public.alter_account(text, text, text, text, text, text)
    OWNER TO grants;
-- PROCEDURE: public.alter_expense(text, integer, text, text, date, numeric, head_type, text)

-- DROP PROCEDURE IF EXISTS public.alter_expense(text, integer, text, text, date, numeric, head_type, text);

CREATE OR REPLACE PROCEDURE public.alter_expense(
	_actor text,
	_eid integer,
	_particulars text,
	_voucher text,
	_date date,
	_amount numeric,
	_head head_type,
	_remarks text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _old_amount numeric(14, 2);
    _pid        int;
    _pname      text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT amount
    FROM expense
    WHERE expense_id = _eid
    INTO _old_amount;

    IF _old_amount <> _amount AND (_old_amount < 0 OR _amount < 0)
        THEN
            RAISE EXCEPTION 'Cannot alter payments directly: modify budget instead';
    END IF;

    IF _amount = 0
        THEN
            RAISE EXCEPTION 'Amount must be non-zero';
    END IF;

    UPDATE expense
    SET particulars = _particulars,
        voucher_no  = _voucher,
        date        = _date,
        amount      = _amount,
        head        = _head,
        remarks     = _remarks
    WHERE expense_id = _eid;

    SELECT project_id FROM expense WHERE expense_id = _eid INTO _pid;
    SELECT name FROM project WHERE project_id = _pid INTO _pname;

    INSERT INTO project_activity_log
    VALUES (DEFAULT, _pid, format('Altered expense %L in project [%L] %L', _particulars, _pid, _pname), _actor, now());
END;
$BODY$;

ALTER PROCEDURE public.alter_expense(text, integer, text, text, date, numeric, head_type, text)
    OWNER TO grants;
-- PROCEDURE: public.alter_fellow(text, integer, fellow_type, numeric, boolean, numeric, text, date, date)

-- DROP PROCEDURE IF EXISTS public.alter_fellow(text, integer, fellow_type, numeric, boolean, numeric, text, date, date);

CREATE OR REPLACE PROCEDURE public.alter_fellow(
	_actor text,
	_fellow_id integer,
	_type fellow_type,
	_salary numeric,
	_hostel boolean,
	_hra numeric,
	_name text,
	_from_date date,
	_to_date date)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pid int; _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    UPDATE fellow
    SET type           = _type,
        monthly_salary = _salary,
        hostel         = _hostel,
        hra            = _hra,
        name           = _name,
        from_date      = _from_date,
        to_date        = _to_date
    WHERE fellow_id = _fellow_id;

    SELECT project_id FROM fellow WHERE fellow_id = _fellow_id INTO _pid;
    SELECT name FROM project WHERE project_id = _pid INTO _pname;

    INSERT INTO project_activity_log
    VALUES (DEFAULT, _pid, format('Altered details of fellow %L in project [%L] %L', _name, _pid, _pname), _actor,
            now());
END;
$BODY$;

ALTER PROCEDURE public.alter_fellow(text, integer, fellow_type, numeric, boolean, numeric, text, date, date)
    OWNER TO grants;
-- PROCEDURE: public.alter_installment(text, integer, json)

-- DROP PROCEDURE IF EXISTS public.alter_installment(text, integer, json);

CREATE OR REPLACE PROCEDURE public.alter_installment(
	_actor text,
	_eid integer,
	_split json)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pid   int;
    _pname text;
    _iname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    DELETE FROM budget WHERE expense_id = _eid;

    INSERT INTO budget
    VALUES (_eid, coalesce((_split ->> 'equipment')::numeric, 0::numeric),
            coalesce((_split ->> 'consumables')::numeric, 0::numeric),
            coalesce((_split ->> 'contingency')::numeric, 0::numeric),
            coalesce((_split ->> 'manpower')::numeric, 0::numeric),
            coalesce((_split ->> 'overhead')::numeric, 0::numeric),
            coalesce((_split ->> 'consultancy_amount')::numeric, 0::numeric),
            coalesce((_split ->> 'others')::numeric, 0::numeric),
            coalesce((_split ->> 'travel')::numeric, 0::numeric));

    SELECT project_id, particulars FROM expense WHERE expense_id = _eid INTO _pid, _iname;
    SELECT name FROM project WHERE project_id = _pid INTO _pname;

    INSERT INTO project_activity_log
    VALUES (DEFAULT, _pid, format('Updated installment %L in project [%L] %L', _iname, _pid, _pname), _actor, now());
END;
$BODY$;

ALTER PROCEDURE public.alter_installment(text, integer, json)
    OWNER TO grants;
-- PROCEDURE: public.alter_installment_split_new(text, integer, text, numeric)

-- DROP PROCEDURE IF EXISTS public.alter_installment_split_new(text, integer, text, numeric);

CREATE OR REPLACE PROCEDURE public.alter_installment_split_new(
	_actor text,
	_expense_id integer,
	_head text,
	_value numeric)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE _old jsonb;
BEGIN
    IF NOT is_admin(_actor) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    SELECT split FROM new_budget WHERE expense_id = _expense_id INTO _old;
    _old := jsonb_set(_old::jsonb, format('{%L}', _head), _value)::json;
    UPDATE new_budget SET split = _old WHERE expense_id = _expense_id;
END;
$BODY$;

ALTER PROCEDURE public.alter_installment_split_new(text, integer, text, numeric)
    OWNER TO grants;
-- PROCEDURE: public.alter_project(text, integer, text, project_type, date, date, text, text, text)

-- DROP PROCEDURE IF EXISTS public.alter_project(text, integer, text, project_type, date, date, text, text, text);

CREATE OR REPLACE PROCEDURE public.alter_project(
	_actor text,
	_project_id integer,
	_name text,
	_type project_type,
	_from date,
	_to date,
	_org text,
	_remarks text,
	_pi_email text)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _old_name    text;
    _old_type    project_type;
    _old_from    date;
    _old_to      date;
    _old_org     text;
    _old_remarks text;
    _old_pi      text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;
    SELECT name, type, from_date, to_date, organization, remarks
    FROM project
    WHERE project_id = _project_id
    INTO _old_name, _old_type, _old_from, _old_to, _old_org, _old_remarks;

    IF _name <> _old_name OR _type <> _old_type OR _from <> _old_from OR
       ((_old_to IS NULL AND _to IS NOT NULL) OR (_to IS NULL AND _old_to IS NOT NULL) OR _to <> _old_to) OR
       _org <> _old_org OR
       ((_old_remarks IS NULL AND _remarks IS NOT NULL) OR (_remarks IS NULL AND _old_remarks IS NOT NULL) OR
        _remarks <> _old_remarks)
        THEN
            UPDATE project
            SET name         = _name,
                type         = _type,
                from_date    = _from,
                to_date      = _to,
                organization = _org,
                remarks      = _remarks
            WHERE project_id = _project_id;

            INSERT INTO project_activity_log
            VALUES (DEFAULT, _project_id, format('Updated details for project [%L] %L', _project_id, _name), _actor,
                    now());
    END IF;

    SELECT email FROM access WHERE project_id = _project_id AND role = 'PI'::role_type INTO _old_pi;

    IF _pi_email <> _old_pi
        THEN
            UPDATE access SET role = 'Co-PI'::role_type WHERE email = _old_pi AND project_id = _project_id;
            IF exists(SELECT * FROM access WHERE project_id = _project_id AND email = _pi_email)
                THEN
                    UPDATE access SET role = 'PI'::role_type WHERE email = _pi_email AND project_id = _project_id;
                ELSE
                    INSERT INTO access VALUES (_pi_email, _project_id, 'PI'::role_type);
            END IF;

            INSERT INTO account_project_activity_log
            VALUES (DEFAULT, _actor, format('Updated PI of project [%L] %L to %L', _project_id, _name, _pi_email),
                    now(), _project_id, _pi_email);
    END IF;
END;
$BODY$;

ALTER PROCEDURE public.alter_project(text, integer, text, project_type, date, date, text, text, text)
    OWNER TO grants;
-- PROCEDURE: public.alter_project_sanction(text, integer, head_type, numeric)

-- DROP PROCEDURE IF EXISTS public.alter_project_sanction(text, integer, head_type, numeric);

CREATE OR REPLACE PROCEDURE public.alter_project_sanction(
	_actor text,
	_project_id integer,
	_head head_type,
	_amount numeric)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    EXECUTE format('UPDATE project_sanction SET %I = $1 WHERE project_id = $2', _head) USING _amount, _project_id;

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;
    INSERT INTO project_activity_log
    VALUES (DEFAULT, _project_id, format('Updated sanction for project [%L] %L', _project_id, _pname), _actor, now());
END;
$BODY$;

ALTER PROCEDURE public.alter_project_sanction(text, integer, head_type, numeric)
    OWNER TO grants;
-- PROCEDURE: public.alter_project_sanction(text, integer, jsonb)

-- DROP PROCEDURE IF EXISTS public.alter_project_sanction(text, integer, jsonb);

CREATE OR REPLACE PROCEDURE public.alter_project_sanction(
	_actor text,
	_project_id integer,
	_split jsonb)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    IF EXISTS(SELECT * FROM project WHERE project_id = _project_id AND type = 'sponsored project') AND
       (_split ->> 'consultancy_amount')::numeric <> 0::numeric
        THEN
            RAISE WARNING 'Consultancy amount will be zeroed out';
            _split := jsonb_set(_split, '{consultancy_amount}', 0::numeric);
    END IF;

    UPDATE project_sanction
    SET equipment          = (_split ->> 'equipment')::numeric(14, 2),
        consumable         = (_split ->> 'consumable')::numeric(14, 2),
        contingency        = (_split ->> 'contingency')::numeric(14, 2),
        manpower           = (_split ->> 'manpower')::numeric(14, 2),
        overhead           = (_split ->> 'overhead')::numeric(14, 2),
        consultancy_amount = (_split ->> 'consultancy_amount')::numeric(14, 2),
        others             = (_split ->> 'others')::numeric(14, 2),
        travel             = (_split ->> 'travel')::numeric(14, 2)
    WHERE project_id = _project_id;

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;
    INSERT INTO project_activity_log
    VALUES (DEFAULT, _project_id, format('Updated sanction for project [%L] %L', _project_id, _pname), _actor, now());
END;
$BODY$;

ALTER PROCEDURE public.alter_project_sanction(text, integer, jsonb)
    OWNER TO grants;
-- PROCEDURE: public.delete_access(text, text[], integer)

-- DROP PROCEDURE IF EXISTS public.delete_access(text, text[], integer);

CREATE OR REPLACE PROCEDURE public.delete_access(
	_actor text,
	_emails text[],
	_project_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _em text; _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    DELETE FROM access WHERE project_id = _project_id AND email = ANY (_emails);

    SELECT name FROM project WHERE project_id = _project_id INTO _pname;

    FOREACH _em IN ARRAY _emails
        LOOP
            INSERT INTO account_project_activity_log
            VALUES (DEFAULT, _actor, format('Removed access for %L to project [%L] %L', _em, _project_id, _pname),
                    now(), _project_id, _em);
        END LOOP;

END;
$BODY$;

ALTER PROCEDURE public.delete_access(text, text[], integer)
    OWNER TO grants;
-- PROCEDURE: public.delete_expenses(text, integer[])

-- DROP PROCEDURE IF EXISTS public.delete_expenses(text, integer[]);

CREATE OR REPLACE PROCEDURE public.delete_expenses(
	_actor text,
	_eids integer[])
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _eid int; _ename text; _pid int; _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    FOREACH _eid IN ARRAY _eids
        LOOP
            SELECT project_id, particulars FROM expense WHERE expense_id = _eid INTO _pid, _ename;
            SELECT name FROM project WHERE project_id = _pid INTO _pname;

            INSERT INTO project_activity_log
            VALUES (DEFAULT, _pid, format('Deleted expense %L from project [%L] %L', _ename, _pid, _pname), _actor,
                    now());
        END LOOP;
    
    DELETE FROM expense WHERE expense_id = ANY (_eids);
END ;
$BODY$;

ALTER PROCEDURE public.delete_expenses(text, integer[])
    OWNER TO grants;
-- PROCEDURE: public.delete_fellows(text, integer[])

-- DROP PROCEDURE IF EXISTS public.delete_fellows(text, integer[]);

CREATE OR REPLACE PROCEDURE public.delete_fellows(
	_actor text,
	_fellow_ids integer[])
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _fid int; _fname text; _pid int; _pname text;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    FOREACH _fid IN ARRAY _fellow_ids
        LOOP
            SELECT project_id, name FROM fellow WHERE fellow_id = _fid INTO _pid, _fname;
            SELECT name FROM project WHERE project_id = _pid INTO _pname;

            INSERT INTO project_activity_log
            VALUES (DEFAULT, _pid, format('Deleted fellow %L from project [%L] %L', _fname, _pid, _pname), _actor,
                    now());
        END LOOP;

    DELETE FROM fellow WHERE fellow_id = ANY (_fellow_ids);

END;
$BODY$;

ALTER PROCEDURE public.delete_fellows(text, integer[])
    OWNER TO grants;
-- PROCEDURE: public.delete_projects(text, integer[])

-- DROP PROCEDURE IF EXISTS public.delete_projects(text, integer[]);

CREATE OR REPLACE PROCEDURE public.delete_projects(
	_actor text,
	_project_ids integer[])
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    DELETE FROM project WHERE project_id = ANY(_project_ids);
END;
$BODY$;

ALTER PROCEDURE public.delete_projects(text, integer[])
    OWNER TO grants;
-- PROCEDURE: public.delete_users(text, text[])

-- DROP PROCEDURE IF EXISTS public.delete_users(text, text[]);

CREATE OR REPLACE PROCEDURE public.delete_users(
	_actor text,
	_emails text[])
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;

    DELETE FROM account WHERE email = ANY (_emails);

    IF NOT EXISTS(SELECT * FROM account WHERE type = 'admin')
        THEN
            RAISE EXCEPTION 'Cannot delete last admin';
    END IF;
END;
$BODY$;

ALTER PROCEDURE public.delete_users(text, text[])
    OWNER TO grants;
-- PROCEDURE: public.give_account_access(text, text, integer, role_type)

-- DROP PROCEDURE IF EXISTS public.give_account_access(text, text, integer, role_type);

CREATE OR REPLACE PROCEDURE public.give_account_access(
	_actor text,
	_email text,
	_project_id integer,
	_role role_type)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _new_name  text;
    _proj_name text;
BEGIN
    INSERT INTO access VALUES (_email, _project_id, _role);

    SELECT a.name FROM account a WHERE a.email = _email INTO _new_name;
    SELECT p.name FROM project p WHERE p.project_id = _project_id INTO _proj_name;

    INSERT INTO account_project_activity_log
    VALUES (DEFAULT, _actor, format('Gave %L access to project [%L] %L', _new_name, _project_id, _proj_name), now(),
            _project_id, _email);
END;
$BODY$;

ALTER PROCEDURE public.give_account_access(text, text, integer, role_type)
    OWNER TO grants;
-- PROCEDURE: public.resolve_pending_expense(text, integer, boolean)

-- DROP PROCEDURE IF EXISTS public.resolve_pending_expense(text, integer, boolean);

CREATE OR REPLACE PROCEDURE public.resolve_pending_expense(
	_actor text,
	_pending_id integer,
	_accept boolean)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _json json;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;
    
    IF EXISTS(SELECT *
              FROM pending_expense
              WHERE pending_id = _pending_id
                AND status <> 'pending')
        THEN
            RAISE EXCEPTION 'Expense Already Resolved';
    END IF;

    UPDATE pending_expense
    SET status = (CASE _accept WHEN TRUE THEN 'accepted' ELSE 'rejected' END)::status_type
    WHERE pending_id = _pending_id;

    SELECT row_to_json(x)
    FROM (SELECT project_id,
                 particulars,
                 voucher_no,
                 date,
                 amount,
                 head,
                 remarks
          FROM pending_expense
          WHERE pending_id = _pending_id) x
    INTO _json;

    IF _accept
        THEN
            CALL add_expense(_actor, (_json ->> 'project_id')::int,
                             _json ->> 'particulars', (_json ->> 'date')::date,
                             (_json ->> 'amount')::numeric, (_json ->> 'head')::head_type,
                             _json ->> 'voucher_no',
                             _json ->> 'remarks');
    END IF;
END;
$BODY$;

ALTER PROCEDURE public.resolve_pending_expense(text, integer, boolean)
    OWNER TO grants;
-- PROCEDURE: public.resolve_pending_project(text, integer, boolean)

-- DROP PROCEDURE IF EXISTS public.resolve_pending_project(text, integer, boolean);

CREATE OR REPLACE PROCEDURE public.resolve_pending_project(
	_actor text,
	_pending_id integer,
	_accept boolean)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    _json json;
BEGIN
    IF NOT is_admin(_actor)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;
    IF EXISTS(SELECT * FROM pending_project WHERE pending_id = _pending_id AND status <> 'pending')
        THEN
            RAISE EXCEPTION 'Project Already Resolved';
    END IF;

    UPDATE pending_project
    SET status = (CASE _accept WHEN TRUE THEN 'accepted' ELSE 'rejected' END)::status_type
    WHERE pending_id = _pending_id;

    SELECT row_to_json(x)
    FROM (SELECT name,
                 from_date,
                 organization,
                 total_cost,
                 remarks,
                 type,
                 issuer_email,
                 split,
                 pi
          FROM pending_project
          WHERE pending_id = _pending_id) x
    INTO _json;

    IF _accept
        THEN
            CALL add_project(_actor, _json ->> 'name', (_json ->> 'from_date')::date, _json ->> 'organization',
                             (_json -> 'split')::jsonb, _json ->> 'remarks', (_json ->> 'type')::project_type,
                             _json ->> 'pi');
    END IF;
END ;
$BODY$;

ALTER PROCEDURE public.resolve_pending_project(text, integer, boolean)
    OWNER TO grants;
-- PROCEDURE: public.toggle_pin(text, integer)

-- DROP PROCEDURE IF EXISTS public.toggle_pin(text, integer);

CREATE OR REPLACE PROCEDURE public.toggle_pin(
	_email text,
	_project_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    IF EXISTS(SELECT * FROM project_pin WHERE email = _email AND project_id = _project_id) THEN
        DELETE FROM project_pin WHERE email = _email AND project_id = _project_id;
    ELSE
        INSERT INTO project_pin VALUES (DEFAULT, _email, _project_id);
    END IF;
END;
$BODY$;

ALTER PROCEDURE public.toggle_pin(text, integer)
    OWNER TO grants;
-- PROCEDURE: public.update_last_active_time(text)

-- DROP PROCEDURE IF EXISTS public.update_last_active_time(text);

CREATE OR REPLACE PROCEDURE public.update_last_active_time(
	_actor text)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    UPDATE account SET last_active = now() WHERE email = _actor;
END;
$BODY$;

ALTER PROCEDURE public.update_last_active_time(text)
    OWNER TO grants;
-- FUNCTION: public.get_accounts(text)

-- DROP FUNCTION IF EXISTS public.get_accounts(text);

CREATE OR REPLACE FUNCTION public.get_accounts(
	_actor text)
    RETURNS TABLE(act account) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF NOT is_admin(_actor) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    RETURN QUERY SELECT * FROM account;
END;
$BODY$;

ALTER FUNCTION public.get_accounts(text)
    OWNER TO grants;
-- FUNCTION: public.get_active_faculty()

-- DROP FUNCTION IF EXISTS public.get_active_faculty();

CREATE OR REPLACE FUNCTION public.get_active_faculty(
	)
    RETURNS TABLE(name text, email text, dept text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY SELECT a.name, a.email, a.dept FROM account a WHERE a.type = 'faculty' AND NOT a.has_left;
END;
$BODY$;

ALTER FUNCTION public.get_active_faculty()
    OWNER TO grants;
-- FUNCTION: public.get_budget(text, integer)

-- DROP FUNCTION IF EXISTS public.get_budget(text, integer);

CREATE OR REPLACE FUNCTION public.get_budget(
	_email text,
	_project_id integer)
    RETURNS TABLE(expense_id integer, equipment numeric, consumable numeric, contingency numeric, manpower numeric, overhead numeric, consultancy_amount numeric, others numeric, travel numeric, installment_number integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF NOT has_access(_email, _project_id)
        THEN
            RAISE EXCEPTION 'You do not have permission to access data for this project';
    END IF;

    RETURN QUERY SELECT b.*, (row_number() OVER ())::int AS installment_number
                 FROM budget b
                          LEFT JOIN expense e ON b.expense_id = e.expense_id
                 WHERE e.project_id = _project_id
                 ORDER BY b.expense_id;
END;
$BODY$;

ALTER FUNCTION public.get_budget(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_head_expenditure(text, integer, head_type, boolean, boolean)

-- DROP FUNCTION IF EXISTS public.get_head_expenditure(text, integer, head_type, boolean, boolean);

CREATE OR REPLACE FUNCTION public.get_head_expenditure(
	_actor text,
	_project_id integer,
	_head head_type,
	_actual boolean,
	_committed boolean)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    _exp numeric;
BEGIN
    IF NOT has_access(_actor, _project_id)
        THEN
            RAISE EXCEPTION 'Access Denied';
    END IF;
    SELECT coalesce(sum(amount), 0.0)
    FROM expense
    WHERE project_id = _project_id
      AND head = _head
      AND ((_actual AND date IS NOT NULL) OR (_committed AND date IS NULL))
    INTO _exp;
    RETURN _exp;
END;
$BODY$;

ALTER FUNCTION public.get_head_expenditure(text, integer, head_type, boolean, boolean)
    OWNER TO grants;
-- FUNCTION: public.get_notifications(text)

-- DROP FUNCTION IF EXISTS public.get_notifications(text);

CREATE OR REPLACE FUNCTION public.get_notifications(
	_actor text)
    RETURNS TABLE(id text, synopsis text, date timestamp with time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF is_admin(_actor)
        THEN
            RETURN QUERY (SELECT 'p' || p.log_id, p.synopsis, p.date FROM project_activity_log p)
                         UNION
                         (SELECT 'a' || a.log_id, a.synopsis, a.date FROM account_activity_log a)
                         UNION
                         (SELECT 'x' || x.log_id, x.synopsis, x.date FROM account_project_activity_log x)
                         ORDER BY date DESC;
        ELSE
            RETURN QUERY (SELECT 'p' || p.log_id, p.synopsis, p.date
                          FROM project_activity_log p
                          WHERE has_access(_actor, project_id))
                         UNION
                         (SELECT 'a' || a.log_id, a.synopsis, a.date FROM account_activity_log a WHERE a.account = _actor)
                         UNION
                         (SELECT 'x' || x.log_id, x.synopsis, x.date
                          FROM account_project_activity_log x
                          WHERE has_access(_actor, x.project_id));
    END IF;
END;
$BODY$;

ALTER FUNCTION public.get_notifications(text)
    OWNER TO grants;
-- FUNCTION: public.get_pending_expenses(text)

-- DROP FUNCTION IF EXISTS public.get_pending_expenses(text);

CREATE OR REPLACE FUNCTION public.get_pending_expenses(
	_actor text)
    RETURNS TABLE(dat ui_pending_expenses) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF is_admin(_actor)
        THEN
            RETURN QUERY SELECT * FROM ui_pending_expenses ORDER BY issue_date DESC;
        ELSE
            RETURN QUERY SELECT * FROM ui_pending_expenses WHERE issuer = _actor ORDER BY issue_date DESC;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.get_pending_expenses(text)
    OWNER TO grants;
-- FUNCTION: public.get_pending_projects(text)

-- DROP FUNCTION IF EXISTS public.get_pending_projects(text);

CREATE OR REPLACE FUNCTION public.get_pending_projects(
	_actor text)
    RETURNS TABLE(proj pending_project) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF is_admin(_actor)
        THEN
            RETURN QUERY SELECT * FROM pending_project ORDER BY issue_date DESC;
        ELSE
            RETURN QUERY SELECT *
                         FROM pending_project
                         WHERE issuer_email = _actor
                         ORDER BY issue_date DESC;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.get_pending_projects(text)
    OWNER TO grants;
-- FUNCTION: public.get_project_by_name(text, text)

-- DROP FUNCTION IF EXISTS public.get_project_by_name(text, text);

CREATE OR REPLACE FUNCTION public.get_project_by_name(
	_actor text,
	_name text)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE _pid int;
BEGIN
    SELECT project_id FROM project WHERE name = _name INTO _pid;
    IF _pid IS NULL THEN
        RAISE EXCEPTION 'Cannot find';
    END IF;
    IF NOT has_access(_actor, _pid) THEN
        RAISE EXCEPTION 'Acces Denied';
    END IF;
    RETURN _pid;
END;
$BODY$;

ALTER FUNCTION public.get_project_by_name(text, text)
    OWNER TO grants;
-- FUNCTION: public.get_project_details(text, integer)

-- DROP FUNCTION IF EXISTS public.get_project_details(text, integer);

CREATE OR REPLACE FUNCTION public.get_project_details(
	_email text,
	_project_id integer)
    RETURNS TABLE(project_id integer, name text, from_date date, to_date date, organization text, total_cost numeric, type project_type, remarks text, expenditure numeric, received numeric, pi_email text, pi_name text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF NOT has_access(_email, _project_id)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;
    RETURN QUERY SELECT p.*, a.name AS pi_name
                 FROM ui_projects p
                          LEFT OUTER JOIN account a ON a.email = p.pi_email
                 WHERE p.project_id = _project_id;
END;
$BODY$;

ALTER FUNCTION public.get_project_details(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_project_sanction(text, integer)

-- DROP FUNCTION IF EXISTS public.get_project_sanction(text, integer);

CREATE OR REPLACE FUNCTION public.get_project_sanction(
	_actor text,
	_project_id integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    DECLARE _json json;
BEGIN
    IF NOT has_access(_actor, _project_id) THEN
        RAISE EXCEPTION 'Access Denied';
    END IF;

    SELECT json_agg(p) FROM project_sanction p WHERE p.project_id = _project_id INTO _json;

    RETURN _json->0;
END;
$BODY$;

ALTER FUNCTION public.get_project_sanction(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_remaining_budget(text, integer, boolean, boolean)

-- DROP FUNCTION IF EXISTS public.get_remaining_budget(text, integer, boolean, boolean);

CREATE OR REPLACE FUNCTION public.get_remaining_budget(
	_actor text,
	_project_id integer,
	_actual boolean,
	_committed boolean)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    ret json;
BEGIN
    IF NOT has_access(_actor, _project_id)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT jsonb_agg(t)
    FROM (SELECT coalesce(sum(b.equipment), 0) -
                 get_head_expenditure(_actor, _project_id, 'equipment', _actual, _committed)          AS equipment,
                 coalesce(sum(b.consumable), 0) -
                 get_head_expenditure(_actor, _project_id, 'consumable', _actual, _committed)         AS consumable,
                 coalesce(sum(b.travel), 0) -
                 get_head_expenditure(_actor, _project_id, 'travel', _actual, _committed)             AS travel,
                 coalesce(sum(b.contingency), 0) -
                 get_head_expenditure(_actor, _project_id, 'contingency', _actual, _committed)        AS contingency,
                 coalesce(sum(b.manpower), 0) -
                 get_head_expenditure(_actor, _project_id, 'manpower', _actual, _committed)           AS manpower,
                 coalesce(sum(b.overhead), 0) -
                 get_head_expenditure(_actor, _project_id, 'overhead', _actual, _committed)           AS overhead,
                 coalesce(sum(b.consultancy_amount), 0) -
                 get_head_expenditure(_actor, _project_id, 'consultancy_amount', _actual,
                                      _committed)                                                     AS consultancy_amount,
                 coalesce(sum(b.others), 0) -
                 get_head_expenditure(_actor, _project_id, 'others', _actual, _committed)             AS others
          FROM budget b
                   LEFT JOIN expense e ON b.expense_id = e.expense_id
          WHERE e.project_id = _project_id) t
    INTO ret;
    RETURN ret -> 0;
END;
$BODY$;

ALTER FUNCTION public.get_remaining_budget(text, integer, boolean, boolean)
    OWNER TO grants;
-- FUNCTION: public.get_ui_access(text, integer)

-- DROP FUNCTION IF EXISTS public.get_ui_access(text, integer);

CREATE OR REPLACE FUNCTION public.get_ui_access(
	_email text,
	_project_id integer)
    RETURNS TABLE(email text, role role_type, project_id integer, name text, dept text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF NOT has_access(_email, _project_id) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY SELECT * FROM ui_access a WHERE a.project_id = _project_id;
END;
$BODY$;

ALTER FUNCTION public.get_ui_access(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_ui_expenses(text, integer)

-- DROP FUNCTION IF EXISTS public.get_ui_expenses(text, integer);

CREATE OR REPLACE FUNCTION public.get_ui_expenses(
	_email text,
	_project_id integer)
    RETURNS TABLE(dat ui_expenses) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF NOT has_access(_email, _project_id) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY SELECT * FROM ui_expenses WHERE project_id = _project_id ORDER BY date DESC;
END;
$BODY$;

ALTER FUNCTION public.get_ui_expenses(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_ui_fellows(text, integer)

-- DROP FUNCTION IF EXISTS public.get_ui_fellows(text, integer);

CREATE OR REPLACE FUNCTION public.get_ui_fellows(
	_actor text,
	_project_id integer)
    RETURNS TABLE(fellow_id integer, name text, type fellow_type, monthly_salary numeric, hostel boolean, hra numeric, fellow_name text, from_date date, to_date date, project_id integer, project text, last_salary_id integer, last_salary_date date) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF _project_id IS NOT NULL AND NOT has_access(_actor, _project_id)
        THEN
            RAISE EXCEPTION 'Access denied';
    END IF;

    IF _project_id IS NULL
        THEN
            IF is_admin(_actor)
                THEN
                    RETURN QUERY SELECT *
                                 FROM ui_fellows;
                ELSE
                    RETURN QUERY SELECT f.*
                                 FROM ui_fellows f,
                                      access a
                                 WHERE f.project_id = a.project_id
                                   AND a.email = _actor;
            END IF;
        ELSE
            RETURN QUERY SELECT *
                         FROM ui_fellows f
                         WHERE f.project_id = _project_id;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.get_ui_fellows(text, integer)
    OWNER TO grants;
-- FUNCTION: public.get_ui_projects_with_pins(text)

-- DROP FUNCTION IF EXISTS public.get_ui_projects_with_pins(text);

CREATE OR REPLACE FUNCTION public.get_ui_projects_with_pins(
	_email text)
    RETURNS TABLE(project_id integer, name text, from_date date, to_date date, organization text, total_cost numeric, type project_type, remarks text, expenditure numeric, received numeric, pi_email text, pid integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    IF is_admin(_email)
        THEN
            RETURN QUERY SELECT p.*, pp.pin_id
                         FROM ui_projects p
                                  LEFT OUTER JOIN (SELECT * FROM project_pin px WHERE px.email = _email) pp
                                                  ON p.project_id = pp.project_id
                         ORDER BY pp.pin_id;
        ELSE
            RETURN QUERY SELECT p.*, pp.pin_id
                         FROM ui_projects p
                                  LEFT OUTER JOIN (SELECT * FROM project_pin px WHERE px.email = _email) pp
                                                  ON p.project_id = pp.project_id
                                  JOIN access a ON a.project_id = p.project_id
                         WHERE a.email = _email
                         ORDER BY pp.pin_id;

    END IF;
END;
$BODY$;

ALTER FUNCTION public.get_ui_projects_with_pins(text)
    OWNER TO grants;
-- FUNCTION: public.has_access(text, integer)

-- DROP FUNCTION IF EXISTS public.has_access(text, integer);

CREATE OR REPLACE FUNCTION public.has_access(
	_email text,
	_project_id integer)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    RETURN is_admin(_email) OR EXISTS(SELECT *
                                                  FROM access
                                                  WHERE email = _email
                                                    AND project_id = _project_id);
END;
$BODY$;

ALTER FUNCTION public.has_access(text, integer)
    OWNER TO grants;
-- FUNCTION: public.has_pending_project_access(text, integer)

-- DROP FUNCTION IF EXISTS public.has_pending_project_access(text, integer);

CREATE OR REPLACE FUNCTION public.has_pending_project_access(
	_actor text,
	_pending_id integer)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
    BEGIN
        RETURN is_admin(_actor) OR exists(SELECT *
                                          FROM pending_project
                                          WHERE pending_id = _pending_id
                                            AND issuer_email = _actor);

    END;
$BODY$;

ALTER FUNCTION public.has_pending_project_access(text, integer)
    OWNER TO grants;
-- FUNCTION: public.is_admin(text)

-- DROP FUNCTION IF EXISTS public.is_admin(text);

CREATE OR REPLACE FUNCTION public.is_admin(
	_email text)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    RETURN EXISTS(SELECT * FROM account WHERE email = _email AND type = 'admin');
END;
$BODY$;

ALTER FUNCTION public.is_admin(text)
    OWNER TO grants;





















