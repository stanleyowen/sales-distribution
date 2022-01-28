import React, { useEffect, useState } from 'react';
import { initializeApp } from '@firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    LinearProgress,
    CircularProgress,
} from '@mui/material';
import { MenuIcon } from '../lib/icons.component';
import '../scss/new-year.2021.scss';

// eslint-disable-next-line
const App = ({ auth, config }: any) => {
    const { loggedIn } = auth;

    const [properties, setProperties] = useState({
        pages: 5,
        currentPage: 1,
        duration: 0,
        progress: 0,
        volume: 100,
    });

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

        const themeURL = JSON.parse(
            localStorage.getItem('theme-session') || `{}`
        ).url;
        const backgroundElement = document.getElementById('backdrop-image');
        if (backgroundElement && themeURL)
            backgroundElement.style.background = `url(${themeURL})`;
    }, []); // eslint-disable-line

    function LightEffect() {
        const cirles = [];
        for (let i = 0; i < 100; i++) {
            cirles.push(
                <div className="circle-container">
                    <div className="circle"></div>
                </div>
            );
        }
        return cirles;
    }

    useEffect(() => {
        if (properties.currentPage === 2) {
            const page = document.querySelector(
                '.birthday-card'
            ) as HTMLElement;
            const cardCover = document.querySelector(
                '.card-cover'
            ) as HTMLElement;
            page.classList.add('rotated');
            cardCover.classList.add('flipped');
        }
    }, [properties.currentPage]);

    return (
        <div>
            {loggedIn ? (
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
            ) : (
                <div>
                    <LinearProgress />
                    <div className="backdrop-overlay"></div>
                    <div className="backdrop">
                        <div className="acrylic-material"></div>
                        <div
                            className="backdrop-image"
                            id="backdrop-image"
                        ></div>
                    </div>
                    <div className="bg-white login-container p-10 rounded-corner w-auto p-15">
                        <CircularProgress className="m-auto" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
