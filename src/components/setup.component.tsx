import React from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/material';
import { UploadIcon } from '../lib/icons.component';
const { ipcRenderer } = window.require('electron');

const Input = styled('input')({
    display: 'none',
});

const SetupData = () => {
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
};

// eslint-disable-next-line
const Setup = ({}: any) => {
    return (
        <div className="m-20">
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    Customer Database / Database Pengguna
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="upload-customer-database">
                        <Input id="upload-customer-database" type="file" />
                        <Button variant="contained" component="span">
                            <UploadIcon />
                        </Button>
                    </label>
                </Grid>

                <Grid item xs={7}>
                    Items Database / Database Barang
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="upload-item-database">
                        <Input id="upload-item-database" type="file" />
                        <Button variant="contained" component="span">
                            <UploadIcon />
                        </Button>
                    </label>
                </Grid>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                onClick={() => SetupData()}
            >
                Upload
            </Button>
        </div>
    );
};

export default Setup;
