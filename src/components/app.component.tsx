import React, { useEffect, useState } from 'react';
import {
    Grid,
    Button,
    Select,
    Tooltip,
    MenuItem,
    TextField,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from '@mui/material';
import { readFile, writeFile } from '../lib/file-operation.lib';
import { AddIcon, CloseIcon, SaveIcon } from '../lib/icons.component';

type Props = {
    invoiceNumber: string;
    invoiceType: '00' | 'A00' | 'BC000' | 'D00' | 'E00' | '';
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
const App = () => {
    const [itemData, setItemData] = useState<Array<any>>([]);
    const [invoiceData, setInvoiceData] = useState<Array<any>>([]);
    const [customerData, setCustomerData] = useState<Array<any>>([]);
    const [properties, setProps] = useState<Props>({
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
        setProps({ ...properties, [id]: value });

    const handleCustomer = (id: string, value: string | number) =>
        setProps({
            ...properties,
            customer: { ...properties.customer, [id]: value },
        });

    const handleItems = (id: string, value: any, index: number) => {
        const items = [...properties.items];
        items[index][id] = isNaN(value) ? value : parseFloat(value);
        setProps({ ...properties, items });
    };

    useEffect(() => {
        document
            .querySelectorAll('.MuiTextField-root')
            .forEach((input: any) => {
                input.classList.add('w-100');
            });

        localStorage.getItem('item-database')
            ? readFile(localStorage.getItem('item-database'), (data: any) =>
                  setItemData(JSON.parse(data))
              )
            : null;

        localStorage.getItem('invoice-database')
            ? readFile(localStorage.getItem('invoice-database'), (data: any) =>
                  setInvoiceData(JSON.parse(data))
              )
            : null;

        localStorage.getItem('customer-database')
            ? readFile(localStorage.getItem('customer-database'), (data: any) =>
                  setCustomerData(JSON.parse(data))
              )
            : null;
    }, []); // eslint-disable-line

    useEffect(() => {
        if (invoiceData.length > 0 && properties.invoiceType) {
            const invoiceType: any[] = invoiceData.filter(
                (invoice: any) => invoice.invoiceType === properties.invoiceType
            );
            if (invoiceType.length > 0) {
                const { invoiceNumber } = invoiceType.sort(
                    (a: any, b: any) => b.invoiceNumber - a.invoiceNumber
                )[0];
                handleProperties('invoiceNumber', parseInt(invoiceNumber) + 1);
            }
        }
    }, [invoiceData, properties.invoiceType]);

    const SearchCustomerById = (id: string) => {
        customerData.forEach((customer: any) => {
            if (customer.id === Number(id))
                setProps({ ...properties, customer });
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
                setProps({ ...properties, items });
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
        setProps({ ...properties, items });
    };

    const removeItem = (index: number) => {
        const items = [...properties.items];
        items.splice(index, 1);
        setProps({ ...properties, items });
    };

    const SaveInvoice = () => {
        readFile(localStorage.getItem('invoice-database'), (invoice: any) => {
            writeFile(
                localStorage.getItem('invoice-database'),
                JSON.stringify([...JSON.parse(invoice), properties]),
                (res: string) => {
                    console.log(res);
                    window.location.hash = `/preview/${
                        properties.invoiceType + properties.invoiceNumber
                    }`;
                }
            );
        });
    };

    function calculateTotalPricePerItem(index: number) {
        const { qty, unitPrice, discountPercent, discountPerKg } =
            properties.items[index];
        const totalDiscountPercent =
            discountPercent > 0 ? (100 - discountPercent) / 100 : 1;
        const totalDiscountPerKg = discountPerKg * qty;
        const totalPrice =
            qty * unitPrice * totalDiscountPercent - totalDiscountPerKg;
        handleItems('totalPrice', Math.round(totalPrice), index);
    }

    return (
        <div>
            <div>
                <div className="mt-10 p-10">
                    <form onSubmit={() => SaveInvoice()}>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <TextField
                                    required
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
                                        required
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
                                        <MenuItem value="00">00</MenuItem>
                                        <MenuItem value="A00">A00</MenuItem>
                                        <MenuItem value="BC000">BC000</MenuItem>
                                        <MenuItem value="D00">D00</MenuItem>
                                        <MenuItem value="E00">E00</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                                <TextField
                                    required
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
                                            required
                                            type="number"
                                            label="Item Id"
                                            variant="filled"
                                            className="w-100"
                                            value={properties.items[index].id}
                                            onChange={(e) => {
                                                handleItems(
                                                    'id',
                                                    e.target.value,
                                                    index
                                                );
                                                SearchItemById(
                                                    e.target.value,
                                                    index
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            required
                                            type="number"
                                            variant="filled"
                                            label="Quantity"
                                            className="w-100"
                                            value={properties.items[index].qty}
                                            onChange={(e) => {
                                                handleItems(
                                                    'qty',
                                                    e.target.value,
                                                    index
                                                );
                                                calculateTotalPricePerItem(
                                                    index
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            disabled
                                            variant="filled"
                                            label="Item Name"
                                            className="w-100"
                                            value={
                                                properties.items[index].itemName
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            disabled
                                            variant="filled"
                                            className="w-100"
                                            label="Unit of Measure"
                                            value={
                                                properties.items[index]
                                                    .unitOfMeasure
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            disabled
                                            variant="filled"
                                            className="w-100"
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
                                            className="w-100"
                                            label="Discount (%)"
                                            value={
                                                properties.items[index]
                                                    .discountPercent
                                            }
                                            onChange={(e) => {
                                                handleItems(
                                                    'discountPercent',
                                                    e.target.value,
                                                    index
                                                );
                                                calculateTotalPricePerItem(
                                                    index
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            type="number"
                                            variant="filled"
                                            className="w-100"
                                            label="Discount Each Kg"
                                            value={
                                                properties.items[index]
                                                    .discountPerKg
                                            }
                                            onChange={(e) => {
                                                handleItems(
                                                    'discountPerKg',
                                                    e.target.value,
                                                    index
                                                );
                                                calculateTotalPricePerItem(
                                                    index
                                                );
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            disabled
                                            variant="filled"
                                            className="w-100"
                                            label="Total Price"
                                            value={properties.items[
                                                index
                                            ].totalPrice.toLocaleString(
                                                'id-ID'
                                            )}
                                        />
                                    </Grid>
                                    {index === 0 ? null : (
                                        <Grid item>
                                            <Tooltip title="Remove Item">
                                                <Button
                                                    color="warning"
                                                    className="h-100"
                                                    variant="outlined"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                >
                                                    <CloseIcon
                                                        width="2em"
                                                        height="2em"
                                                    />
                                                </Button>
                                            </Tooltip>
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

                        <Button
                            type="submit"
                            variant="contained"
                            className="w-100"
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
