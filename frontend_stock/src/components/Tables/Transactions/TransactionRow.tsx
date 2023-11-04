import React, { memo } from 'react';
import Icon from './Icon';
import Amount from './Amount';
import Status from './Status';

interface TransactionData {
  type: number;
  transaction: string;
  date: string;
  from: string;
  to: string;
  toPicture: string;
  coin: string;
  icon: string;
  amount: string;
  status: number;
}

interface TransactionRowProps {
  item: TransactionData;
}

const TransactionRow: React.FC<TransactionRowProps> = memo(({ item }) => (
  <tr>
    <td>
      <Icon type={item.type} />
    </td>
    <td className='responsive-hide'>#{item.transaction}</td>
    <td className='responsive-hide'>{item.date}</td>
    <td>{item.from}</td>
    <td className='nowrap'>
      <div className='icon cover' style={{ backgroundImage: `url('${item.toPicture}')` }} />
      {item.to}
    </td>
    <td className='nowrap'>
      <div className='icon cover' style={{ backgroundImage: `url('${item.icon}')` }} />
      <strong>{item.coin}</strong>
    </td>
    <td className='center'>
      <Amount type={item.type} amount={item.amount} />
    </td>
    <td className='center'>
      <Status status={item.status} />
    </td>
  </tr>
));

export default TransactionRow;
