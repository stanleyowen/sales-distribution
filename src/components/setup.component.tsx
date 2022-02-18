import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FileIcon, UploadIcon } from '../lib/icons.component';
import { openFilePath } from '../lib/file-operation.lib';

const { ipcRenderer } = window.require('electron');
const Input = styled('input')({
    display: 'none',
});

// eslint-disable-next-line
const Setup = () => {
    const [isLoading, setLoading] = useState<boolean>(false);

    const SetupData = () => {
        setLoading(true);

        const customerDatabaseFiles = document.getElementById(
            'upload-customer-database'
        ) as any;
        const itemDatabaseFiles = document.getElementById(
            'upload-item-database'
        ) as any;

        if (customerDatabaseFiles.files.length > 0) {
            ipcRenderer.send(
                'store-data',
                JSON.stringify({
                    id: 'customer-database',
                    value: customerDatabaseFiles.files[0].path,
                })
            );
        }

        if (itemDatabaseFiles.files.length > 0) {
            ipcRenderer.send(
                'store-data',
                JSON.stringify({
                    id: 'item-database',
                    value: itemDatabaseFiles.files[0].path,
                })
            );
        }

        setLoading(false);
    };

    const OpenFilePath = (localStorageKey: string) => {
        const filePath = localStorage.getItem(localStorageKey);
        if (filePath) openFilePath(filePath);
    };

    return (
        <div className="m-20">
            <Grid container spacing={2} className="mb-10">
                <Grid item xs={7}>
                    Customer Database/Database Pengguna <i>(.json)</i>
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="upload-customer-database">
                        <Input id="upload-customer-database" type="file" />
                        <Button variant="contained" component="span">
                            <UploadIcon />
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        component="span"
                        className="ml-10"
                        onClick={() => OpenFilePath('customer-database')}
                    >
                        <FileIcon />
                    </Button>
                </Grid>

                <Grid item xs={7}>
                    Items Database/Database Barang <i>(.json)</i>
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="upload-item-database">
                        <Input id="upload-item-database" type="file" />
                        <Button variant="contained" component="span">
                            <UploadIcon />
                        </Button>
                    </label>
                    <Button
                        variant="contained"
                        component="span"
                        className="ml-10"
                        onClick={() => OpenFilePath('item-database')}
                    >
                        <FileIcon />
                    </Button>
                </Grid>
            </Grid>

            <LoadingButton
                color="primary"
                variant="contained"
                loading={isLoading}
                onClick={() => SetupData()}
            >
                Upload
            </LoadingButton>
        </div>
    );
};

export default Setup;
