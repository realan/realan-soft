import React from 'react';
import { useState, useEffect } from 'react';
// import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import { DataGrid } from '@material-ui/data-grid';
import { GET_PRICE } from '../../GraphQL/Queries';

const DialogAddOrderItems = (props) => {
  const [price, setPrice] = useState([]);
  const [items, setItems] = useState([]);

  const { loading, error, data } = useQuery(GET_PRICE);

  useEffect(() => {
    if (!loading && data) {
      setPrice(data.mr_price);
    }
  }, [loading, data]);

  if (loading) return 'Loading....';
  if (error) return `Error! ${error.message}`;

  const columns = [
    { field: 'id', headerName: 'id', width: 30 },
    { field: 'name', headerName: 'Наименование', type: 'text', width: 200 },
    { field: 'art', headerName: 'Артикул', type: 'text', width: 100 },
    { field: 'qty', headerName: 'К-во', type: 'number', width: 80 },
    { field: 'price', headerName: 'Цена', type: 'number', width: 100 },
    { field: 'note', headerName: 'Примечание', type: 'text', width: 200 },
    { field: 'itemId', headerName: 'ID Item', type: 'number', width: 30 },
  ];

  const parseClipboadToItems = () => {
    navigator.clipboard.readText().then((str) => {
      let arr = str.split('\n');
      let result = [];

      let qtyColumn;
      let priceColumn;
      let artColumn;

      let header = arr[0].split('\t');
      header.forEach(function (item, i) {
        if (item === 'Товар') {
          header[i] = 'name';
        }
        if (item === 'Модель') {
          header[i] = 'art';
          artColumn = i;
        }
        if (item === 'Кол-во') {
          header[i] = 'qty';
          qtyColumn = i;
        }
        if (item === 'Цена' || item === 'Цена за ед.') {
          header[i] = 'price';
          priceColumn = i;
        }
        if (item === 'Итого' || item === 'Всего') {
          header[i] = 'sum';
        }
      });

      arr.forEach(function (line, i) {
        if (line) {
          if (i !== 0) {
            let row = [];
            let rowIn = line.split('\t');
            let obj = {};

            rowIn.forEach(function (cell, j) {
              if (j === qtyColumn) {
                obj[header[j]] = Number(cell);
              } else if (j === priceColumn) {
                let val = cell.replace('руб.', '').replace(' ', '');
                obj[header[j]] = Number(val);
              } else if (j === artColumn) {
                let art = cell.trim();
                obj[header[j]] = art;
                let itId = price.find((item) => item.art === art).id;
                obj['itemId'] = itId;
              } else {
                obj[header[j]] = cell.trim();
              }
              row.push(obj);
            });
            obj.id = i;
            result.push(obj);
          }
        }
      });
      console.log(result);
      setItems(result);
      let itemsOrder = result.map((item) => {
        return {
          item: item.id,
          qty: item.qty,
          order: item.orderId,
          note: item.note,
        };
      });
      props.onChange(itemsOrder);
    });
  };

  return (
    <div style={{ height: 600, width: '100%' }}>
      Скопируй в буфер заказ - строку заголовка и позиции. Потом нажми кнопку
      <Button variant="outlined" color="primary" onClick={parseClipboadToItems}>
        Вставить позиции
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => setItems([])}>
        Очистить
      </Button>
      <DataGrid columns={columns} rows={items} rowHeight={32} />
    </div>
  );
};

export default DialogAddOrderItems;
