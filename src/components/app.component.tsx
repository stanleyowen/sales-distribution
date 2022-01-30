import React, { useEffect, useState } from 'react';
import { initializeApp } from '@firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
    Box,
    TextField,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    LinearProgress,
    CircularProgress,
    Grid,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    FormControl,
} from '@mui/material';
import { MenuIcon } from '../lib/icons.component';
import '../scss/new-year.2021.scss';

// eslint-disable-next-line
const App = ({ auth, config }: any) => {
    const { loggedIn } = auth;

    const [properties, setProperties] = useState({
        invoiceNo: '',
        invoiceType: '',
        name: '',
        address: '',
        NIK: '',
        NPWP: '',
        items: [{ name: '', price: '', qty: '' }],
    });

    const handleProperties = (id: string, value: string) =>
        setProperties({ ...properties, [id]: value });

    useEffect(() => {
        initializeApp(config);

        window.onerror = (msg, url, lineNo, columnNo, error) => {
            addDoc(collection(getFirestore(), 'logs'), {
                url: String(url),
                error: String(error),
                message: String(msg),
                location: String(lineNo) + ' ' + String(columnNo),
            });
        };

        document
            .querySelectorAll('.MuiTextField-root')
            .forEach((input: any) => {
                input.classList.add('w-100');
            });
    }, []); // eslint-disable-line

    return (
        <div>
            <div>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1 }}
                            >
                                News
                            </Typography>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
                <div className="mt-10 p-10">
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <TextField
                                variant="filled"
                                label="Invoice No"
                                value={properties.invoiceNo}
                                onChange={(e) =>
                                    handleProperties(
                                        'invoiceNo',
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
                                    <MenuItem value="">Auto</MenuItem>
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="BC">BC</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
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
                            <TextField
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
