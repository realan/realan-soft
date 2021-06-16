export const dataStructure = {
  customers: [
    { name: "text" },
    { discount: "number" },
    { date_start: "text" },
    { type: "text" },
    { tags: "text" },
    { dealer: "text" },
    { saldo: "number" },
    { payment_term: "text" },
    { price_type_id: "number" },
  ],
  documents: [
    { date: "text" },
    { sum: "number" },
    { sum_net: "number" },
    { order_id: "number" },
    { customer_id: "number" },
    { firm_id: "number" },
    { shop_id: "number" },
    { our_firm_id: "number" },
    { type_doc_id: "number" },
    { number: "number" },
    { year: "number" },
  ],
  contracts: [
    { firm_id: "number" },
    { our_firm_id: "number" },
    { date_start: "text" },
    { date_end: "text" },
    { contract_no: "text" },
    { is_valid: "boolean" },
  ],
  firms: [
    { name: "text" },
    { customer_id: "number" },
    { address: "text" },
    { inn: "text" },
    { kpp: "text" },
    { ogrn: "text" },
    { okpo: "text" },
    { address_mail: "text" },
    { email: "text" },
    { site: "text" },
    { phone: "text" },
    { management_name: "text" },
    { management_post: "text" },
    { bank: "text" },
    { bic: "text" },
    { account: "text" },
    { corr_account: "text" },
    { accountant_name: "text" },
  ],
  persons: [
    { full_name: "text" },
    { name: "text" },
    { gender: "text" },
    { birthday: "text" },
    { phone: "text" },
    { email: "text" },
    { passport: "text" },
    { customer_id: "number" },
    { firm_id: "number" },
    { shop_id: "number" },
    { surname: "text" },
    { fio: "text" },
    { note: "text" },
  ],
  shops: [
    { name: "text" },
    { city: "text" },
    { address: "text" },
    { customer_id: "number" },
    { email: "text" },
    { consignee_name: "text" },
    { consignee_phone: "text" },
    { consignee_data: "text" },
    { delivery_note: "text" },
    { delivery_id: "number" },
    { delivery_ask: "text" },
  ],
  category: [{ name: "text" }],
  price: [
    { name: "text" },
    { name_voice: "text" },
    { art: "text" },
    { category_id: "number" },
    { price_dealer: "number" },
    { price_opt: "number" },
    { price_retail: "number" },
    { height: "number" },
    { weight: "number" },
    { consist_of_ids: "" },
    { supplier_id: "number" },
    { is_on_sale: "boolean" },
  ],
  orders: [
    { date_in: "text" },
    { date_out: "text" },
    { customer_id: "number" },
    { firm_id: "number" },
    { person_id: "number" },
    { shop_id: "number" },
    { bill_id: "number" },
    { invoice_id: "number" },
    { our_firm_id: "number" },
    { delivery_id: "number" },
    { packaging: "text" },
    { consignee_name: "text" },
    { price_type_id: "number" },
    { discount: "number" },
    { pay_till_date: "text" },
    { payment_status: "text" },
    { sum: "number" },
    { weight: "number" },
    { is_shipped: "boolean" },
    { note_order: "text" },
    { note_supplier: "text" },
    { delivery_note: "text" },
    { city: "text" },
    { consignee_data: "text" },
    { is_cancelled: "boolean" },
    { payment_ratio: "number" },
    { consignee_phone: "text" },
    { address: "text" },
    { waybill_number: "text" },
  ],
  items: [
    { item_id: "number" },
    { qty: "number" },
    { order_id: "number" },
    { note: "text" },
    { is_cancelled: "boolean" },
  ],
  moving: [
    { item_id: "number" },
    { qty: "number" },
    { from_order: "number" },
    { to_order: "number" },
    { created_at: "text" },
  ],
};
