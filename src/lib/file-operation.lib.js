import React from 'react';
const fs = window.require('fs');

export function readFile(filePath, callback) {
    let values = '';

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        values = data.toString();
        return callback(values);
    });
}
