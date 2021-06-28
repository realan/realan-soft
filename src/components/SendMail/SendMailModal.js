import React, { useEffect } from "react";
import { useState } from "react";
import { gql } from "apollo-boost";
import emailjs from "emailjs-com";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from "constants/emailjs";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// const emailInfo = {
//   name: "Ivan",
//   email: "realan@bk.ru",
//   subject: "Счет, сувениры из мраморной крошки",
//   message: "Во вложении счет. Просьба проверить позиции, все ли верно?",
//   from_name: "Сергей",
// };

const GET_PERSON_DELIVERY_DATA = gql`
  query GetPersonDeliveryData($order_id: Int!) {
    orders(where: { id: { _eq: $order_id } }) {
      person {
        email
        name
        full_name
        id
      }
      delivery {
        id
        site_waybill
        name
      }
      note_order
      id
      customer_id
    }
  }
`;

const SET_ORDER_SHIPPED = gql`
  mutation SetOrderShipped($order_id: Int!, $waybill: String) {
    update_orders_by_pk(
      pk_columns: { id: $order_id }
      _set: { is_shipped: true, waybill_number: $waybill }
    ) {
      id
    }
  }
`;

export default function SendMailModal({ open, onClose, orderId }) {
  const [emailData, setEmailData] = useState({});
  // const [message, setMessage] = useState("");

  const { loading, error, data: dataOrder } = useQuery(GET_PERSON_DELIVERY_DATA, {
    variables: { order_id: orderId },
  });
  const [
    SetOrderShippedMutation,
    { loading: loadSetShipped, error: errorSetShipped },
  ] = useMutation(SET_ORDER_SHIPPED);

  useEffect(() => {
    if (dataOrder) {
      console.log(dataOrder);
      const obj = dataOrder.orders[0];
      setEmailData({
        name: obj.person.name,
        email: obj.person.email,
        subject: "Отгрузка, сувениры",
        message: "Ваш заказ отправлен, отслеживать можно по ссылке " + obj.delivery.site_waybill,
        from_name: "Марина Александр",
        waybill: "",
      });
    }
  }, [dataOrder]);

  const handleChange = (type, value) => {
    setEmailData((prevState) => ({ ...prevState, [type]: value }));
  };

  function sendEmail(e) {
    e.preventDefault();
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, e.target, EMAILJS_USER_ID).then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        // console.log(error);
        console.log(error.text);
      }
    );
    SetOrderShippedMutation({ variables: { order_id: orderId, waybill: emailData.waybill } });
    onClose();
  }

  if (loading) return <p>Loading order...</p>;
  if (error) return `Error! ${error.message}`;
  if (loadSetShipped) return <p>Loading ...</p>;
  if (errorSetShipped) return `Error! ${errorSetShipped.message}`;

  return (
    <>
      {dataOrder && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth={false}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle id="draggable-dialog-title">Отправить письмо об отгрузке</DialogTitle>
          <DialogContent>
            <form
              className="contact-form"
              encType="multipart/form-data"
              method="post"
              onSubmit={sendEmail}
            >
              <Grid container spacing={2}>
                <input type="hidden" name="contact_number" />
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Имя"
                    name="name"
                    value={emailData.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="email"
                    name="email"
                    value={emailData.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Тема письма"
                    name="subject"
                    value={emailData.subject}
                    onChange={(event) => handleChange("subject", event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Сообщение"
                    name="message"
                    value={emailData.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Номер транспортной накладной"
                    name="waybill"
                    value={emailData.waybill}
                    onChange={(event) => handleChange("waybill", event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Имя от кого"
                    name="from_name"
                    value={emailData.from_name}
                    onChange={(event) => handleChange("from_name", event.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <input type="file" name="my_file" />

                <Button variant="contained" component="label">
                  Отправить
                  <input type="submit" value="Send" hidden />
                </Button>
                {/* <input type="submit" value="Send" /> */}
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
