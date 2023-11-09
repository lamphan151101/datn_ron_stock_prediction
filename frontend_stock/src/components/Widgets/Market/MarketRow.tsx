import React, { memo, useState, useEffect } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines-typescript';

interface MarketRowProps {
  item: {
    id: number;
    name: string;
    icon: string;
    date: string;
    amount: string;
    currency: string;
    change: string;
    lineChartData: number[];
    status: number;
  };
}

const MarketRow: React.FC<MarketRowProps> = memo(({ item }) => {
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    if (item.status === 1) {
      setColor('green');
    } else {
      setColor('red');
    }
  }, [item.status]);

  return (
    <div className='market-row flex flex-center flex-space-between'>
      <div>
        <div className='icon cover' style={{ backgroundImage: `url('${item.icon}')` }} />
      </div>
      <div>
        <p>
          <strong>{item.name}</strong>
          <span className='gray'>{item.date}</span>
        </p>
      </div>
      <div>
        <Sparklines data={item.lineChartData} width={50} height={50}>
          <SparklinesLine style={{ strokeWidth: 2, fill: 'none' }} color={color} />
        </Sparklines>
      </div>
      <div>
        <p className='right'>
          <strong>
            {item.amount} {item.currency}
          </strong>
          <span className={color}>{item.change}</span>
        </p>
      </div>
    </div>
  );
});

export default MarketRow;