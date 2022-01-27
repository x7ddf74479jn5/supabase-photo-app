-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.comments
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    photo_id bigint NOT NULL,
    user_id uuid NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    is_edited boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT comments_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.comments
    OWNER to postgres;

ALTER TABLE IF EXISTS public.comments
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.comments TO anon;

GRANT ALL ON TABLE public.comments TO authenticated;

GRANT ALL ON TABLE public.comments TO postgres;

GRANT ALL ON TABLE public.comments TO service_role;

CREATE TABLE IF NOT EXISTS public.likes
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id uuid NOT NULL,
    photo_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT likes_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.likes
    OWNER to postgres;

ALTER TABLE IF EXISTS public.likes
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.likes TO anon;

GRANT ALL ON TABLE public.likes TO authenticated;

GRANT ALL ON TABLE public.likes TO postgres;

GRANT ALL ON TABLE public.likes TO service_role;

CREATE TABLE IF NOT EXISTS public.photos
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    url text COLLATE pg_catalog."default" NOT NULL,
    is_published boolean NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT photo_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.photos
    OWNER to postgres;

ALTER TABLE IF EXISTS public.photos
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.photos TO anon;

GRANT ALL ON TABLE public.photos TO authenticated;

GRANT ALL ON TABLE public.photos TO postgres;

GRANT ALL ON TABLE public.photos TO service_role;

ALTER TABLE IF EXISTS public.users
    ADD COLUMN created_at timestamp without time zone NOT NULL DEFAULT now();

ALTER TABLE IF EXISTS public.users
    ADD COLUMN updated_at timestamp without time zone DEFAULT now();

ALTER TABLE IF EXISTS public.comments
    ADD CONSTRAINT comments_photo_id_fkey FOREIGN KEY (photo_id)
        REFERENCES public.photos (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.likes
    ADD CONSTRAINT likes_photo_id_fkey FOREIGN KEY (photo_id)
        REFERENCES public.photos (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.likes
    ADD CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.photos
    ADD CONSTRAINT photos_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE 
    ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE 
    ON public.photos
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION extensions.moddatetime('updated_at');

CREATE POLICY "Everyone can view anyone's comments. "
    ON public.comments
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Individuals can create comments."
    ON public.comments
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Individuals can delete their own comments."
    ON public.comments
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY "Individuals can update their own comments."
    ON public.comments
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = user_id));

CREATE POLICY "Everyone can view anyone's likes."
    ON public.likes
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Individuals can create likes."
    ON public.likes
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.uid() = user_id));

CREATE POLICY "Everyone can view anyone's photos. "
    ON public.photos
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING (true);
CREATE POLICY "Individuals can create photos."
    ON public.photos
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Individuals can delete their own photos."
    ON public.photos
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY "Individuals can update their own photos."
    ON public.photos
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = user_id));