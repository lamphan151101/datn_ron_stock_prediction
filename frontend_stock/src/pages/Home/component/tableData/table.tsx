import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import httpClient from '../../../../httpClient';
import { useNavigate } from 'react-router-dom';
import App from '../dataDetail/dataDetail';

interface DataType {
    symbol: string,
    country: string,
    currency: string,
    mic_code: string,
    name: string,
    type: string
}



const TableData: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>();
    useEffect(() => {
        initData();
    }, [])
    const onClick = () => {
        <App />
    }
    const columns: ColumnsType<DataType> = [
  {
    title: 'Symbol',
    dataIndex: 'symbol',
    key: 'symbol',
    render: ((_, render) => {
        return (
            <div onClick={() => onClick()}>{render?.symbol }</div>
        )
    }),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: ((_, render) => {
        return (
        <div>{render?.name }</div>
        )
    }),
  },
  {
    title: 'Currency',
    dataIndex: 'currency',
    key: 'currency',
    render: ((_, render) => {
        return (
        <div>{render?.currency }</div>
        )
    }),
  },
  {
    title: 'Country',
    key: 'country',
    dataIndex: 'country',
    render: ((_, render) => {
        return (
        <div>{render?.country }</div>
        )
    }),
  }
];
    const initData = async () => {
        try {
            const res = await httpClient.get("//localhost:5000/allStock")
            if (res) {
                console.log(res.data.data, "res")
                setData(res.data.data);
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        <Table columns={columns} dataSource={data} />
    )

};

export default TableData;
