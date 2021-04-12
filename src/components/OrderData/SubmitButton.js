import React from "react";
import { useEffect } from "react";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

const ADD_ORDER = gql`
  mutation AddOrder($addData: orders_insert_input!) {
    insert_orders(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($addData: orders_insert_input!) {
    insert_orders(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const ADD_ITEMS = gql`
  mutation AddItems($addData: items_insert_input!) {
    insert_items(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
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
  //   console.log("submitAddOrder");
  const classes = useStyles();
  const [AddOrder, { data, loading, error }] = useMutation(ADD_ORDER);
  const [AddItems] = useMutation(ADD_ITEMS);

  let type = "UPDATE";
  if (!orderData.order_id) {
    type = "ADD";
  }

  useEffect(() => {
    // console.log("additem");
    if (!loading && data) {
      console.log(orderData.items);
      let orderId = data.insert_orders.returning[0].id;
      orderData.items.forEach(function (item) {
        let obj = {
          order_id: orderId,
          note: item.note,
          item_id: item.item_id,
          qty: item.qty,
        };
        console.log(obj);
        AddItems({ variables: { addData: obj } });
      });
      nextStep();
    }
  }, [loading, data, orderData, AddItems]);

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
      const preparedData = {
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
        note_delivery: orderData.note_delivery,
        price_type_id: orderData.price_type_id,
        discount: orderData.discount,
        pay_till_date: orderData.pay_till_date,
        // payment_status: "не оплачен",
        sum: orderData.sum,
        weigth: orderData.orderParams.weigth,
        note_order: orderData.note_order,
        note_supplier: orderData.note_supplier,
      };
      console.log(preparedData);
      if (type === "ADD") {
        AddOrder({ variables: { addData: preparedData } });
      }
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit} className={classes.button}>
      Разместить заказ
    </Button>
  );
}
