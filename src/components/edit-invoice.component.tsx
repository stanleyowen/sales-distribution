import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Grid,
    Alert,
    Button,
    Select,
    Dialog,
    Tooltip,
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
    FileIcon,
    ExcelIcon,
    CloseIcon,
    DeleteIcon,
    PrintIcon,
} from '../lib/icons.component';
import { readFile, writeFile, openFilePath } from '../lib/file-operation.lib';

type Data = {
    invoiceDate: Date | null;
    invoiceNumber: number;
    invoiceType: '00' | 'A00' | 'B00' | 'BC000' | 'D00' | 'E00' | 'NR00' | '';
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
    isDuplicate: boolean;
    dialogIsOpen: boolean;
};

// eslint-disable-next-line
const EditInvoice = () => {
    const { id } = useParams();
    const [itemData, setItemData] = useState<Array<any>>([]);
    const [invoiceData, setInvoiceData] = useState<Array<any>>([]);
    const [customerData, setCustomerData] = useState<Array<any>>([]);
    const [oldInvoiceNumber, setOldInvoiceNumber] = useState<string>('');
    const [properties, setProps] = useState<Props>({
        isLoading: true,
        isDuplicate: false,
        dialogIsOpen: false,
    });
    const [data, setData] = useState<Data>({
        invoiceDate: new Date(),
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

    const handleItems = (id: string, value: any, index: number) => {
        const items = [...data.items];
        items[index][id] = isNaN(value) ? value : parseFloat(value);
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
                (invoice: any) =>
                    invoice.invoiceType + invoice.invoiceNumber === id
            );

            setInvoiceData(JSON.parse(data));
            setData(invoice);
            setOldInvoiceNumber(invoice.invoiceType + invoice.invoiceNumber);

            handleProperties('isLoading', false);
        });
    }, []);

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
            (invoice: Data) =>
                invoice.invoiceType + invoice.invoiceNumber === oldInvoiceNumber
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
        let isDuplicate = false;
        const newInvoice = invoiceData.map((invoice: any) => {
            if (
                oldInvoiceNumber !== data.invoiceType + data.invoiceNumber &&
                data.invoiceType + data.invoiceNumber ===
                    invoice.invoiceType + invoice.invoiceNumber
            ) {
                isDuplicate = true;
                handleProperties('isDuplicate', true);
            }
            if (
                invoice.invoiceType + invoice.invoiceNumber ===
                oldInvoiceNumber
            )
                return data;
            return invoice;
        });

        if (!isDuplicate) {
            writeFile(
                localStorage.getItem('invoice-database'),
                JSON.stringify(newInvoice),
                () => (window.location.hash = '/invoices')
            );
        }
    };

    function RevealDocuments(type: 'xlsx' | 'pdf') {
        const path = localStorage.getItem('excel-template');
        const parentDir = path?.substring(0, path?.lastIndexOf('\\'));
        openFilePath(parentDir + '\\tmp\\' + oldInvoiceNumber + '.' + type);
    }

    function calculateTotalPricePerItem(index: number) {
        const { qty, unitPrice, discountPercent, discountPerKg } =
            data.items[index];
        const totalDiscountPercent =
            discountPercent > 0 ? (100 - discountPercent) / 100 : 1;
        const totalDiscountPerKg = discountPerKg * qty;
        const totalPrice =
            qty * unitPrice * totalDiscountPercent - totalDiscountPerKg;
        handleItems('totalPrice', Math.round(totalPrice), index);
    }

    return (
        <div>
            <form className="mt-10 p-10" onSubmit={() => UpdateInvoice()}>
                {properties.isDuplicate ? (
                    <Alert severity="error" className="w-100 border-box mb-10">
                        Invoice number {data.invoiceType + data.invoiceNumber}{' '}
                        already exists. Please try another invoice number.
                    </Alert>
                ) : null}
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            required
                            type="number"
                            variant="filled"
                            label="Invoice No"
                            id="invoice-number"
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
                                required
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
                                <MenuItem value="00">00</MenuItem>
                                <MenuItem value="A00">A00</MenuItem>
                                <MenuItem value="B00">B00</MenuItem>
                                <MenuItem value="BC000">BC000</MenuItem>
                                <MenuItem value="D00">D00</MenuItem>
                                <MenuItem value="E00">E00</MenuItem>
                                <MenuItem value="NR00">NR00</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            required
                            type="date"
                            variant="filled"
                            label="Invoice Date"
                            value={data.invoiceDate}
                            onChange={(e) =>
                                handleData('invoiceDate', e.target.value)
                            }
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            required
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
                                    required
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
                                    required
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
                                    <Tooltip title="Remove Item">
                                        <Button
                                            color="warning"
                                            className="h-100"
                                            variant="outlined"
                                            onClick={() => removeItem(index)}
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

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            className="w-100"
                            startIcon={<FileIcon />}
                            onClick={() => RevealDocuments('pdf')}
                        >
                            Reveal PDF
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            className="w-100"
                            startIcon={<ExcelIcon />}
                            onClick={() => RevealDocuments('xlsx')}
                        >
                            Reveal XLSX
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            className="w-100 mb-10"
                            startIcon={<PrintIcon />}
                            onClick={() =>
                                (window.location.hash = `/preview/${id}`)
                            }
                        >
                            Print
                        </Button>
                    </Grid>
                </Grid>

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
                            type="submit"
                            variant="contained"
                            className="w-100"
                            startIcon={<SaveIcon />}
                        >
                            Update
                        </Button>
                    </Grid>
                </Grid>
            </form>

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
