import React, { FC, memo } from 'react';

import StatusName from './StatusName';
export {}

interface CurrencyData {
  id: number;
  currency: string;
  icon: string;
  limit24h: string;
  limit30d: string;
  status: number;
}

interface LimitsRowProps {
  item: CurrencyData;
}

const LimitsRow: FC<LimitsRowProps> = memo(({ item }) => (
  <div className='limits-row flex flex-center flex-space-between no-select'>
    <div>
      <div className='icon cover' style={{ backgroundImage: `url('${item.icon}')` }} />
      <strong>{item.currency}</strong>
    </div>
    <div className='center'>
      <p>{item.limit24h}</p>
    </div>
    <div className='center'>
      <strong>{item.limit30d}</strong>
    </div>
    <div className='center'>
      <StatusName status={item.status} />
    </div>
  </div>
));

export default LimitsRow;
