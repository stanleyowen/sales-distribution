import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    Dialog,
    Button,
    TableRow,
    TableBody,
    TableCell,
    TextField,
    DialogTitle,
    DialogContent,
    TableContainer,
    LinearProgress,
    TablePagination,
    DialogActions,
} from '@mui/material';
import { readFile, writeFile } from '../lib/file-operation.lib';

type Props = {
    page: number;
    rowsPerPage: number;
    itemDialogIsOpen: boolean;
};
// eslint-disable-next-line
const Invoices = ({}: any) => {
    const [data, setData] = useState<Array<any>>([]);
    const [props, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
        itemDialogIsOpen: false,
    });

    const handleProperties = (id: string, value: number | boolean) =>
        setProps({ ...props, [id]: value });

    const columns = [
        { id: 'invoiceNumber', label: 'Invoice Number' },
        { id: 'customer', label: 'Customer Name' },
    ];

    function readItemDatabase() {
        readFile(localStorage.getItem('invoice-database'), (data: any) =>
            setData(JSON.parse(data))
        );
    }

    useEffect(() => readItemDatabase(), []);

    return (
        <div>
            <Button
                variant="contained"
                className="mt-10 ml-10"
                onClick={() => (window.location.hash = '/')}
            >
                Add Invoices
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableRow>
                        <TableCell key="invoiceNumber">
                            Invoice Number
                        </TableCell>
                        <TableCell key="customer">Customer Name</TableCell>
                    </TableRow>
                    <TableBody>
                        {data.length > 0 ? (
                            data
                                .slice(
                                    props.page * props.rowsPerPage,
                                    props.page * props.rowsPerPage +
                                        props.rowsPerPage
                                )
                                .map((item: any) => {
                                    return (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            // onClick={() => UpdateItemData(item)}
                                        >
                                            <TableCell key="invoiceNumber">
                                                {item['invoiceNumber']}
                                            </TableCell>
                                            <TableCell key="customer">
                                                {item.customer['fullName']}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                page={props.page}
                rowsPerPage={props.rowsPerPage}
                count={data.length ?? 0}
                onPageChange={(_, newPage: number) => {
                    handleProperties('page', newPage);
                }}
                onRowsPerPageChange={(e) => {
                    handleProperties('page', 0);
                    handleProperties('rowsPerPage', +e.target.value);
                }}
            />
        </div>
    );
};

export default Invoices;
