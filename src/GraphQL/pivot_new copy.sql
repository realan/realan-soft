CREATE
OR REPLACE VIEW "public"."pivot" AS WITH week_begin AS (
  SELECT
    date_trunc('week' :: text, now()) AS this,
    date_trunc('week' :: text, (now() + '7 days' :: interval)) AS next
),



item_collect AS (
  SELECT
    i.id,
    i.item_id,
    i.qty,
    i.order_id,
    o.id,
    o.is_shipped,
    o.date_out
  FROM
    (
      items i
      LEFT JOIN orders o ON ((i.order_id = o.id))
    )
  WHERE
    (o.is_shipped = false)
),





item_move_to AS (
  SELECT
    m.id,
    m.item_id,
    m.qty,
    m.from_order,
    m.to_order,
    o.id,
    o.is_shipped,
    o.date_out
  FROM
    (
      moving m
      LEFT JOIN orders o ON ((m.to_order = o.id))
    )
  WHERE
    (o.is_shipped = false)
),



item_move_from AS (
  SELECT
    m.id,
    m.item_id,
    m.qty,
    m.from_order,
    m.to_order,
    o.id,
    o.is_shipped,
    o.date_out
  FROM
    (
      moving m
      LEFT JOIN orders o ON ((m.from_order = o.id))
    )
  WHERE
    (o.is_shipped = false)
)



SELECT
  p.id AS item_id,
  p.art AS item_art,
  p.name AS item_name,
  (
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
    ) - (
      SELECT
        COALESCE(sum(moving.qty), (0) :: bigint) AS "coalesce"
      FROM
        moving
      WHERE
        (
          (moving.from_order = 3)
          AND (p.id = moving.item_id)
        )
    )
  ) AS stock_now,


  (
    SELECT
      COALESCE(sum(item_collect.qty), (0) :: bigint) AS "coalesce"
    FROM
      item_collect item_collect(
        id,
        item,
        qty,
        order_id,
        is_shipped,
        date_out
      )
    WHERE
      (
        (p.id = item_collect.item)
        AND (item_collect.date_out > week_begin.this)
        AND (item_collect.date_out < week_begin.next)
      )
  ) AS order_this_week,


  (
    (
      SELECT
        COALESCE(sum(item_move_to.qty), (0) :: bigint) AS "coalesce"
      FROM
        item_move_to item_move_to(
            id,
            item,
            qty,
            order_id,
            is_shipped,
            date_out
        )
      WHERE
        (
          (p.id = item_move_to.item)
          AND (item_move_to.date_out > week_begin.this)
          AND (item_move_to.date_out < week_begin.next)
        )
    ) - (
      SELECT
        COALESCE(sum(item_move_from.qty), (0) :: bigint) AS "coalesce"
      FROM
        item_move_from item_move_from(
            id,
            item,
            qty,
            order_id,
            is_shipped,
            date_out
        )
      WHERE
        (
          (p.id = item_move_from.item)
          AND (item_move_from.date_out > week_begin.this)
          AND (item_move_from.date_out < week_begin.next)
        )
    )
  ) AS collected_this_week,


  (
    SELECT
      COALESCE(sum(item_collect.qty), (0) :: bigint) AS "coalesce"
    FROM
      item_collect item_collect(
        id,
        item,
        qty,
        order_id,
        is_shipped,
        date_out
      )
    WHERE
      (
        (p.id = item_collect.item)
        AND (item_collect.date_out > week_begin.next)
        AND (
          item_collect.date_out < (week_begin.next + '7 days' :: interval)
        )
      )
  ) AS order_next_week,




  (
    (
      SELECT
        COALESCE(sum(item_move_to.qty), (0) :: bigint) AS "coalesce"
      FROM
        item_move_to item_move_to(
            id,
            item,
            qty,
            order_id,
            is_shipped,
            date_out
        )
      WHERE
        (
          (p.id = item_move_to.item)
          AND (item_move_to.date_out > week_begin.next)
          AND (
            item_move_to.date_out < (week_begin.next + '7 days' :: interval)
          )
        )
    ) - (
      SELECT
        COALESCE(sum(item_move_from.qty), (0) :: bigint) AS "coalesce"
      FROM
        item_move_from item_move_from(
            id,
            item,
            qty,
            order_id,
            is_shipped,
            date_out
        )
      WHERE
        (
          (p.id = item_move_from.item)
          AND (item_move_from.date_out > week_begin.next)
          AND (
            item_move_from.date_out < (week_begin.next + '7 days' :: interval)
          )
        )
    )
  ) AS collected_next_week,




  (
    SELECT
      COALESCE(sum(item_collect.qty), (0) :: bigint) AS "coalesce"
    FROM
      item_collect item_collect(
        id,
        item,
        qty,
        order_id,
        is_shipped,
        date_out
      )
    WHERE
      (
        (p.id = item_collect.item)
        AND (
          item_collect.date_out > (week_begin.next + '7 days' :: interval)
        )
      )
  ) AS order_next


  
FROM
  week_begin,
  price p;