import React from 'react';
import { useTable } from 'react-table';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        border: '1px solid black',
    },
    cell: {
        margin: 0,
        padding: '0.2 rem',
        border: '1px solid black',
    },
});

function Table({ columns, data }) {

    const classes = useStyles();

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    // Render the UI for your table
    return (
        <table {...getTableProps()} className={classes.table}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} className={classes.cell}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className={classes.cell}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()} className={classes.cell}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} className={classes.cell} >{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Table;