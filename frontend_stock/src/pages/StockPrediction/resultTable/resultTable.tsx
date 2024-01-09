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
        createData('RMSE huấn luyện giá mở cửa', 10.72, 10.69, 169.39),
        createData('RMSE huấn luyện giá đóng cửa', 12.12, 12.13, 164.16),
        createData('RMSE đánh giá giá mở cửa', 16.31, 16.9, 107.22),
        createData('RMSE đánh giá giá đóng cửa', 19.55, 19.6, 104.21),
        createData('RMSE kiểm thử giá mở cửa', 20.45, 22.27, 626.7),
        createData('RMSE kiểm thử giá đóng cửa', 23.69, 23.77, 675.26),
    ];
    const rows_3 = [
        createData('RMSE huấn luyện giá mở cửa', 10.95, 11.26, 217.54),
        createData('RMSE huấn luyện giá đóng cửa', 13.3, 13.56, 198.8),
        createData('RMSE đánh giá giá mở cửa', 21.77, 19.9, 149.27),
        createData('RMSE đánh giá giá đóng cửa', 24.49, 23.3, 188.14),
        createData('RMSE kiểm thử giá mở cửa', 33.24, 23.38, 2080.87),
        createData('RMSE kiểm thử giá đóng cửa', 36.49, 29.06, 1233.49),
    ];
     const rows_7 = [
        createData('RMSE huấn luyện giá mở cửa', 21.53, 17.62, 217.54),
        createData('RMSE huấn luyện giá đóng cửa', 22.73, 18.3, 198.8),
        createData('RMSE đánh giá giá mở cửa', 33.22, 27.58, 149.27),
        createData('RMSE đánh giá giá đóng cửa', 31.06, 27.32, 188.14),
        createData('RMSE kiểm thử giá mở cửa', 68.32, 71.34, 2080.87),
        createData('RMSE kiểm thử giá đóng cửa', 76.6, 91.0, 1233.49),
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
