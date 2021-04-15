import React from "react";
// import { useEffect } from "react";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

// const ADD_ORDER = gql`
//   mutation AddOrder($addData: orders_insert_input!) {
//     insert_orders_one(object: $addData) {
//       id
//     }
//   }
// `;
const ADD_ORDER = gql`
  mutation AddOrder($addData: orders_insert_input!) {
    insert_orders_one(
      object: $addData
      on_conflict: {
        constraint: orders_pkey
        update_columns: [
          date_out
          customer_id
          firm_id
          person_id
          shop_id
          our_firm_id
          delivery_id
          city
          packaging
          consignee_name
          consignee_phone
          consignee_data
          delivery_note
          price_type_id
          discount
          pay_till_date
          sum
          weigth
          note_order
          note_supplier
        ]
      }
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function SubmitButon({ orderData, nextStep }) {
  const classes = useStyles();
  const [AddOrder, { data, loading, error }] = useMutation(ADD_ORDER);
  //   const [UpdateOrder, { loading:, error }] = useMutation(UPDATE_ORDER);

  let type = "UPDATE";
  if (!orderData.order_id) {
    type = "ADD";
  }

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    if (orderData.customer_id === undefined) {
      alert("Нужно выбрать заказчика");
      return false;
    } else if (orderData.items.length === 0) {
      alert("Нет позиций в заказе");
      return false;
    } else if (orderData.date_out === null) {
      alert("Нужно выбрать дату отгрузки");
      return false;
    } else {
      const items = orderData.items.map((it) => {
        const obj = {
          item_id: it.item_id,
          qty: it.qty,
          note: it.note,
        };
        return obj;
      });
      const preparedData = {
        id: orderData.order_id ? orderData.order_id : undefined,
        date_out: orderData.date_out,
        customer_id: orderData.customer_id,
        firm_id: orderData.firm_id,
        person_id: orderData.person_id,
        shop_id: orderData.shop_id,
        our_firm_id: orderData.our_firm_id,
        delivery_id: orderData.delivery_id,
        city: orderData.city,
        packaging: orderData.packaging,
        consignee_name: orderData.consignee_name,
        consignee_phone: orderData.consignee_phone,
        consignee_data: orderData.consignee_data,
        delivery_note: orderData.note_delivery,
        price_type_id: orderData.price_type_id,
        discount: orderData.discount,
        pay_till_date: orderData.pay_till_date,
        // payment_status: "не оплачен",
        sum: orderData.sum,
        weigth: orderData.orderParams.weigth,
        note_order: orderData.note_order,
        note_supplier: orderData.note_supplier,
        items: {
          data: items,
        },
      };
      console.log(preparedData);
      if (type === "ADD") {
        AddOrder({ variables: { addData: preparedData } });
      } else {
        // UpdateOrder({ variables: { addData: preparedData } });
      }
      nextStep();
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
      {type === "ADD" ? <>Разместить заказ</> : <>Изменить заказ</>}
    </Button>
  );
}
