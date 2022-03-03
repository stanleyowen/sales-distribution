import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { executePython } from '../lib/executePy.lib';
import { createFolder } from '../lib/file-operation.lib';
const xlsx = window.require('exceljs');

// eslint-disable-next-line
const Preview = ({}: any) => {
    const { id } = useParams();
    function readExcelFile(filePath: string, callback: any) {
        const workbook = new xlsx.Workbook();
        workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet(1);
            worksheet.getCell('H4').value = 'Abang Jago';
            const dir = filePath.substring(0, filePath.lastIndexOf('\\'));
            createFolder(dir, '/tmp/', () => {
                executePython(localStorage.getItem('excel-template') ?? '');
            });
            callback(worksheet);
        });
    }

    readExcelFile(localStorage.getItem('excel-template') ?? '', (data: any) => {
        console.log(data);
    });
    return <div>Preview</div>;
};

export default Preview;
