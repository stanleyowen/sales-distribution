import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { executePython } from '../lib/executePy.lib';
import { createFolder } from '../lib/file-operation.lib';
const xlsx = window.require('exceljs');

// eslint-disable-next-line
const Preview = ({}: any) => {
    const { id } = useParams();
    const [path, setPath] = useState<string>('');

    function readExcelFile(filePath: string, callback: any) {
        const workbook = new xlsx.Workbook();
        workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet(1);
            worksheet.getCell('H4').value = 'Abang Jago';
            const dir = filePath.substring(0, filePath.lastIndexOf('\\'));
            workbook.xlsx
                .writeFile(dir + '/tmp/' + id + '.xlsx')
                .then(() => {
                    createFolder(dir, '/tmp/', () => {
                        executePython(
                            localStorage.getItem('excel-template') ?? '',
                            id,
                            (path: string) => setPath(path)
                        );
                    });
                })
                .catch((err: any) => {
                    throw err;
                });
            callback(worksheet);
        });
    }

    readExcelFile(localStorage.getItem('excel-template') ?? '', (data: any) => {
        console.log(data);
    });

    return (
        <div>
            {path ? (
                <object
                    data={`file:///${path}`}
                    type="application/pdf"
                    width="500"
                    height="678"
                    className="w-100"
                >
                    <iframe src={`file:///${path}`} width="500" height="678">
                        <p>App aren&#39;t able to preview converted PDF!</p>
                    </iframe>
                </object>
            ) : null}
        </div>
    );
};

export default Preview;
