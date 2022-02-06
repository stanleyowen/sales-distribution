import React from 'react';
const fs = window.require('fs');

export function readFile(callback) {
    let values = '';

    fs.readFile(
        process.env.NODE_ENV === 'development'
            ? `./public/db/customer-data.json`
            : `../build/db/customer-data.json`,
        'utf-8',
        (err, data) => {
            if (err) throw err;
            values = data.toString();
            return callback(values);
        }
    );
}
