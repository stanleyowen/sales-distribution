import React, { useEffect, useState } from 'react';
import { Alert, Slide, Snackbar, SlideProps, Button } from '@mui/material';

const ipcRenderer = window.require('electron').ipcRenderer;
type TransitionProps = Omit<SlideProps, 'direction'>;

// eslint-disable-next-line
const Notification = () => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const [transition, setTransition] = useState<
        React.ComponentType<TransitionProps> | undefined
    >(undefined);

    useEffect(() => {
        function Transition(props: TransitionProps) {
            return <Slide {...props} direction="right" />;
        }
        setTransition(() => Transition);

        ipcRenderer.on('update_downloaded', () => {
            ipcRenderer.removeAllListeners('update_downloaded');
            setOpen(true);
        });
    }, []);

    return (
        <Snackbar open={isOpen} TransitionComponent={transition}>
            <Alert severity="info">
                <p>
                    An updated version of SD Desktop is available and will be
                    installed at the next launch. See{' '}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/stanleyowen/sales-distribution/releases/latest"
                    >
                        what&#39;s new
                    </a>
                    .
                </p>
                <Button>Later</Button>
                <Button onClick={() => ipcRenderer.send('restart_app')}>
                    Restart App
                </Button>
            </Alert>
        </Snackbar>
    );
};

export default Notification;
