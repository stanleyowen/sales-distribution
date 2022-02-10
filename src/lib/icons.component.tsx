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
