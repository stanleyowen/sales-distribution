import React from 'react';
import PackageInfo from '../../package.json';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

// eslint-disable-next-line
const Navbar = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Sales & Distribution
                        <sub className="small"> v{PackageInfo.version}</sub>
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
                        Item
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => (window.location.hash = '/customers')}
                    >
                        Customer
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
