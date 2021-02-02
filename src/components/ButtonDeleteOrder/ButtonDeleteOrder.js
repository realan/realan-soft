import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useMutation } from "@apollo/react-hooks";
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { DELETE_ITEM_FROM_ORDER } from "../../GraphQL/Mutations";
import { SET_ORDER_CANCELLED } from "../../GraphQL/Mutations";
import Button from "@material-ui/core/Button";

const ButtonDeleteOrder = ({ items, orderId, onClick }) => {
    // console.log("render ButtonDeleteOrder")

    const [DeteteItemMutation] = useMutation(DELETE_ITEM_FROM_ORDER);
    const [AddMoveItemMutation] = useMutation(ADD_MOVE_ITEM);
    const [SetOrderCancelledMutation] = useMutation(SET_ORDER_CANCELLED);

    const handleDeleteOrder = () => {
        // deleting items in order and move items from order to stock
        items.map((item) => {
          onePosDelete(item);
          return true;
        });
        SetOrderCancelledMutation({ variables: { id: orderId } });
        onClick();
      };

    const onePosDelete = (data) => {
        DeteteItemMutation({ variables: { id: data.idDb } });
        let qty = data.qtyCollect;
        if (qty !== 0) {
          const addData = {
            qty: qty,
            to_order: 3, // id = 3 - склад
            from_order: orderId,
            item: data.idItem,
          };
          AddMoveItemMutation({ variables: { addData: addData } });
        }
      };

    return (
        <>
            <Tooltip title="Удаляю заказ. Что набрано - перемещаю на склад">
              <Button onClick={handleDeleteOrder} color="secondary" variant="contained">
                Отменить заказ
              </Button>
            </Tooltip>
        </>
    )
}

export default ButtonDeleteOrder;