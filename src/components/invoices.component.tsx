import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    Button,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    LinearProgress,
    TablePagination,
} from '@mui/material';
import { readFile } from '../lib/file-operation.lib';

type Props = {
    page: number;
    rowsPerPage: number;
    itemDialogIsOpen: boolean;
};

// eslint-disable-next-line
const Invoices = () => {
    const [data, setData] = useState<Array<any>>([]);
    const [properties, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
        itemDialogIsOpen: false,
    });

    const handleProperties = (id: string, value: number | boolean) =>
        setProps({ ...properties, [id]: value });

    useEffect(
        () =>
            readFile(localStorage.getItem('invoice-database'), (data: any) =>
                setData(JSON.parse(data).reverse())
            ),
        []
    );

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
                    <TableHead>
                        <TableRow>
                            <TableCell key="invoiceNumber">
                                Invoice Number
                            </TableCell>
                            <TableCell key="customer">Customer Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data
                                .slice(
                                    properties.page * properties.rowsPerPage,
                                    properties.page * properties.rowsPerPage +
                                        properties.rowsPerPage
                                )
                                .map((item: any, index: number) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            hover
                                            onClick={() =>
                                                (window.location.hash = `/invoices/${
                                                    item.invoiceType +
                                                    item.invoiceNumber
                                                }`)
                                            }
                                        >
                                            <TableCell key="invoiceNumber">
                                                {item['invoiceType'] +
                                                    item['invoiceNumber']}
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
                page={properties.page}
                rowsPerPage={properties.rowsPerPage}
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
