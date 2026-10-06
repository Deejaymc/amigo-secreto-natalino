CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.draw_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  giver_participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  receiver_participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (draw_id, giver_participant_id),
  UNIQUE (draw_id, receiver_participant_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.groups TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participants TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.draws TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.draw_assignments TO anon, authenticated;
GRANT ALL ON public.groups TO service_role;
GRANT ALL ON public.participants TO service_role;
GRANT ALL ON public.draws TO service_role;
GRANT ALL ON public.draw_assignments TO service_role;

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read groups" ON public.groups FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public insert groups" ON public.groups FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public update groups" ON public.groups FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public delete groups" ON public.groups FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "public read participants" ON public.participants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public insert participants" ON public.participants FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public update participants" ON public.participants FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public delete participants" ON public.participants FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "public read draws" ON public.draws FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public insert draws" ON public.draws FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public update draws" ON public.draws FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public delete draws" ON public.draws FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "public read draw_assignments" ON public.draw_assignments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public insert draw_assignments" ON public.draw_assignments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public update draw_assignments" ON public.draw_assignments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "public delete draw_assignments" ON public.draw_assignments FOR DELETE TO anon, authenticated USING (true);