import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import OrderFormCustomerData from "./OrderFormCustomerData";
import OrderFormDelivery from "./OrderFormDelivery";
import OrderFormDocs from "./OrderFormDocs";
import OrderFormItems from "./OrderFormItems";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { grey } from "@material-ui/core/colors";
import { newOrderFormState } from "./orderConstants";
// import { useLazyQuery } from "@apollo/react-hooks";
import { SUBSCRIPTION_CUSTOMERS } from "./orderConstants";
import { useSubscription } from "@apollo/react-hooks";

const useStyles = makeStyles({
  root: {
    maxWidth: 900,
    backgroundColor: grey[100],
  },
});

export default function OrderForm({
  orderData = newOrderFormState,
  onChange,
  onSubmit,
  onCancel,
  type,
}) {
  const classes = useStyles();
  const [formLists, setFormLists] = useState({
    customers: [],
    firms: [],
    shops: [],
    persons: [],
    delivery: [],
  });

  const { loading, error, data } = useSubscription(SUBSCRIPTION_CUSTOMERS);

  useEffect(() => {
    if (data) {
      console.log("customers", data);
      setFormLists((prevState) => ({ ...prevState, customers: data.customers }));
    }
  }, [data]);

  // populate select options in this form and customer data.
  useEffect(() => {
    let customer;
    // Add order
    if (!orderData.id && orderData.customer_id) {
      customer = formLists.customers.find((el) => el.id === orderData.customer_id);
      // console.log(orderData);
      // console.log(customer);
      if (customer) {
        onChange("customer", customer);
        onChange("discount", customer.discount);
        onChange("saldo", customer.saldo);
        onChange("price_type_id", customer.price_type_id);
        onChange("payment_term", customer.payment_term);
      }
    }
    // Update order
    if (orderData.id && orderData.customer_id) {
      customer = orderData.customer;
    }

    // Add and update order
    if (orderData.customer_id) {
      if (customer) {
        const firms = customer.firms;
        const shops = customer.shops;
        const persons = customer.persons;
        setFormLists((prevState) => ({ ...prevState, firms, shops, persons }));
        if (firms.length === 1) {
          onChange("firm_id", firms[0].id);
        }
        if (shops.length === 1) {
          onChange("shop_id", shops[0].id);
        }
        if (persons.length === 1) {
          onChange("person_id", persons[0].id);
        } else if (!orderData.person_id) {
          onChange("person_id", undefined);
        }
      }
    }
  }, [orderData.customer_id, orderData.id, data]); //data - чтобы обновлялись списки при добавлении фирмы, магаза и персоны

  // fill the form with shops data
  useEffect(() => {
    // Add order
    if (!orderData.id && orderData.shop_id) {
      const shop = formLists.shops.find((el) => el.id === orderData.shop_id);
      if (shop) {
        onChange("city", shop.city);
        onChange("address", shop.address);
        onChange("consignee_name", shop.consignee_name);
        onChange("consignee_phone", shop.consignee_phone);
        onChange("consignee_data", shop.consignee_data);
        onChange("delivery_note", shop.delivery_note);
        onChange("delivery_id", shop.delivery_id);
      }
    }
    // // Add and update  - list persons
    // if (orderData.id && orderData.shop_id) {
    //   const persons = orderData.customer.persons.filter(
    //     // (item) => item.shop_id === orderData.shop_id || item.firm_id === orderData.firm_id
    //     (item) => item.customer_id === orderData.customer_id
    //   );
    //   setFormLists((prevState) => ({ ...prevState, persons }));
    // }
  }, [orderData.shop_id, orderData.id]);

  // fill the form with firm data
  useEffect(() => {
    if (!orderData.id && orderData.firm_id) {
      const firm = formLists.firms.find((el) => el.id === orderData.firm_id);
      if (firm) {
        const ourFirmId = firm.contracts[0] && firm.contracts[0].our_firm_id;
        console.log(firm);
        onChange("our_firm_id", ourFirmId);
      }
    }
  }, [orderData.id, orderData.firm_id]);

  if (loading) return "Loading....";
  if (error) return `Error! ${error.message}`;

  return (
    <Card className={classes.root}>
      <CardContent>
        <OrderFormCustomerData orderData={orderData} onChange={onChange} options={formLists} />
        <OrderFormDelivery orderData={orderData} onChange={onChange} />
        <OrderFormItems orderData={orderData} onChange={onChange} type={type} />
        <OrderFormDocs orderData={orderData} onChange={onChange} />
      </CardContent>
      <CardActions>
        <Box flexGrow={1}>
          <Button onClick={onCancel} color="primary" variant="outlined">
            Отмена
          </Button>
        </Box>
        <Button onClick={onSubmit} color="primary" variant="contained">
          OK
        </Button>
      </CardActions>
    </Card>
  );
}
