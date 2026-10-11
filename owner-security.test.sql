-- Run transactionally through the database query tool; rollback leaves no test records.
BEGIN;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000000","role":"authenticated","email":"gabrielouleal@gmail.com"}', true);
DO $$ BEGIN
  IF public.is_store_owner() OR public.claim_store_owner() OR public.is_store_admin() THEN
    RAISE EXCEPTION 'An unverified claimed email must not gain owner/admin privileges';
  END IF;
  BEGIN
    INSERT INTO public.products(id,name,brand) VALUES ('security-test-denied','Security test','Security test');
    RAISE EXCEPTION 'Unauthorized catalog write succeeded';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;
ROLLBACK;