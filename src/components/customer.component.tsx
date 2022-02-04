import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    LinearProgress,
} from '@mui/material';
import CustomerDatabase from '../customer-data.json';
import { MenuIcon } from '../lib/icons.component';

// eslint-disable-next-line
const Customer = ({ auth, config }: any) => {
    const { loggedIn } = auth;
    const [page, setPage] = useState<number>(0);
    const [rowPerPage, setRowPage] = useState<number>(10);

    const columns = [
        { id: 'id', label: 'Id' },
        { id: 'fullName', label: 'Name' },
        { id: 'taxId', label: 'NPWP' },
        { id: 'idNumber', label: 'NIK' },
        { id: 'address', label: 'Address' },
    ];

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.id}>
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableBody>
                        {CustomerDatabase.length > 0 ? (
                            CustomerDatabase.slice(
                                page * rowPerPage,
                                page * rowPerPage + rowPerPage
                            ).map((customer: any, index: number) => {
                                return (
                                    <TableRow key={index} hover>
                                        {columns.map((column: any) => {
                                            return (
                                                <TableCell key={column.id}>
                                                    {customer[column.id]}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Customer;
