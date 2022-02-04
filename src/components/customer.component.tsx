import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    LinearProgress,
    TablePagination,
} from '@mui/material';
import CustomerDatabase from '../customer-data.json';

type Props = {
    page: number;
    rowsPerPage: number;
};

// eslint-disable-next-line
const Customer = ({ auth, config }: any) => {
    const { loggedIn } = auth;
    const [props, setProps] = useState<Props>({
        page: 0,
        rowsPerPage: 10,
    });

    const handleProperties = (id: string, value: number) =>
        setProps({ ...props, [id]: value });

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
                                props.page * props.rowsPerPage,
                                props.page * props.rowsPerPage +
                                    props.rowsPerPage
                            ).map((customer: any) => {
                                return (
                                    <TableRow key={customer.id} hover>
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

            <TablePagination
                component="div"
                page={props.page}
                rowsPerPage={props.rowsPerPage}
                count={CustomerDatabase.length ?? 0}
                onPageChange={(_, newPage: number) => {
                    handleProperties('page', newPage);
                }}
                onRowsPerPageChange={(e) => {
                    handleProperties('page', 0);
                    handleProperties('rowsPerPage', +e.target.value);
                }}
            />
        </div>
    );
};

export default Customer;
