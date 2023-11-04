import React, { memo } from 'react';

interface AmountProps {
  type: number;
  amount: string;
}

const Amount: React.FC<AmountProps> = memo(({ type, amount }) => {
  return <strong className={type === 1 ? 'red' : 'green'}>{amount}</strong>;
});

export default Amount;
