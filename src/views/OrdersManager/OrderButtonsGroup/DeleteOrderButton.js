import React, { useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { gql } from "apollo-boost";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
// import { ADD_MOVES_ITEMS } from "../../../GraphQL/Mutations";
// import { DELETE_ITEM_FROM_ORDER } from "../../../GraphQL/Mutations";
// import { SET_ORDER_CANCELLED } from "../../../GraphQL/Mutations";
// import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
// import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

export const CANCEL_ORDER = gql`
  mutation CancelOrder($itemsToStock: [moving_insert_input!]!, $orderId: Int!) {
    insert_moving(objects: $itemsToStock) {
      affected_rows
      returning {
        id
        qty
        to_order
        from_order
        item_id
      }
    }
    update_orders(where: { id: { _eq: $orderId } }, _set: { is_cancelled: true }) {
      affected_rows
      returning {
        id
      }
    }
    delete_items(where: { order_id: { _eq: $orderId } }) {
      affected_rows
    }
  }
`;

const QUERY_ORDER_ITEMS = gql`
  query OrderItems($order_id: Int!) {
    items(order_by: { price: { name: asc } }, where: { order_id: { _eq: $order_id } }) {
      id
      item_id
      qty
      note
      price {
        id
        name
        qty_to: movings_aggregate(where: { to_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
        qty_from: movings_aggregate(where: { from_order: { _eq: $order_id } }) {
          aggregate {
            sum {
              qty
            }
          }
        }
      }
    }
  }
`;

const DeleteOrderButton = ({ params }) => {
  const order_id = params.row.id;
  // console.log(order_id);
  const [
    GetOrderItems,
    { loading: loadingItems, error: errorItems, data: dataItems },
  ] = useLazyQuery(QUERY_ORDER_ITEMS, {
    variables: { order_id: order_id },
  });

  const [CancelOrderMutation] = useMutation(CANCEL_ORDER);

  useEffect(() => {
    if (dataItems) {
      alert("Удаляю заказ, набранные позиции перевожу на склад");

      const collectedItems = [];
      console.log(dataItems);
      dataItems.items.forEach((it) => {
        let collected = {};
        let qtyCollected = it.price.qty_to.aggregate.sum.qty - it.price.qty_from.aggregate.sum.qty;

        if (qtyCollected !== 0) {
          collected = {
            qty: qtyCollected,
            to_order: 3, // у склада ID = 3 - типа постоянное значение заказа !!!!!!!!
            from_order: order_id,
            item_id: it.item_id,
          };
          collectedItems.push(collected);
        }
      });

      console.log("collectedItems", collectedItems);
      // if (collectedItems.length > 0) {
      CancelOrderMutation({ variables: { itemsToStock: collectedItems, orderId: order_id } });
      // }
    }
  }, [dataItems]);

  if (loadingItems) return "Loading....";
  if (errorItems) return `Error! ${errorItems.message}`;

  const handleClick = () => {
    GetOrderItems(order_id);
  };

  // console.log("render ButtonDeleteOrder")

  // const [DeteteItemMutation] = useMutation(DELETE_ITEM_FROM_ORDER);
  // const [AddMoveItemMutation] = useMutation(ADD_MOVE_ITEM);
  // const [SetOrderCancelledMutation] = useMutation(SET_ORDER_CANCELLED);

  // const handleDeleteOrder = () => {
  //   // deleting items in order and move items from order to stock
  //   items.map((item) => {
  //     onePosDelete(item);
  //     return true;
  //   });
  //   SetOrderCancelledMutation({ variables: { id: orderId } });
  //   onClick();
  // };

  // const onePosDelete = (data) => {
  //   DeteteItemMutation({ variables: { id: data.idDb } });
  //   let qty = data.qtyCollect;
  //   if (qty !== 0) {
  //     const addData = {
  //       qty: qty,
  //       to_order: 3, // id = 3 - склад
  //       from_order: orderId,
  //       item: data.idItem,
  //     };
  //     AddMoveItemMutation({ variables: { addData: addData } });
  //   }
  // };

  return (
    <>
      <Tooltip title="Удаляю заказ. Что набрано - перемещаю на склад">
        <Fab
          color="secondary"
          aria-label="update"
          size="small"
          component="span"
          onClick={handleClick}
        >
          <DeleteForeverIcon />
        </Fab>
        {/* <Button onClick={handleDeleteOrder} color="secondary" variant="contained">
          Отменить заказ
        </Button> */}
      </Tooltip>
    </>
  );
};

export default DeleteOrderButton;
