-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
AS $BODY$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$BODY$;

ALTER FUNCTION public.handle_new_user()
    OWNER TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_admin;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL,
    full_name text COLLATE pg_catalog."default" NOT NULL,
    avatar_url text COLLATE pg_catalog."default" NOT NULL,
    nickname text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to supabase_admin;

ALTER TABLE IF EXISTS public.users
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.users TO anon;

GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO service_role;

GRANT ALL ON TABLE public.users TO supabase_admin;
CREATE POLICY "Can update own user data."
    ON public.users
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = id));
CREATE POLICY "Can view own user data."
    ON public.users
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = id));