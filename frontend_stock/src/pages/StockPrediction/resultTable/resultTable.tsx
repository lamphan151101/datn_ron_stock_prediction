import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
  open: number,
    close: number,
  total: string | number
) {
  return { name, open, close, total };
}

export default function BasicTable(props: any) {
    const rows_1 = [
        createData('RMSE huấn luyện giá mở cửa', 11.94, 12.6, 169.39),
        createData('RMSE huấn luyện giá đóng cửa', 12.82, 14.17, 164.16),
        createData('RMSE đánh giá giá mở cửa', 14.74, 15.41, 107.22),
        createData('RMSE đánh giá giá đóng cửa', 14.74, 17.48, 104.21),
        createData('RMSE kiểm thử giá mở cửa', 21.16, 22.23, 626.7),
        createData('RMSE kiểm thử giá đóng cửa', 24.13, 25.58, 675.26),
    ];
    const rows_3 = [
        createData('RMSE huấn luyện giá mở cửa', 17.1, 18.06, 217.54),
        createData('RMSE huấn luyện giá đóng cửa', 17.8, 18.7, 198.8),
        createData('RMSE đánh giá giá mở cửa', 22.01, 22.02, 149.27),
        createData('RMSE đánh giá giá đóng cửa', 22.82, 21.6, 188.14),
        createData('RMSE kiểm thử giá mở cửa', 33.97, 32.91, 2080.87),
        createData('RMSE kiểm thử giá đóng cửa', 35.37, 35.97, 1233.49),
    ];
     const rows_7 = [
        createData('RMSE huấn luyện giá mở cửa', 29.19, 31.2, 217.54),
        createData('RMSE huấn luyện giá đóng cửa', 29.85, 31.62, 198.8),
        createData('RMSE đánh giá giá mở cửa', 30.96, 36.75, 149.27),
        createData('RMSE đánh giá giá đóng cửa', 31.94, 37.56, 188.14),
        createData('RMSE kiểm thử giá mở cửa', 76.12, 65.61, 2080.87),
        createData('RMSE kiểm thử giá đóng cửa', 84.5, 66.8, 1233.49),
    ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Có dữ liệu phân tích cảm xúc</TableCell>
            <TableCell align="right">Không có dữ liệu phân tích cảm xúc</TableCell>
            {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
                  {props.data === 1 && rows_1.map((row) => (
                      <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                          <TableCell component="th" scope="row">
                              {row.name}
                          </TableCell>
                          <TableCell align="right">{row.open}</TableCell>
                          <TableCell align="right">{row.close}</TableCell>
                          {/* <TableCell align="right">{row.total}</TableCell> */}
                          {/* <TableCell align="right">{row.protein}</TableCell> */}
                      </TableRow>
                  ))}
           {props.data === 2 && rows_3.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.open}</TableCell>
              <TableCell align="right">{row.close}</TableCell>
              {/* <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
           ))}
                  {props.data === 3 && rows_7.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.open}</TableCell>
              <TableCell align="right">{row.close}</TableCell>
              {/* <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
