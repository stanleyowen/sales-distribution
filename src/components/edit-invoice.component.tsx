import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    DialogTitle,
    DialogContent,
    DialogActions,
    SelectChangeEvent,
} from '@mui/material';
import {
    AddIcon,
    SaveIcon,
    CloseIcon,
    DeleteIcon,
} from '../lib/icons.component';
import { readFile, writeFile } from '../lib/file-operation.lib';

type Props = {
    invoiceNumber: string;
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

// eslint-disable-next-line
const EditInvoice = () => {
    const { id } = useParams();
    const [itemData, setItemData] = useState<Array<any>>([]);
    const [invoiceData, setInvoiceData] = useState<Array<any>>([]);
    const [customerData, setCustomerData] = useState<Array<any>>([]);
    const [oldInvoiceNumber, setOldInvoiceNumber] = useState<string>('');
    const [properties, setProperties] = useState<Props>({
        invoiceNumber: '',
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

    const handleProperties = (id: string, value: string | number) =>
        setProperties({ ...properties, [id]: value });

    const handleCustomer = (id: string, value: string | number) =>
        setProperties({
            ...properties,
            customer: { ...properties.customer, [id]: value },
        });

    const handleItems = (id: string, value: string | number, index: number) => {
        const items = [...properties.items];
        items[index][id] = value;
        setProperties({ ...properties, items });
    };

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
            setProperties(invoice);
            setOldInvoiceNumber(invoice.invoiceNumber);
        });
    }, []); // eslint-disable-line

    const SearchCustomerById = (id: string) => {
        customerData.forEach((customer: any) => {
            if (customer.id === Number(id))
                setProperties({ ...properties, customer });
        });
    };

    const SearchItemById = (id: string, index: number) => {
        itemData.forEach((item: any) => {
            if (item.id === Number(id)) {
                const items = [...properties.items];
                items[index] = { ...items[index], ...item };
                if (items[index].qty !== 0) {
                    items[index]['totalPrice'] =
                        items[index].qty * items[index].unitPrice;
                }
                setProperties({ ...properties, items });
            }
        });
    };

    const AddItem = () => {
        const items = [...properties.items];
        items[properties.items.length] = {
            id: 0,
            qty: 0,
            itemName: '',
            unitPrice: 0,
            totalPrice: 0,
            discountPerKg: 0,
            discountPercent: 0,
            unitOfMeasure: '',
        };
        setProperties({ ...properties, items });
    };

    const removeItem = (index: number) => {
        const items = [...properties.items];
        items.splice(index, 1);
        setProperties({ ...properties, items });
    };

    const UpdateInvoice = () => {
        const newInvoice = invoiceData.map((data: any) => {
            if (data.invoiceNumber === oldInvoiceNumber) return properties;
            return data;
        });

        writeFile(
            localStorage.getItem('invoice-database'),
            JSON.stringify(newInvoice),
            (res: string) => (window.location.hash = '/invoices')
        );
    };

    function calculateTotalPricePerItem(index: number) {
        const { qty, unitPrice, discountPercent, discountPerKg } =
            properties.items[index];
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
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            autoFocus
                            variant="filled"
                            label="Invoice No"
                            value={properties.invoiceNumber}
                            onChange={(e) =>
                                handleProperties(
                                    'invoiceNumber',
                                    e.target.value
                                )
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
                                value={properties.invoiceType}
                                onChange={(e: SelectChangeEvent) =>
                                    handleProperties(
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
                            value={properties.customer.id}
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
                            value={properties.customer.fullName}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            label="Address"
                            value={properties.customer.address}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            label=" Tax Id (NPWP)"
                            value={properties.customer.taxId}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            disabled
                            variant="filled"
                            label="Id Number (NIK)"
                            value={properties.customer.idNumber}
                        />
                    </Grid>
                </Grid>

                <p className="mb-10">Item(s)</p>

                {properties.items.map((_: any, index: number) => {
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
                                    value={properties.items[index].id}
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
                                    value={properties.items[index].qty}
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
                                    value={properties.items[index].itemName}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    label="Unit of Measure"
                                    value={
                                        properties.items[index].unitOfMeasure
                                    }
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    disabled
                                    variant="filled"
                                    label="Unit Price"
                                    value={properties.items[
                                        index
                                    ].unitPrice.toLocaleString('id-ID')}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type="number"
                                    variant="filled"
                                    label="Discount (%)"
                                    value={
                                        properties.items[index].discountPercent
                                    }
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
                                    label="Discount Each Kg"
                                    value={
                                        properties.items[index].discountPerKg
                                    }
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
                                    label="Total Price"
                                    value={properties.items[
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
                            onClick={() => (window.location.hash = '/invoices')}
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
        </div>
    );
};

export default EditInvoice;
