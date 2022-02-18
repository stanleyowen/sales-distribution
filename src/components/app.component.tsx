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
import { SearchIcon } from '../lib/icons.component';
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
        items: [{ id: 0, name: '', price: '', qty: '' }],
    });

    const handleProperties = (id: string, value: string) => {
        setProperties({ ...properties, [id]: value });
    };

    const handleItems = (id: string, value: string, index: number) => {
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
                const itemNameVariable = `properties.items[${index}].name`;
                const itemNameValue = item.itemName;
                handleProperties(itemNameVariable, itemNameValue);
            }
        });
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

                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <TextField
                                type="number"
                                variant="filled"
                                label="Item Id"
                                value={properties.items[0].id}
                                onChange={(e) =>
                                    handleItems('id', e.target.value, 0)
                                }
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                className="h-100"
                                variant="contained"
                                onClick={() =>
                                    SearchItemById(properties.items[0].id, 0)
                                }
                            >
                                <SearchIcon />
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                type="number"
                                variant="filled"
                                label="Quantity"
                                value={properties.items[0].qty}
                                onChange={(e) =>
                                    handleProperties(
                                        'items[0].qty',
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                variant="filled"
                                label="Item Name"
                                value={properties.items[0].qty}
                                onChange={(e) =>
                                    handleProperties(
                                        'items[0].qty',
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                disabled
                                variant="filled"
                                label="Quantity"
                                value={properties.invoiceType}
                                onChange={(e) =>
                                    handleProperties(
                                        'invoiceType',
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default App;
