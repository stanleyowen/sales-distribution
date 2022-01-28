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
