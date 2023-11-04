import React, { memo } from 'react';

interface TradeHistoryRowProps {
  item: {
    amount: string;
    currency: string;
    weight: number;
    type: number;
    time: string;
  };
}

const TradeHistoryRow: React.FC<TradeHistoryRowProps> = ({ item }) => (
  <tr className={item.type === 1 ? 'green' : 'red'}>
    <td className='left'>
      {item.amount} {item.currency}
    </td>
    <td className='center'>{item.weight}</td>
    <td className='center'>{item.type === 1 ? 'BUY' : 'SELL'}</td>
    <td className='right'>{item.time}</td>
  </tr>
);

export default TradeHistoryRow;
