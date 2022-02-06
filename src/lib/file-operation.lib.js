import React from 'react';
const fs = window.require('fs');

export function readFile(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        return callback(data.toString());
    });
}

export function writeFile(filePath, content, callback) {
    fs.writeFile(filePath, String(content), (err) => {
        if (err) throw err;
        return callback('User Added Successfully');
    });
}
