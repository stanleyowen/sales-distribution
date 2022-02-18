import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    Button,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    FormControl,
} from '@mui/material';
import { AddIcon } from '../lib/icons.component';
import { readFile } from '../lib/file-operation.lib';

type Props = {
    invoiceNumber: string;
    invoiceType: 'Auto' | 'A' | 'BC' | '';
    name: string;
    address: string;
    NIK: string;
    NPWP: string;
    items: any;
};

// eslint-disable-next-line
const App = () => {
    const [data, setData] = useState<Array<any>>([]);
    const [properties, setProperties] = useState<Props>({
        invoiceNumber: '',
        invoiceType: '',
        name: '',
        address: '',
        NIK: '',
        NPWP: '',
        items: [
            {
                id: 0,
                qty: 0,
                itemName: '',
                unitPrice: 0,
                totalPrice: 0,
                unitOfMeasure: '',
            },
        ],
    });

    const handleProperties = (id: string, value: string | number) => {
        setProperties({ ...properties, [id]: value });
    };

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
            setData(JSON.parse(data))
        );
    }, []); // eslint-disable-line

    const SearchItemById = (id: string, index: number) => {
        data.forEach((item: any) => {
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
            unitOfMeasure: '',
        };
        setProperties({ ...properties, items });
    };

    return (
        <div>
            <div>
                <div className="mt-10 p-10">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
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
                    </Grid>

                    <p className="mt-10 mb-10">Item(s)</p>

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
                                            SearchItemById(
                                                e.target.value,
                                                index
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <TextField
                                        type="number"
                                        variant="filled"
                                        label="Quantity"
                                        value={properties.items[index].qty}
                                        onChange={(e) => {
                                            const totalPrice =
                                                Number(e.target.value) *
                                                properties.items[index]
                                                    .unitPrice;

                                            handleItems(
                                                'qty',
                                                e.target.value,
                                                index
                                            );

                                            handleItems(
                                                'totalPrice',
                                                totalPrice,
                                                index
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
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
                                            properties.items[index]
                                                .unitOfMeasure
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
                                <Grid item xs={2}>
                                    <TextField
                                        disabled
                                        variant="filled"
                                        label="Total Price"
                                        value={properties.items[
                                            index
                                        ].totalPrice.toLocaleString('id-ID')}
                                    />
                                </Grid>
                            </Grid>
                        );
                    })}

                    <Button
                        variant="contained"
                        className="w-100"
                        startIcon={<AddIcon />}
                        onClick={() => AddItem()}
                    >
                        Add Items
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default App;
