import React, { useEffect, useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from '@mui/material';

// eslint-disable-next-line
const Navbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Tax
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/')}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/invoices')}
                    >
                        Invoices
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/items')}
                    >
                        Item DB
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/customers')}
                    >
                        Customer DB
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/setup')}
                    >
                        Config
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
