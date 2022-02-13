import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    LinearProgress,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { readFile, writeFile } from '../lib/file-operation.lib';

type Props = {
    page: number;
    rowsPerPage: number;
    customerDialogIsOpen: boolean;
};

type CustomerData = {
    id: number;
    fullName: string;
    taxId: string | null;
    idNumber: string | null;
    address: string;
};

// eslint-disable-next-line
const Customer = ({}: any) => {
    const [data, setData] = useState<Array<any>>([]);
    const [props, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
        customerDialogIsOpen: false,
    });
    const [customerData, setCustomerData] = useState<CustomerData>({
        id: 0,
        fullName: '',
        taxId: '',
        idNumber: '',
        address: '',
    });

    const handleProperties = (id: string, value: number | boolean) =>
        setProps({ ...props, [id]: value });
    const handleCustomerData = (id: string, value: string | number) =>
        setCustomerData({ ...customerData, [id]: value });

    const columns = [
        { id: 'id', label: 'Id' },
        { id: 'fullName', label: 'Name' },
        { id: 'taxId', label: 'NPWP' },
        { id: 'idNumber', label: 'NIK' },
        { id: 'address', label: 'Address' },
    ];

    useEffect(() => {
        readFile(
            process.env.NODE_ENV === 'development'
                ? `./public/db/customer-data.json`
                : `../build/db/customer-data.json`,
            (data: any) => {
                setData(JSON.parse(data));
            }
        );
    }, []); // eslint-disable-line

    useEffect(() => {
        handleCustomerData('id', data.length + 1);
    }, [data]);

    const addCustomerData = () => {
        writeFile(
            localStorage.getItem('customer-database'),
            JSON.stringify([...data, customerData]),
            (res: any) => console.log(res)
        );

        handleProperties('customerDialogIsOpen', false);
    };

    return (
        <div>
            <Button
                variant="contained"
                className="mt-10 ml-10"
                onClick={() => handleProperties('customerDialogIsOpen', true)}
            >
                Add Customer
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableBody>
                        {data.length > 100 ? (
                            data
                                .slice(
                                    props.page * props.rowsPerPage,
                                    props.page * props.rowsPerPage +
                                        props.rowsPerPage
                                )
                                .map((customer: any) => {
                                    return (
                                        <TableRow key={customer.id} hover>
                                            {columns.map((column: any) => {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {customer[column.id]}
                                                    </TableCell>
                                                );
                                            })}
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

            <Dialog
                fullWidth
                open={props.customerDialogIsOpen}
                onClose={() => {
                    handleProperties('customerDialogIsOpen', false);
                    setCustomerData({
                        id: data?.length + 1,
                        fullName: '',
                        taxId: '',
                        idNumber: '',
                        address: '',
                    });
                }}
            >
                <DialogTitle>Update Customer</DialogTitle>
                <DialogContent>
                    {Object.keys(columns).map((_, index: number) => {
                        const { id, label } = columns[index];
                        if (label == 'Id') return;
                        else
                            return (
                                <TextField
                                    fullWidth
                                    type="text"
                                    key={index}
                                    label={label}
                                    margin="dense"
                                    variant="standard"
                                    autoFocus={index === 1}
                                    value={(customerData as any)[id]}
                                    onChange={(e) =>
                                        handleCustomerData(id, e.target.value)
                                    }
                                />
                            );
                    })}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            handleProperties('customerDialogIsOpen', false)
                        }
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => addCustomerData()}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Customer;
