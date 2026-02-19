
-- Migration to add a helper function for executing raw SQL via RPC
-- This should be used sparingly and only for administrative tasks

CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE sql_query;
END;
$$;
