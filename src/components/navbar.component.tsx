import React, { useEffect, useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { MenuIcon } from '../lib/icons.component';

// eslint-disable-next-line
const Navbar = ({}: any) => {
    return (
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
