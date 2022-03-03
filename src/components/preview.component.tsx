import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { executePython } from '../lib/executePy.lib';
import { createFolder } from '../lib/file-operation.lib';
import { readFile, writeFile } from '../lib/file-operation.lib';
const xlsx = window.require('exceljs');

type Data = {
    invoiceNumber: number;
    invoiceType: '00' | 'A00' | 'BC000' | 'D00' | 'E00' | '';
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
const Preview = () => {
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

    const handleProperties = (id: string, value: boolean) =>
        setProps({ ...properties, [id]: value });

    function readExcelFile(filePath: string, callback: any) {
        const workbook = new xlsx.Workbook();
        workbook.xlsx.readFile(filePath).then(() => {
            const template = workbook.worksheets[0];
            const config = workbook.worksheets[1];

            config.getCell('C2').value = data.invoiceType;

            template.getCell('G1').value =
                data.invoiceType + data.invoiceNumber;
            template.getCell('F4').value = data.customer.fullName;
            template.getCell('F5').value = data.customer.address;
            template.getCell('F6').value =
                data.customer.idNumber + ' / ' + data.customer.taxId;

            // =IF(ISBLANK(B8);"";ROUND((C8*E8*(1-F8))+(-G8*C8);0))

            data.items.map((item: any, col: number) => {
                const row = col + 8;

                template.getCell('A' + row).alignment = {
                    horizontal: 'center',
                };
                template.getCell('C' + row).alignment = {
                    horizontal: 'right',
                };
                ['B', 'D', 'E', 'F', 'G', 'H'].map((cell: string) => {
                    template.getCell(cell + row).alignment = {
                        horizontal: 'left',
                    };
                });

                template.getCell('B' + row).value = item.itemName;
                template.getCell('C' + row).value = item.qty;
                template.getCell('D' + row).value = item.unitOfMeasure;
                template.getCell('E' + row).value = item.unitPrice;
                template.getCell('F' + row).value = item.discountPercent / 100;
                template.getCell('G' + row).value = item.discountPerKg;
                template.getCell('H' + row).value = item.totalPrice;
            });

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
            callback(template);
        });
    }

    useEffect(() => {
        readFile(localStorage.getItem('invoice-database'), (data: any) => {
            const invoice = JSON.parse(data).find(
                (invoice: any) =>
                    invoice.invoiceType + invoice.invoiceNumber === id
            );

            setData(invoice);

            handleProperties('isLoadingData', false);
        });
    }, []);

    useEffect(() => {
        if (!properties.isLoadingData)
            readExcelFile(
                localStorage.getItem('excel-template') ?? '',
                (data: any) => {
                    console.log(data);
                }
            );
    }, [properties.isLoadingData]);

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
