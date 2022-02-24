import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid,
    Button,
    Select,
    Dialog,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    DialogTitle,
    DialogContent,
    DialogActions,
    SelectChangeEvent,
    Alert,
} from '@mui/material';
import {
    AddIcon,
    SaveIcon,
    CloseIcon,
    DeleteIcon,
} from '../lib/icons.component';
import { readFile, writeFile } from '../lib/file-operation.lib';

type Data = {
    invoiceNumber: number;
    invoiceType: 'Auto' | 'A' | 'BC' | '';
    customer: {
        id: number;
        fullName: string;
        address: string;
        idNumber: string;
        taxId: string;
    };
    items: any;
};

type Props = {
    isLoading: boolean;
    isDuplicete: boolean;
    dialogIsOpen: boolean;
};

// eslint-disable-next-line
const EditInvoice = () => {
    const { id } = useParams();
    const [itemData, setItemData] = useState<Array<any>>([]);
    const [invoiceData, setInvoiceData] = useState<Array<any>>([]);
    const [customerData, setCustomerData] = useState<Array<any>>([]);
    const [oldInvoiceNumber, setOldInvoiceNumber] = useState<number>(0);
    const [properties, setProps] = useState<Props>({
        isLoading: true,
        isDuplicete: false,
        dialogIsOpen: false,
    });
    const [data, setData] = useState<Data>({
        invoiceNumber: 0,
        invoiceType: '',
        customer: {
            id: 0,
            fullName: '',
            address: '',
            idNumber: '',
            taxId: '',
        },
        items: [
            {
                id: 0,
                qty: 0,
                itemName: '',
                unitPrice: 0,
                totalPrice: 0,
                discountPerKg: 0,
                discountPercent: 0,
                unitOfMeasure: '',
            },
        ],
    });

    const handleData = (id: string, value: string | number) =>
        setData({ ...data, [id]: value });

    const handleCustomer = (id: string, value: string | number) =>
        setData({
            ...data,
            customer: { ...data.customer, [id]: value },
        });

    const handleItems = (id: string, value: string | number, index: number) => {
        const items = [...data.items];
        items[index][id] = value;
        setData({ ...data, items });
    };

    const handleProperties = (id: string, value: boolean) =>
        setProps({ ...properties, [id]: value });

    useEffect(() => {
        document
            .querySelectorAll('.MuiTextField-root')
            .forEach((input: any) => {
                input.classList.add('w-100');
            });

        readFile(localStorage.getItem('item-database'), (data: any) =>
            setItemData(JSON.parse(data))
        );

        readFile(localStorage.getItem('customer-database'), (data: any) =>
            setCustomerData(JSON.parse(data))
        );

        readFile(localStorage.getItem('invoice-database'), (data: any) => {
            const invoice = JSON.parse(data).find(
                (invoice: any) => invoice.invoiceNumber === id
            );

            setInvoiceData(JSON.parse(data));
            setData(invoice);
            setOldInvoiceNumber(invoice.invoiceNumber);

            handleProperties('isLoading', false);
        });
    }, []); // eslint-disable-line

    useEffect(() => {
        if (properties.isLoading)
            document.querySelectorAll('input').forEach((input: any) => {
                const { parentElement: inputParentElement } = input;
                input.disabled = true;
                inputParentElement.classList.add('Mui-disabled');
            });
        else {
            document.querySelectorAll('input').forEach((input: any) => {
                const { parentElement: inputParentElement } =
                    input.parentElement;
                if (!inputParentElement.classList.contains('disabled')) {
                    input.disabled = false;
                    input.parentElement.classList.remove('Mui-disabled');
                }
            });

            document.getElementById('invoice-number')?.focus();
        }
    }, [properties.isLoading]);

    const SearchCustomerById = (id: string) => {
        customerData.forEach((customer: any) => {
            if (customer.id === Number(id)) setData({ ...data, customer });
        });
    };

    const SearchItemById = (id: string, index: number) => {
        itemData.forEach((item: any) => {
            if (item.id === Number(id)) {
                const items = [...data.items];
                items[index] = { ...items[index], ...item };
                if (items[index].qty !== 0) {
                    items[index]['totalPrice'] =
                        items[index].qty * items[index].unitPrice;
                }
                setData({ ...data, items });
            }
        });
    };

    const AddItem = () => {
        const items = [...data.items];
        items[data.items.length] = {
            id: 0,
            qty: 0,
            itemName: '',
            unitPrice: 0,
            totalPrice: 0,
            discountPerKg: 0,
            discountPercent: 0,
            unitOfMeasure: '',
        };
        setData({ ...data, items });
    };

    const removeItem = (index: number) => {
        const items = [...data.items];
        items.splice(index, 1);
        setData({ ...data, items });
    };

    const deleteInvoice = () => {
        const invoices = [...invoiceData];
        const index = invoices.findIndex(
            (invoice: Data) => invoice.invoiceNumber === oldInvoiceNumber
        );

        invoices.splice(index, 1);
        writeFile(
            localStorage.getItem('invoice-database'),
            JSON.stringify(invoices),
            () => (window.location.hash = '/invoices')
        );
    };

    const UpdateInvoice = () => {
        handleProperties('isLoading', true);
        const newInvoice = invoiceData.map((invoice: any) => {
            if (
                oldInvoiceNumber !== data.invoiceNumber &&
                data.invoiceNumber === invoice.invoiceNumber
            )
                handleProperties('isDuplicate', true);
            if (invoice.invoiceNumber === oldInvoiceNumber) return invoice;
            return invoice;
        });

        if (!properties.isDuplicete) {
            writeFile(
                localStorage.getItem('invoice-database'),
                JSON.stringify(newInvoice),
                (res: string) => (window.location.hash = '/invoices')
            );
        }
    };

    function calculateTotalPricePerItem(index: number) {
        const { qty, unitPrice, discountPercent, discountPerKg } =
            data.items[index];
        const totalDiscountPercent =
            discountPercent > 0 ? (100 - discountPercent) / 100 : 1;
        const totalDiscountPerKg = discountPerKg * qty;
        const totalPrice =
            qty * unitPrice * totalDiscountPercent - totalDiscountPerKg;
        handleItems('totalPrice', totalPrice, index);
    }

    return (
        <div>
            <div className="mt-10 p-10">
                <Alert
                    severity="error"
                    className="w-100 border-box mb-10"
                    hidden={!properties.isDuplicete}
                >
                    Invoice number {data.invoiceType + data.invoiceNumber}{' '}
                    already exists. Please try another invoice number.
                </Alert>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            id="invoice-number"
                            variant="filled"
                            label="Invoice No"
                            value={data.invoiceNumber}
                            onChange={(e) =>
                                handleData('invoiceNumber', e.target.value)
                            }
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="filled">
                            <InputLabel id="invoice-type">
                                Invoice Type
                            </InputLabel>
                            <Select
                                variant="filled"
                                labelId="invoice-type"
                                value={data.invoiceType}
                                onChange={(e: SelectChangeEvent) =>
                                    handleData(
                                        'invoiceType',
                                        e.target.value as string
                                    )
                                }
                            >
                                <MenuItem value="Auto">Auto</MenuItem>
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="BC">BC</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            type="number"
                            variant="filled"
                            label="Customer Id"
                            value={data.customer.id}
                            onChange={(e) => {
                                handleCustomer('id', e.target.value);
                                SearchCustomerById(e.target.value);
                            }}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            disabled
                            variant="filled"
                            label="Name"
                            className="disabled"
                            value={data.customer.fullName}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            label="Address"
                            className="disabled"
                            value={data.customer.address}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            className="disabled"
                            label=" Tax Id (NPWP)"
                            value={data.customer.taxId}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            className="disabled"
                            label="Id Number (NIK)"
                            value={data.customer.idNumber}
                        />
                    </Grid>
                </Grid>

                <p className="mb-10">Item(s)</p>

                {data.items.map((_: any, index: number) => {
                    return (
                        <Grid
                            container
                            spacing={2}
                            key={index}
                            className="mb-10"
                        >
                            <Grid item xs={2}>
                                <TextField
                                    type="number"
                                    label="Item Id"
                                    variant="filled"
                                    className="w-100"
                                    value={data.items[index].id}
                                    onChange={(e) => {
                                        handleItems(
                                            'id',
                                            e.target.value,
                                            index
                                        );
                                        SearchItemById(e.target.value, index);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    label="Quantity"
                                    className="w-100"
                                    value={data.items[index].qty}
                                    onChange={(e) => {
                                        handleItems(
                                            'qty',
                                            e.target.value,
                                            index
                                        );
                                        calculateTotalPricePerItem(index);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    label="Item Name"
                                    className="w-100 disabled"
                                    value={data.items[index].itemName}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    className="w-100 disabled"
                                    label="Unit of Measure"
                                    value={data.items[index].unitOfMeasure}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    className="w-100 disabled"
                                    label="Unit Price"
                                    value={data.items[
                                        index
                                    ].unitPrice.toLocaleString('id-ID')}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    className="w-100"
                                    label="Discount (%)"
                                    value={data.items[index].discountPercent}
                                    onChange={(e) => {
                                        handleItems(
                                            'discountPercent',
                                            e.target.value,
                                            index
                                        );
                                        calculateTotalPricePerItem(index);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    className="w-100"
                                    label="Discount Each Kg"
                                    value={data.items[index].discountPerKg}
                                    onChange={(e) => {
                                        handleItems(
                                            'discountPerKg',
                                            e.target.value,
                                            index
                                        );
                                        calculateTotalPricePerItem(index);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    className="w-100 disabled"
                                    label="Total Price"
                                    value={data.items[
                                        index
                                    ].totalPrice.toLocaleString('id-ID')}
                                />
                            </Grid>
                            {index === 0 ? null : (
                                <Grid item>
                                    <Button
                                        color="warning"
                                        className="h-100"
                                        onClick={() => removeItem(index)}
                                    >
                                        <CloseIcon width="2em" height="2em" />
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    );
                })}

                <Button
                    variant="contained"
                    className="w-100 mb-10"
                    startIcon={<AddIcon />}
                    onClick={() => AddItem()}
                >
                    Add Items
                </Button>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Button
                            color="error"
                            variant="outlined"
                            className="w-100"
                            startIcon={<DeleteIcon />}
                            onClick={() =>
                                handleProperties('dialogIsOpen', true)
                            }
                        >
                            Delete
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            color="error"
                            variant="contained"
                            className="w-100"
                            startIcon={<CloseIcon />}
                            onClick={() => (window.location.hash = '/invoices')}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            className="w-100"
                            startIcon={<SaveIcon />}
                            onClick={() => UpdateInvoice()}
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </div>

            <Dialog
                fullWidth
                open={properties.dialogIsOpen}
                onClose={() => handleProperties('dialogIsOpen', false)}
            >
                <DialogTitle className="error">
                    Delete Invoice Permanently
                </DialogTitle>
                <DialogContent>
                    Are you sure want to delete this invoice permanently? This
                    action is <span className="error">irreversible</span>.
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleProperties('dialogIsOpen', false)}
                    >
                        Cancel
                    </Button>
                    <Button color="error" onClick={() => deleteInvoice()}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EditInvoice;
