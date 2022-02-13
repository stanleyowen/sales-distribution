import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/material';
import { UploadIcon } from '../lib/icons.component';
const { ipcRenderer } = window.require('electron');

const Input = styled('input')({
    display: 'none',
});

const SetupData = () => {
    const uploadedFiles = document.getElementById(
        'upload-customer-database'
    ) as any;
    if (uploadedFiles.files.length > 0) {
        ipcRenderer.send(
            'store-data',
            JSON.stringify({
                id: 'customer-database',
                value: uploadedFiles.files[0].path,
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
                    Customer Database
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="upload-customer-database">
                        <Input id="upload-customer-database" type="file" />
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
                Next
            </Button>
        </div>
    );
};

export default Setup;
