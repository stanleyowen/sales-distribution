import React, { useState } from 'react';
import { Alert, Slide, Snackbar, SlideProps, Button } from '@mui/material';

const ipcRenderer = window.require('electron').ipcRenderer;
type TransitionProps = Omit<SlideProps, 'direction'>;

// eslint-disable-next-line
const Notification = () => {
    const [isOpen, setOpen] = useState<boolean>(true);

    const [transition, setTransition] = useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    return (
        <Snackbar open={isOpen} TransitionComponent={transition}>
            <Alert severity="info">
                <p>
                    An updated version of SD App is available and will be
                    installed at the next launch. See{' '}
                    <a href="https://github.com/stanleyowen/sales-distribution/releases">
                        what&#39;s new
                    </a>
                    .
                </p>
                <Button>Later</Button>
                <Button>Restart SD App</Button>
            </Alert>
        </Snackbar>
    );
};

export default Notification;
