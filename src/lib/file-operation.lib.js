import React from 'react';
const fs = window.require('fs');
const { shell } = window.require('electron');

export function readFile(filePath, callback) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        return callback(data.toString());
    });
}

export function writeFile(filePath, content, callback) {
    fs.writeFile(filePath, String(content), (err) => {
        if (err) throw err;
        return callback('Write Operation Successful');
    });
}

export function openFilePath(filePath) {
    shell.showItemInFolder(filePath);
}
