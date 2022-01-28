import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { initializeApp } from '@firebase/app';
import { getTokenValue } from './lib/functions.component';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { onSnapshot, getFirestore, doc } from 'firebase/firestore';

import Auth from './components/auth.component';
import AppLayout from './components/app.component';

process.env.NODE_ENV === 'production'
    ? require('./App.min.css')
    : require('./App.css');

interface EnvConfiguration {
    apiKey: string | undefined;
    authDomain: string | undefined;
    projectId: string | undefined;
    appId: string | undefined;
    measurementId: string | undefined;
}

// eslint-disable-next-line
export default function App() {
    const [auth, setAuth] = useState<{
        isLoading: boolean;
        loggedIn: boolean;
    }>({
        isLoading: true,
        loggedIn: false,
    });

    const config: EnvConfiguration = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        appId: process.env.REACT_APP_ID,
        measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    };

    const [song, setSong] = useState({
        playing: false,
        image: 'https://i.scdn.co/image/ab67616d0000b273d078f2a1f15f6e3adc59c32b',
        audio: new Audio(
            'https://firebasestorage.googleapis.com/v0/b/production-6db88.appspot.com/o/29652de89c665c169b383e591847f744.mp3?alt=media&token=6fb8df0f-4803-4be9-bd46-9206ed7665b6'
        ),
    });

    useEffect(() => {
        initializeApp(config);
        const userEmail = getTokenValue('email')?.split('@')[0] + '-token';
        const userToken = getTokenValue('token');
        if (userEmail && userToken)
            onSnapshot(
                doc(getFirestore(), 'thalia-tiffany', String(userEmail)),
                (token) => {
                    if (
                        token &&
                        token.data() &&
                        String(token.data()?.token) === userToken
                    )
                        setAuth({
                            isLoading: false,
                            loggedIn: true,
                        });
                    else
                        handleCredential({
                            id: 'isLoading',
                            value: false,
                        });
                }
            );
        else handleCredential({ id: 'isLoading', value: false });

        onAuthStateChanged(getAuth(), () => {
            // Leave it blank
        });
    }, []);

    useEffect(() => {
        const { isLoading, loggedIn } = auth;
        if (!isLoading) {
            if (!loggedIn && !window.location.pathname.startsWith('/auth'))
                location.href = '/auth';
            else if (loggedIn && window.location.pathname.startsWith('/auth'))
                location.href = '/';
        }
    }, [auth]);

    const handleCredential = useCallback((a) => {
        if (a.id && a.value) setAuth({ ...auth, [a.id]: a.value });
        else setAuth(a);
    }, []);

    const handleSong = useCallback(
        (a) => {
            setSong({ ...song, [a.id]: a.value });
        },
        [song]
    );

    useEffect(() => {
        song.playing ? song.audio.play() : song.audio.pause();
    }, [song]);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <AppLayout
                            auth={auth}
                            config={config}
                            song={song}
                            handleSong={handleSong}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}
