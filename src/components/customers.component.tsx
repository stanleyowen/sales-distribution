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
    customerDialogIsOpen: boolean;
};

type CustomerData = {
    id: number;
    fullName: string;
    taxId: string | null;
    idNumber: string | null;
    address: string;
    properties?: {
        isUpdate?: boolean;
    };
};

// eslint-disable-next-line
const Customers = ({}: any) => {
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
        properties: {
            isUpdate: false,
        },
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

    function readCustomerDatabase() {
        readFile(localStorage.getItem('customer-database'), (data: any) =>
            setData(JSON.parse(data))
        );
    }

    function closeCustomerDialog() {
        handleProperties('customerDialogIsOpen', false);
        setCustomerData({
            id: data?.length + 1,
            fullName: '',
            taxId: '',
            idNumber: '',
            address: '',
            properties: {
                isUpdate: false,
            },
        });
    }

    useEffect(() => readCustomerDatabase(), []);
    useEffect(() => {
        handleCustomerData('id', data.length + 1);
    }, [data]);

    const addCustomerData = () => {
        if (customerData?.properties?.isUpdate) {
            const newData = data.map((item: CustomerData) => {
                if (item.id === customerData.id) return customerData;
                return item;
            });

            delete customerData.properties;

            writeFile(
                localStorage.getItem('customer-database'),
                JSON.stringify(newData),
                (res: string) => console.log(res)
            );
        } else {
            delete customerData.properties;

            writeFile(
                localStorage.getItem('customer-database'),
                JSON.stringify([...data, customerData]),
                (res: string) => console.log(res)
            );
        }

        closeCustomerDialog();
        readCustomerDatabase();
    };

    const UpdateCustomerData = (data: CustomerData) => {
        handleProperties('customerDialogIsOpen', true);
        setCustomerData({
            ...data,
            properties: { isUpdate: true },
        });
    };

    const DeleteCustomerData = () => {
        const newData = data.filter((item: CustomerData) => {
            return item.id !== customerData.id;
        });

        writeFile(
            localStorage.getItem('customer-database'),
            JSON.stringify(newData),
            (res: string) => console.log(res)
        );

        closeCustomerDialog();
        readCustomerDatabase();
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
                        {data.length > 0 ? (
                            data
                                .slice(
                                    props.page * props.rowsPerPage,
                                    props.page * props.rowsPerPage +
                                        props.rowsPerPage
                                )
                                .map((customer: any) => {
                                    return (
                                        <TableRow
                                            key={customer.id}
                                            hover
                                            onClick={() =>
                                                UpdateCustomerData(customer)
                                            }
                                        >
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
                onClose={() => closeCustomerDialog()}
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
                    {customerData?.properties?.isUpdate ? (
                        <Button
                            onClick={() => DeleteCustomerData()}
                            color="error"
                        >
                            Delete
                        </Button>
                    ) : null}
                    <Button onClick={() => closeCustomerDialog()}>
                        Cancel
                    </Button>
                    <Button onClick={() => addCustomerData()}>
                        {customerData?.properties?.isUpdate ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Customers;
