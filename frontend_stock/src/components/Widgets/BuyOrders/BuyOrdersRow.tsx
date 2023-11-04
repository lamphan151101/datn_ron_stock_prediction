import { memo, useState, useEffect } from 'react';

interface BuyOrdersRowProps {
  item: {
    price: string;
    amount: string;
    total: string;
    currency: string;
    type: number;
  };
}

const BuyOrdersRow: React.FC<BuyOrdersRowProps> = ({ item }) => {
  const [color, setColor] = useState<string>('white');

  useEffect(() => {
    if (item.type === 1) {
      setColor('green');
    } else if (item.type === 2) {
      setColor('red');
    }
  }, []);

  return (
    <tr className={color}>
      <td className='left'>
        {item.price} {item.currency}
      </td>
      <td className='center'>
        {item.amount} {item.currency}
      </td>
      <td className='right'>
        {item.total} {item.currency}
      </td>
    </tr>
  );
};

export default BuyOrdersRow;
