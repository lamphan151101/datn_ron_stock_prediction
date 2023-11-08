import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  title: string;
content: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Positive',
    dataIndex: 'positive',
    key: 'positive',
    width: '33%',
    render: (_, item) => {
        if (item.content === 'Positive') {
        return <h5>{item.title }</h5>
        }
        return
    },
  },
  {
    title: 'Neutral',
    dataIndex: 'neutral',
      key: 'neutral',
      width: '33%',
     render: (_, item) => {
        if (item.content === 'Neutral') {
        return <h5>{item.title }</h5>
        }
        return
    },
  },
  {
    title: 'Negative',
    dataIndex: 'negative',
    key: 'negative',
    width:'33%',
     render: (_, item) => {
        if (item.content === 'Negative') {
        return <h5>{item.title }</h5>
        }
        return
    },
  }
];


const TableData = (props: any) => {
    console.log(props, 'props from table');
    const newsObjects = props.res?.data?.news_list?.map((item: any) => {
        return {
            title: item[0],
            content: item[1]
        };
        });

        console.log(newsObjects, 'newsObjects');

    return (
        <Table dataSource={newsObjects} columns={columns} />
    )

};

export default TableData;
