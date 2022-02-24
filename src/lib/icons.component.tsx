import React from 'react';

export function MenuIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"
                fill="currentColor"
            ></path>
        </svg>
    );
}

export function UploadIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                d="M9 16v-6H5l7-7l7 7h-4v6H9m-4 4v-2h14v2H5z"
                fill="currentColor"
            ></path>
        </svg>
    );
}

export function FileIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6z"
                fill="currentColor"
            ></path>
        </svg>
    );
}

export function AddIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z"
            ></path>
        </svg>
    );
}

export function CloseIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            ></path>
        </svg>
    );
}

export function SaveIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z"
            ></path>
        </svg>
    );
}

export function DeleteIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"
            ></path>
        </svg>
    );
}
