import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { executePython } from '../lib/executePy.lib';
import { createFolder } from '../lib/file-operation.lib';
const xlsx = window.require('exceljs');

type Data = {
    invoiceNumber: number;
    invoiceType: 'Auto' | 'A' | 'BC' | '';
    customer: {
        id: number;
        fullName: string;
        address: string;
        idNumber: string;
        taxId: string;
    };
    items: any;
};

type Props = {
    isLoadingData: boolean;
    isConverting: boolean;
};

// eslint-disable-next-line
const Preview = ({}: any) => {
    const { id } = useParams();
    const [properties, setProps] = useState<Props>({
        isLoadingData: true,
        isConverting: true,
    });
    const [path, setPath] = useState<string>('');
    const [data, setData] = useState<Data>({
        invoiceNumber: 0,
        invoiceType: '',
        customer: {
            id: 0,
            fullName: '',
            address: '',
            idNumber: '',
            taxId: '',
        },
        items: [
            {
                id: 0,
                qty: 0,
                itemName: '',
                unitPrice: 0,
                totalPrice: 0,
                discountPerKg: 0,
                discountPercent: 0,
                unitOfMeasure: '',
            },
        ],
    });

    function readExcelFile(filePath: string, callback: any) {
        const workbook = new xlsx.Workbook();
        workbook.xlsx.readFile(filePath).then(() => {
            const worksheet = workbook.getWorksheet(1);
            worksheet.getCell('H4').value = 'Abang Jago';
            const dir = filePath.substring(0, filePath.lastIndexOf('\\'));
            workbook.xlsx
                .writeFile(dir + '\\tmp\\' + id + '.xlsx')
                .then(() => {
                    createFolder(dir, '\\tmp\\', () => {
                        executePython(
                            dir + '\\tmp\\' + id + '.xlsx',
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

    useEffect(() => {
        readExcelFile(
            localStorage.getItem('excel-template') ?? '',
            (data: any) => {
                console.log(data);
            }
        );
    }, []);

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
