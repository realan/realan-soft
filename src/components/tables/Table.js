import React from "react";
import { useTable } from "react-table";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    border: "1px solid black",
  },
  cell: {
    margin: 0,
    padding: "0.2 rem",
    border: "1px solid black",
  },
});

function Table({ columns, data }) {
  const classes = useStyles();

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()} className={classes.table}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} className={classes.cell} key={index}>
            {headerGroup.headers.map((column, index) => (
              <th {...column.getHeaderProps()} className={classes.cell} key={index}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={classes.cell} key={index}>
              {row.cells.map((cell, index) => {
                return (
                  <td {...cell.getCellProps()} className={classes.cell} key={index}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
