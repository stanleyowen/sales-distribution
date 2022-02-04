import React, { useEffect, useState } from 'react';
import { initializeApp } from '@firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
    Box,
    TextField,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    LinearProgress,
    CircularProgress,
    Grid,
    Select,
    MenuItem,
    SelectChangeEvent,
    InputLabel,
    FormControl,
} from '@mui/material';
import CustomerDatabase from '../customer-data.json';
import { MenuIcon } from '../lib/icons.component';

// eslint-disable-next-line
const App = ({ auth, config }: any) => {
    const { loggedIn } = auth;

    return (
        <div>
            <div></div>
        </div>
    );
};

export default App;
