import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Grid } from '@mui/material';
import { UploadIcon } from '../lib/icons.component';

const Input = styled('input')({
    display: 'none',
});

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
            <Button variant="contained" color="primary">
                Next
            </Button>
        </div>
    );
};

export default Setup;
