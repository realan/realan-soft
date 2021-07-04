CREATE
OR REPLACE VIEW "public"."stock_now" AS
SELECT
  p.id AS item_id,
  p.art AS item_art,
  p.name AS item_name,
  (
    SELECT
      COALESCE(sum(moving.qty), (0) :: bigint) AS "coalesce"
    FROM
      moving
    WHERE
      (
        (moving.to_order = 3)
        AND (p.id = moving.item_id)
      )
  ) AS into_stock,
  (
    SELECT
      COALESCE(sum(moving.qty), (0) :: bigint) AS "coalesce"
    FROM
      moving
    WHERE
      (
        (moving.from_order = 3)
        AND (p.id = moving.item_id)
      )
  ) AS out_stock
FROM
  price p;