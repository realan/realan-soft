import React from "react";
import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Controls from "../../components/controls/Controls";
import { useForm, FormPop } from "../../components/useForm";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { QUERY_OUR_FIRMS } from "./OrderProcessing/orderConstants";
import ConfirmSnackbar from "components/ConfirmSnackbar/ConfirmSnackbar";

// import { PartySuggestions } from "react-dadata";
// import { AddressSuggestions } from "react-dadata";
// import ReactDadataBox from "react-dadata-box";
// import { TextField } from "@material-ui/core";
// import "react-dadata/dist/react-dadata.css";
// import { DADATA_API_KEY } from "constants/dadata";

const ADD_FIRM = gql`
  mutation AddFirmMutation($addData: firms_insert_input!) {
    insert_firms(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
const ADD_CONTRACT = gql`
  mutation AddContractMutation($addData: contracts_insert_input!) {
    insert_contracts(objects: [$addData]) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

// const our_firm_id = [
//   { id: "1", name: 'ООО "Реалан"' },
//   { id: "2", name: "ИП Беляев СН" },
//   { id: "3", name: "Неоф Реалан" },
//   { id: "4", name: 'ООО "Мрамолит"' },
// ];

const initConfirm = {
  open: false,
  message: "OK",
};

const initialValues = {
  name: "",
  address: "",
  address_mail: "",
  management_name: "",
  management_post: "",
  inn: "",
  kpp: "",
  ogrn: "",
  okpo: "",
  account: "",
  bank: "",
  bic: "",
  corr_account: "",
  email: "",
  site: "",
  phone: "",
  our_firm_id: undefined,
  contract_no: "",
  note: "",
};

export default function AddFirmDialog({ customerId }) {
  const [contract, setContract] = useState({});
  const [ourFirms, setOurFirms] = useState([]);
  const [confirm, setConfirm] = useState(initConfirm);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues) temp.name = fieldValues.name ? "" : "Обязательное поле";
    // if ("phone" in fieldValues)
    //   temp.phone = fieldValues.phone.length > 9 ? "" : "Нужно минимум 10 цифр.";
    // if ("inn" in fieldValues) temp.inn = fieldValues.inn.length > 9 ? "" : "Нужно минимум 10 цифр.";
    // if ("kpp" in fieldValues) temp.kpp = fieldValues.kpp.length === 9 ? "" : "Нужно 9 цифр.";
    if ("email" in fieldValues)
      temp.email = /$^|.+@.+..+/.test(fieldValues.email) ? "" : "Проверить написание Email";
    // if ("account" in fieldValues)
    //   temp.account = fieldValues.account.length === 20 ? "" : "Нужно 20 цифр.";
    // if ("corr_account" in fieldValues)
    //   temp.corr_account = fieldValues.corr_account.length === 20 ? "" : "Нужно 20 цифр.";
    // if ("bic" in fieldValues) temp.bic = fieldValues.bic.length === 9 ? "" : "Нужно 9 цифр.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialValues,
    true,
    validate
  );
  const [AddFirmMutation, { loading, error, data }] = useMutation(ADD_FIRM, {
    onCompleted: () => setConfirm({ open: true, message: "add new firm" }),
  });
  const [AddContractMutation, { loading: loadingCo, error: errorCo }] = useMutation(ADD_CONTRACT, {
    onCompleted: () => setConfirm({ open: true, message: "add new contract" }),
  });
  const { loading: loadingOurFirms, error: errorOurFirms, data: dataOurFirms } = useQuery(
    QUERY_OUR_FIRMS
  );

  useEffect(() => {
    if (data) {
      console.log(data.insert_firms.returning[0]);

      if (contract.our_firm_id) {
        const addData = {
          ...contract,
          ["firm_id"]: data.insert_firms.returning[0].id,
        };
        AddContractMutation({ variables: { addData } });
      }
    }
  }, [data, contract.our_firm_id]);

  useEffect(() => {
    if (dataOurFirms) {
      console.log(dataOurFirms);
      setOurFirms(dataOurFirms.our_firms);
    }
  }, [dataOurFirms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      let firmData = {};
      let contractData = {};
      for (let key in values) {
        if (key !== "our_firm_id" && key !== "contract_no" && key !== "note") {
          firmData[key] = values[key];
        } else {
          contractData[key] = values[key];
        }
      }
      firmData["customer_id"] = customerId;
      contractData["our_firm_id"] = Number(values.our_firm_id);
      console.log(firmData);
      console.log(contractData);
      setContract(contractData);
      AddFirmMutation({ variables: { addData: firmData } });
      resetForm();
      // setOpen(false);
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (loadingCo) return "Loading...";
  if (errorCo) return `Error! ${errorCo.message}`;
  if (loadingOurFirms) return "Loading...";
  if (errorOurFirms) return `Error! ${errorOurFirms.message}`;

  return (
    <>
      {confirm.open && (
        <ConfirmSnackbar
          open={confirm.open}
          message={confirm.message}
          onClose={() => setConfirm(initConfirm)}
        />
      )}
      <FormPop formName={"Добавить фирму"} onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Controls.Input
              name="name"
              label="Название оранизации"
              value={values.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            <Controls.Input
              name="address"
              label="Адрес юридический"
              value={values.address}
              onChange={handleInputChange}
              error={errors.address}
            />
            <Controls.Input
              name="address_mail"
              label="Адрес почтовый"
              value={values.address_mail}
              onChange={handleInputChange}
              error={errors.address_mail}
            />
            <Controls.Input
              name="management_name"
              label="Руководитель"
              value={values.management_name}
              onChange={handleInputChange}
              error={errors.management_name}
            />
            <Controls.Input
              name="management_post"
              label="Должность руководителя"
              value={values.management_post}
              onChange={handleInputChange}
              error={errors.management_post}
            />
            <Controls.Input
              name="inn"
              label="ИНН"
              //type="number"
              value={values.inn}
              onChange={handleInputChange}
              error={errors.inn}
            />
            <Controls.Input
              name="kpp"
              label="КПП"
              //type="number"
              value={values.kpp}
              onChange={handleInputChange}
              error={errors.kpp}
            />
            <Controls.Input
              name="ogrn"
              label="ОГРН"
              //type="number"
              value={values.ogrn}
              onChange={handleInputChange}
              error={errors.ogrn}
            />
            <Controls.Input
              name="okpo"
              label="ОКПО"
              //type="number"
              value={values.okpo}
              onChange={handleInputChange}
              error={errors.okpo}
            />
            <Controls.Input
              name="account"
              label="Р/счет"
              //type="number"
              value={values.account}
              onChange={handleInputChange}
              error={errors.account}
            />
            <Controls.Input
              name="bank"
              label="Банк"
              //value={values.bank}
              onChange={handleInputChange}
              error={errors.bank}
            />
            <Controls.Input
              name="bic"
              label="БИК банка"
              //type="number"
              //value={values.bic}
              onChange={handleInputChange}
              error={errors.bic}
            />
            <Controls.Input
              name="corr_account"
              label="Корр/счет"
              //type="number"
              value={values.corr_account}
              onChange={handleInputChange}
              error={errors.corr_account}
            />
            <Controls.Input
              name="email"
              label="email"
              value={values.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <Controls.Input
              name="site"
              label="Сайт"
              value={values.site}
              onChange={handleInputChange}
              error={errors.site}
            />
            <Controls.Input
              name="phone"
              label="Телефон"
              value={values.phone}
              onChange={handleInputChange}
              error={errors.phone}
            />
            <Controls.Input
              name="contract_no"
              label="Номер договора"
              value={values.contract_no}
              onChange={handleInputChange}
              error={errors.contract_no}
            />
            <Controls.Input
              name="note"
              label="Примечания в договору"
              value={values.note}
              onChange={handleInputChange}
              error={errors.note}
            />

            <Controls.Select
              name="our_firm_id"
              label="Делаем доки от:"
              value={values.our_firm_id}
              onChange={handleInputChange}
              options={ourFirms}
              error={errors.our_firm_id}
            />

            {/* <Controls.RadioGroup
              name="our_firm_id"
              label="Договор с:"
              value={values.our_firm_id}
              onChange={handleInputChange}
              items={ourFirms}
            /> */}
            <div>
              <Controls.Button text="Сбросить" color="default" onClick={resetForm} />
              <Controls.Button type="submit" text="OK" />
            </div>
            <pre>{JSON.stringify(values, null, 4)}</pre>
          </Grid>
        </Grid>
      </FormPop>
    </>
  );
}
