import React from "react";
import { useState, useEffect, useCallback } from "react";
import OrderData from "components/OrderData/OrderData";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const GET_ORDER_DATA = gql`
  query GetOrderData($order_id: Int!) {
    orders(where: { id: { _eq: $order_id } }) {
      id
      customer_id
      firm_id
      shop_id
      person_id
      our_firm_id
      note_order
      pay_till_date
      packaging
      date_out
      sum
      weigth
      discount
      price_type_id
      bill_id
      invoice_id
      city
      consignee_data
      consignee_name
      consignee_phone
      delivery_id
      customer {
        id
        name
        firms {
          id
          name
          inn
          kpp
          okpo
          ogrn
          contracts {
            our_firm_id
          }
        }
        shops {
          id
          name
          city
          address
          consignee_name
          consignee_phone
          consignee_data
          delivery_id
          delivery_note
        }
        persons {
          id
          full_name
          name
          surname
          phone
          email
          shop_id
          firm_id
        }
        saldo
        price_type_id
      }
      items {
        id
        item_id
        qty
        note
        price {
          art
          name
          price_dealer
          price_opt
          price_retail
          weight
        }
      }
    }
  }
`;

export default function UpdateOrder({ open, onClose, orderId }) {
  console.log("render UpdateOrder");
  const [orderData, setOrderData] = useState({});

  const { loading, error, data } = useQuery(GET_ORDER_DATA, { variables: { order_id: orderId } });

  useEffect(() => {
    if (data) {
      console.log(data);
      setOrderData(data.orders[0]);
      const dateOut = new Date(data.orders[0].date_out);
      onOrderDataChange("date_out", dateOut);
      const items = data.orders[0].items.map((it) => {
        return {
          id: it.id,
          item_id: it.item_id,
          qty: it.qty,
          note: it.note,
          art: it.price.art,
          name: it.price.name,
          price_dealer: it.price.price_dealer,
          price_opt: it.price.price_opt,
          price_retail: it.price.price_retail,
          weight: it.price.weight,
        };
      });
      onOrderDataChange("items", items);
    }
  }, [data]);

  const onOrderDataChange = useCallback(
    (type, value) => {
      console.log(orderData);
      setOrderData((prevState) => ({ ...prevState, [type]: value }));
    },
    [orderData]
  );

  if (loading) return <p>Loading order...</p>;
  if (error) return `Error! ${error.message}`;

  const handleSubmit = () => {
    // setOpen(false);
  };

  return (
    <>
      {data && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={false}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">Скорректировать заказ</DialogTitle>

          <DialogContent>
            <OrderData onSubmit={handleSubmit} orderData={orderData} onChange={onOrderDataChange} />
          </DialogContent>

          <DialogActions>
            <Box flexGrow={1}>
              <Button onClick={onClose} color="primary" variant="outlined">
                Отмена
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
