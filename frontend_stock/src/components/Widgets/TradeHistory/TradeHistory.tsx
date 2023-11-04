import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '../../Common/Box';
import TradeHistoryRow from './TradeHistoryRow';

interface TradeHistoryItem {
  id: number;
  amount: string;
  currency: string;
  weight: number;
  time: string;
  type: number;
}

const TradeHistory = memo(() => {
  const [data, setData] = useState<TradeHistoryItem[]>([]);

  useEffect(() => {
    const dataArray: TradeHistoryItem[] = [
      {
        id: 1,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '06:22:15',
        type: 1,
      },
      {
        id: 2,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '07:30:30',
        type: 1,
      },
      {
        id: 3,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '09:15:42',
        type: 2,
      },
      {
        id: 4,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '11:12:50',
        type: 2,
      },
      {
        id: 5,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '13:30:01',
        type: 1,
      },
      {
        id: 6,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '14:20:36',
        type: 1,
      },
      {
        id: 7,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '17:45:58',
        type: 1,
      },
      {
        id: 8,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '20:05:54',
        type: 1,
      },
      {
        id: 9,
        amount: '146.70',
        currency: 'TRY',
        weight: 10,
        time: '22:30:45',
        type: 2,
      },
    ];

    setData(dataArray);
  }, []);

  return (
    <Box>
      <div className='box-title box-vertical-padding box-horizontal-padding no-select'>
        Market History
      </div>
      <div className='box-content box-content-height'>
        <div className='trade-history-row'>
          {data && data.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th className='left no-select'>Price</th>
                  <th className='center no-select'>Volume</th>
                  <th className='center no-select'>Transaction</th>
                  <th className='right no-select'>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <TradeHistoryRow key={item.id.toString()} item={item} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className='box-button box-vertical-padding box-horizontal-padding'>
        <Link to='/market' className='button button-purple button-medium button-block'>
          More
          <i className='material-icons button-icon-right'>chevron_right</i>
        </Link>
      </div>
    </Box>
  );
});

export default TradeHistory;
