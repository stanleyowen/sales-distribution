import React, { useEffect, useState } from 'react';
import {
    Alert,
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
    isDuplicate: boolean;
    itemDialogIsOpen: boolean;
};

type ItemData = {
    id: number;
    itemName: string;
    unitPrice: string;
    properties?: {
        isUpdate?: boolean;
    };
};

// eslint-disable-next-line
const Items = () => {
    const [data, setData] = useState<Array<any>>([]);
    const [properties, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
        isDuplicate: false,
        itemDialogIsOpen: false,
    });
    const [itemData, setItemData] = useState<ItemData>({
        id: 0,
        itemName: '',
        unitPrice: '',
        properties: {
            isUpdate: false,
        },
    });

    const handleProperties = (id: string, value: number | boolean) =>
        setProps({ ...properties, [id]: value });
    const handleItemData = (id: string, value: string | number) =>
        setItemData({ ...itemData, [id]: value });

    const columns = [
        { id: 'id', label: 'Id' },
        { id: 'itemName', label: 'Item Name' },
        { id: 'unitOfMeasure', label: 'Unit of Measure' },
        { id: 'unitPrice', label: 'Unit Price' },
    ];

    function readItemDatabase() {
        readFile(localStorage.getItem('item-database'), (data: any) =>
            setData(JSON.parse(data))
        );
    }

    function closeItemDialog() {
        setProps({
            ...properties,
            isDuplicate: false,
            itemDialogIsOpen: false,
        });
        setItemData({
            id: data?.length + 1,
            itemName: '',
            unitPrice: '',
            properties: {
                isUpdate: false,
            },
        });
    }

    useEffect(() => readItemDatabase(), []);
    useEffect(() => {
        handleItemData('id', data.length + 1);
    }, [data]);

    const addItemData = () => {
        if (itemData?.properties?.isUpdate) {
            const newData = data
                .map((item: ItemData) => {
                    if (item.id === itemData.id) return itemData;
                    return item;
                })
                .sort((a: ItemData, b: ItemData) => a.id - b.id);

            delete itemData.properties;

            writeFile(
                localStorage.getItem('item-database'),
                JSON.stringify(newData),
                (res: string) => console.log(res)
            );
        } else {
            if (data.find((item: ItemData) => item.id == itemData.id)) {
                document.getElementById('id')?.focus();
                return handleProperties('isDuplicate', true);
            } else {
                const sortedData = JSON.stringify(
                    [...data, itemData].sort(
                        (a: ItemData, b: ItemData) => a.id - b.id
                    )
                );

                delete itemData.properties;

                writeFile(
                    localStorage.getItem('item-database'),
                    sortedData,
                    (res: string) => console.log(res)
                );
            }
        }

        closeItemDialog();
        readItemDatabase();
    };

    const UpdateItemData = (data: ItemData) => {
        handleProperties('itemDialogIsOpen', true);
        setItemData({
            ...data,
            properties: { isUpdate: true },
        });
    };

    const DeleteItemData = () => {
        const newData = data.filter((item: ItemData) => {
            return item.id !== itemData.id;
        });
        writeFile(
            localStorage.getItem('item-database'),
            JSON.stringify(newData),
            () => {
                closeItemDialog();
                readItemDatabase();
            }
        );
    };

    return (
        <div>
            <Button
                variant="contained"
                className="mt-10 ml-10"
                onClick={() => handleProperties('itemDialogIsOpen', true)}
            >
                Add Item
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
                                    properties.page * properties.rowsPerPage,
                                    properties.page * properties.rowsPerPage +
                                        properties.rowsPerPage
                                )
                                .map((item: any) => {
                                    return (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            onClick={() => UpdateItemData(item)}
                                        >
                                            {columns.map((column: any) => {
                                                return (
                                                    <TableCell key={column.id}>
                                                        {column.id ===
                                                        'unitPrice'
                                                            ? item[
                                                                  column.id
                                                              ].toLocaleString(
                                                                  'id-ID'
                                                              )
                                                            : item[column.id]}
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
                open={properties.itemDialogIsOpen}
                onClose={() => closeItemDialog()}
            >
                <DialogTitle>Update Item&#39;s Details</DialogTitle>
                <DialogContent>
                    {properties.isDuplicate ? (
                        <Alert
                            severity="error"
                            className="w-100 border-box mb-10"
                        >
                            Item Id {itemData.id} already exists. Please try
                            another Item Id.
                        </Alert>
                    ) : null}
                    {Object.keys(columns).map((_, index: number) => {
                        const { id, label } = columns[index];
                        return (
                            <TextField
                                fullWidth
                                id={id}
                                type={label === 'Id' ? 'number' : 'text'}
                                key={index}
                                label={label}
                                margin="dense"
                                variant="standard"
                                autoFocus={index === 1}
                                value={(itemData as any)[id]}
                                onChange={(e) =>
                                    handleItemData(id, e.target.value)
                                }
                                disabled={
                                    label === 'Id' &&
                                    itemData.properties?.isUpdate
                                }
                            />
                        );
                    })}
                </DialogContent>
                <DialogActions>
                    {itemData?.properties?.isUpdate ? (
                        <Button onClick={() => DeleteItemData()} color="error">
                            Delete
                        </Button>
                    ) : null}
                    <Button onClick={() => closeItemDialog()}>Cancel</Button>
                    <Button onClick={() => addItemData()}>
                        {itemData?.properties?.isUpdate ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Items;
