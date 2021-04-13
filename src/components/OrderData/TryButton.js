import React from "react";
import { useEffect } from "react";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

const ADD_ORDER = gql`
  mutation AddOrder($addData: orders_insert_input!) {
    insert_orders_one(object: $addData) {
      id
    }
  }
`;

// mutation MyMutation {
//     insert_orders_one(object: {city: "", consignee_data: "", consignee_name: "", items: {data: [{item_id: 1, qty: 10}, {item_id: 2, qty: 8}]}, customer_id: 27, price_type_id: 1}) {
//       weigth
//     }
//   }

// const UPDATE_ORDER = gql`
//   mutation UpdateOrder($addData: orders_insert_input!) {
//     insert_orders(objects: [$addData]) {
//       affected_rows
//       returning {
//         id
//       }
//     }
//   }
// `;

// const ADD_ITEMS = gql`
//   mutation AddItems($addData: items_insert_input!) {
//     insert_items(objects: [$addData]) {
//       affected_rows
//       returning {
//         id
//       }
//     }
//   }
// `;

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

export default function TryButon() {
  //   console.log("submitAddOrder");
  const classes = useStyles();
  const [AddOrder, { data, loading, error }] = useMutation(ADD_ORDER);
  //   const [AddItems] = useMutation(ADD_ITEMS);

  //   let type = "UPDATE";
  //   if (!orderData.order_id) {
  //     type = "ADD";
  //   }

  //   useEffect(() => {
  //     // console.log("additem");
  //     if (!loading && data) {
  //       console.log(orderData.items);
  //       let orderId = data.insert_orders.returning[0].id;
  //       orderData.items.forEach(function (item) {
  //         let obj = {
  //           order_id: orderId,
  //           note: item.note,
  //           item_id: item.item_id,
  //           qty: item.qty,
  //         };
  //         console.log(obj);
  //         AddItems({ variables: { addData: obj } });
  //       });
  //       nextStep();
  //     }
  //   }, [loading, data, orderData, AddItems]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    const preparedData = {
      date_out: new Date(),
      customer_id: 27,
      // firm_id: orderData.firm_id,
      // person_id: orderData.person_id,
      // shop_id: orderData.shop_id,
      our_firm_id: 1,
      // delivery_id: orderData.delivery_id,
      // city: orderData.city,
      // packaging: orderData.packaging,
      // consignee_name: orderData.consignee_name,
      // consignee_phone: orderData.consignee_phone,
      // consignee_data: orderData.consignee_data,
      // note_delivery: orderData.note_delivery,
      price_type_id: 1,
      // discount: orderData.discount,
      // pay_till_date: orderData.pay_till_date,
      // // payment_status: "не оплачен",
      // sum: orderData.sum,
      // weigth: orderData.orderParams.weigth,
      // note_order: orderData.note_order,
      // note_supplier: orderData.note_supplier,
      items: {
        data: [
          { item_id: 1, qty: 10 },
          { item_id: 2, qty: 8 },
        ],
      },
    };
    console.log(preparedData);
    //   if (type === "ADD") {
    AddOrder({ variables: { addData: preparedData } });
    //   }
    // }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
      Разместить заказ
    </Button>
  );
}
