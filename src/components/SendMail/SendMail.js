import React from "react";
import { useState } from "react";
import emailjs from "emailjs-com";
import Grid from "@material-ui/core/Grid";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

// import "./ContactUs.css";

const emailInfo = {
  name: "Ivan",
  email: "realan@bk.ru",
  subject: "Счет, сувениры из мраморной крошки",
  message: "Во вложении счет. Просьба проверить позиции, все ли верно?",
  from_name: "Сергей",
};

export default function SendMail() {
  const [emailData, setEmailData] = useState(emailInfo);

  const handleChange = (type, value) => {
    setEmailData((prevState) => ({ ...prevState, [type]: value }));
  };
  // let container = new DataTransfer();
  // container.items.add(file);
  // const blob = new Blob([data], { type: "application/pdf" });
  // let blob = new Blob(["Hello, world!"], { type: "text/plain" });

  function sendEmail(e) {
    e.preventDefault();
    // console.log(e.target);
    // const formData = new FormData();
    // formData.append(e.target);
    // formData.append("my_file", blob, "doc.pdf");
    // formData.append("name", emailData.name);
    // formData.append("email", emailData.email);
    // formData.append("subject", emailData.subject);
    // formData.append("from_name", emailData.from_name);
    // emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_USER_ID").then(
    emailjs
      .sendForm("service_kfuugrn", "template_g5xz8f7", e.target, "user_9kd8rqbfOibC42HqIDXIK")
      //   .send("service_kfuugrn", "template_g5xz8f7")
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          // console.log(error);
          console.log(error.text);
        }
      );
  }

  return (
    <form className="contact-form" encType="multipart/form-data" method="post" onSubmit={sendEmail}>
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
            label="Имя"
            name="message"
            value={emailData.message}
            onChange={(event) => handleChange("message", event.target.value)}
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
      {/* <input type="hidden" name="contact_number" />
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      <label>Attach file:</label> */}
      <Grid item xs={12}>
        <input type="file" name="my_file" />
        {/* value={attachment} readOnly /> */}
        <input type="submit" value="Send" />
      </Grid>
    </form>
  );
}
