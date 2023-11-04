import React, { memo } from 'react';
import PropTypes from 'prop-types';

import ProcessType from './ProcessType';
import StatusName from './StatusName';

interface RecentActivityItem {
  type: number;
  time: string;
  amount: string;
  currency: string;
  status: number;
}

const RecentActivityRow: React.FC<{ item: RecentActivityItem }> = memo(({ item }) => (
  <div className='activity-row flex flex-center flex-space-between no-select'>
    <ProcessType type={item.type} />
    <div className='center'>
      <p>{item.time}</p>
    </div>
    <div className='center'>
      <strong>
        {item.amount} {item.currency}
      </strong>
    </div>
    <div className='center'>
      <StatusName status={item.status} />
    </div>
  </div>
));

RecentActivityRow.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  }).isRequired,
};

export default RecentActivityRow;
