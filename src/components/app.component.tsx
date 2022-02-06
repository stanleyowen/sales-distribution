import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    FormControl,
} from '@mui/material';

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

// fs.writeFile('./data.json', 'Hey there!', function () {
//     console.log('The file was saved!');
// });

// eslint-disable-next-line
const App = () => {
    const [properties, setProperties] = useState<Props>({
        invoiceNumber: '',
        invoiceType: '',
        name: '',
        address: '',
        NIK: '',
        NPWP: '',
        items: [{ name: '', price: '', qty: '' }],
    });
    const [data, setData] = useState<any>([]);

    readFile((result: any) => setData(result));
    console.log(data);

    const handleProperties = (id: string, value: string) =>
        setProperties({ ...properties, [id]: value });

    useEffect(() => {
        document
            .querySelectorAll('.MuiTextField-root')
            .forEach((input: any) => {
                input.classList.add('w-100');
            });
    }, []); // eslint-disable-line

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
                        <Grid item xs={5}>
                            <TextField
                                variant="filled"
                                label="Item Name"
                                value={properties.items[0].name}
                                onChange={(e) =>
                                    handleProperties(
                                        'items[0].name',
                                        e.target.value
                                    )
                                }
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
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
                        <Grid item xs={2}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel id="invoice-type">Unit</InputLabel>
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
                                    <MenuItem value="KRG">KRG</MenuItem>
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="BC">BC</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
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
                    </Grid>
                </div>
            </div>
        </div>
    );
};

export default App;
