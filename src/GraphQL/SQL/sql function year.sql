CREATE OR REPLACE FUNCTION public.year(register_row register)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
  SELECT (EXTRACT(YEAR FROM register_row.date)::int)
$function$