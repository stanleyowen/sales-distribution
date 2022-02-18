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

export function SearchIcon(
    props: React.SVGProps<SVGSVGElement> | null | undefined
) {
    return (
        <svg width="2em" height="2em" viewBox="0 0 24 24" {...props}>
            <path
                fill="currentColor"
                d="M9.5 4a6.5 6.5 0 0 1 4.932 10.734l5.644 5.644l-.707.707l-5.645-5.645A6.5 6.5 0 1 1 9.5 4Zm0 1a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11Z"
            ></path>
        </svg>
    );
}
