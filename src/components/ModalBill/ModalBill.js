import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ADD_MOVE_ITEM } from "../../GraphQL/Mutations";
import { DELETE_ITEM_FROM_ORDER } from "../../GraphQL/Mutations";
import { SET_ORDER_CANCELLED } from "../../GraphQL/Mutations";
import Button from "@material-ui/core/Button";



const ModalBill = ({ isCreated, orderId }) => {
    // console.log("render ButtonDeleteOrder")

    const [DeteteItemMutation] = useMutation(DELETE_ITEM_FROM_ORDER);
    const [AddMoveItemMutation] = useMutation(ADD_MOVE_ITEM);

    return (
        <>

        </>
    )
}

export default ButtonDeleteOrder;