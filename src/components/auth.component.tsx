import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { generateToken } from '../lib/functions.component';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { LoadingButton } from '@mui/lab';
import { Alert, Slide, Snackbar, SlideProps } from '@mui/material';

type TransitionProps = Omit<SlideProps, 'direction'>;

const About = ({ config, handleCredential }: any) => {
    initializeApp(config);
    const whiteListedEmails: string[] | undefined =
        process.env.REACT_APP_WHITELISTED_EMAIL?.split(', ');
    const [status, setStatus] = useState<{
        isError: boolean;
        message:
            | null
            | 'Invalid Credentials'
            | 'Something Went Wrong. Please Try Again Later.'
            | 'No Whitelisted Emails are Found.';
    }>({
        isError: false,
        message: 'Invalid Credentials',
    });
    const [isLoading, setLoading] = useState<boolean>(false);
    const [transition, setTransition] = useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    useEffect(() => {
        for (let i = 0; i < 79; i++) {
            const div = document.createElement('div');
            div.style.opacity = `${Math.random() * (0.075 - 0.025) + 0.025}`;
            document.querySelector('.backdrop-overlay')?.appendChild(div);
        }
    }, []);

    return (
        <div>
            <div className="backdrop-overlay"></div>
            <div className="backdrop">
                <div className="acrylic-material"></div>
                <div className="backdrop-image" id="backdrop-image"></div>
            </div>

            <div className="bg-white login-container p-10 rounded-corner">
                <h3 className="center-align mb-10">Welcome Back!</h3>
                <LoadingButton
                    color="error"
                    variant="outlined"
                    className="mt-10 w-100"
                    loading={isLoading}
                    onClick={() => {
                        setLoading(true);
                        signInWithPopup(getAuth(), new GoogleAuthProvider())
                            .then((result) => {
                                function Transition(props: TransitionProps) {
                                    return (
                                        <Slide {...props} direction="right" />
                                    );
                                }
                                setTransition(() => Transition);
                                if (result) {
                                    if (whiteListedEmails)
                                        whiteListedEmails.forEach(
                                            (email, index) => {
                                                if (
                                                    result.user.email === email
                                                ) {
                                                    generateToken(
                                                        result.user.email
                                                    );
                                                    handleCredential({
                                                        id: 'isLoading',
                                                        value: false,
                                                    });
                                                } else if (
                                                    index ===
                                                    whiteListedEmails.length - 1
                                                ) {
                                                    setLoading(false);
                                                    setStatus({
                                                        isError: true,
                                                        message:
                                                            'Invalid Credentials',
                                                    });
                                                    handleCredential({
                                                        id: 'isLoading',
                                                        value: false,
                                                    });
                                                }
                                            }
                                        );
                                    else {
                                        setLoading(false);
                                        setStatus({
                                            isError: true,
                                            message:
                                                'No Whitelisted Emails are Found.',
                                        });
                                        setTimeout(
                                            () =>
                                                setStatus({
                                                    isError: false,
                                                    message: null,
                                                }),
                                            5000
                                        );
                                    }
                                } else {
                                    setLoading(false);
                                    setStatus({
                                        isError: true,
                                        message:
                                            'Something Went Wrong. Please Try Again Later.',
                                    });
                                    setTimeout(
                                        () =>
                                            setStatus({
                                                isError: false,
                                                message: null,
                                            }),
                                        5000
                                    );
                                }
                            })
                            .catch(() => {
                                setLoading(false);
                                setStatus({
                                    isError: true,
                                    message:
                                        'Something Went Wrong. Please Try Again Later.',
                                });
                                setTimeout(
                                    () =>
                                        setStatus({
                                            isError: false,
                                            message: null,
                                        }),
                                    5000
                                );
                            });
                    }}
                >
                    Sign in with Google
                </LoadingButton>
            </div>

            <Snackbar open={status.isError} TransitionComponent={transition}>
                <Alert severity="error">{status.message}</Alert>
            </Snackbar>
        </div>
    );
};

export default About;
