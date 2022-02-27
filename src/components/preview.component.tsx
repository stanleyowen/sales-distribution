import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    Dialog,
    Button,
    TableRow,
    TableBody,
    TableCell,
    TextField,
    DialogTitle,
    DialogContent,
    TableContainer,
    LinearProgress,
    TablePagination,
    DialogActions,
} from '@mui/material';
const excelJs = window.require('exceljs');

// eslint-disable-next-line
const Preview = ({}: any) => {
    function readExcelFile(filePath: string, callback: any) {
        const workbook = new excelJs.Workbook();
        workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet(1);
            worksheet.getCell('H4').value = 'Abang Jago';
            callback(worksheet);
        });
    }

    readExcelFile(
        `C:/Users/Stanley Owen  VGC/Downloads/TEMPLATE.xlsx`,
        (data: any) => {
            console.log(data);
        }
    );
    return <div>Preview</div>;
};

export default Preview;
