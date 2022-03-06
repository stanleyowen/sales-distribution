import React, { useEffect, useState } from 'react';
import {
    Alert,
    Paper,
    Table,
    Dialog,
    Button,
    Tooltip,
    TableRow,
    TableHead,
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
    isNotValid: boolean;
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
const Customers = () => {
    const [data, setData] = useState<Array<any>>([]);
    const [properties, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
        isNotValid: false,
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
        setProps({ ...properties, [id]: value });
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
        setProps({
            ...properties,
            isNotValid: false,
            customerDialogIsOpen: false,
        });
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
        if (
            (customerData.taxId === '' && customerData.idNumber === '') ||
            (customerData.taxId === '000000000000000' &&
                customerData.idNumber === '-') ||
            (customerData.taxId === '' && customerData.idNumber === '-') ||
            (customerData.taxId === '000000000000000' &&
                customerData.idNumber === '') ||
            (customerData.taxId !== '' &&
                customerData.taxId !== '000000000000000' &&
                customerData.taxId?.length !== 15) ||
            (customerData.idNumber !== '' &&
                customerData.idNumber !== '-' &&
                customerData.idNumber?.length !== 16)
        )
            handleProperties('isNotValid', true);
        else {
            const newCustomerData = {
                ...customerData,
                idNumber:
                    customerData.idNumber === '' ? '-' : customerData.idNumber,
                taxId:
                    customerData.taxId === ''
                        ? '000000000000000'
                        : customerData.taxId,
            };
            if (newCustomerData?.properties?.isUpdate) {
                delete newCustomerData.properties;

                const newData = data.map((item: CustomerData) => {
                    if (item.id === newCustomerData.id) return newCustomerData;
                    return item;
                });

                writeFile(
                    localStorage.getItem('customer-database'),
                    JSON.stringify(newData),
                    (res: string) => console.log(res)
                );
            } else {
                delete newCustomerData?.properties;

                writeFile(
                    localStorage.getItem('customer-database'),
                    JSON.stringify([...data, newCustomerData]),
                    (res: string) => console.log(res)
                );
            }

            closeCustomerDialog();
            readCustomerDatabase();
        }
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
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>
                                    {column.label}
                                </TableCell>
                            ))}
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

            <Dialog
                fullWidth
                open={properties.customerDialogIsOpen}
                onClose={() => closeCustomerDialog()}
            >
                <form onSubmit={() => addCustomerData()}>
                    <DialogTitle>Update Customer&#39;s Details</DialogTitle>
                    <DialogContent>
                        {properties.isNotValid ? (
                            <Alert
                                severity="error"
                                className="w-100 border-box mb-10"
                            >
                                One of the fields, either Tax Id (NPWP) or Id
                                Number (NIK) is required or contains invalid
                                format.
                            </Alert>
                        ) : null}
                        {Object.keys(columns).map((_, index: number) => {
                            const { id, label } = columns[index];
                            if (label == 'Id') return;
                            else
                                return (
                                    <TextField
                                        required={
                                            id === 'fullName' ||
                                            id === 'address'
                                                ? true
                                                : false
                                        }
                                        fullWidth
                                        type="text"
                                        key={index}
                                        label={label}
                                        margin="dense"
                                        variant="standard"
                                        autoFocus={index === 1}
                                        value={(customerData as any)[id]}
                                        onChange={(e) =>
                                            handleCustomerData(
                                                id,
                                                e.target.value
                                            )
                                        }
                                    />
                                );
                        })}
                    </DialogContent>
                    <DialogActions>
                        {customerData?.properties?.isUpdate ? (
                            <Tooltip
                                placement="top"
                                title="Double Click the Button to Delete Customer Data"
                            >
                                <Button
                                    onDoubleClick={() => DeleteCustomerData()}
                                    color="error"
                                >
                                    Delete
                                </Button>
                            </Tooltip>
                        ) : null}
                        <Button onClick={() => closeCustomerDialog()}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {customerData?.properties?.isUpdate
                                ? 'Update'
                                : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default Customers;
