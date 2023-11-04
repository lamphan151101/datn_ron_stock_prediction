import React, { memo } from 'react';
import PropTypes from 'prop-types';

interface StatusNameProps {
  status: number;
}

const StatusName: React.FC<StatusNameProps> = memo(({ status }) => {
  if (status === 1) {
    return <span className='green'>Completed</span>;
  }

  if (status === 2) {
    return <span className='red'>Failed</span>;
  }

  return <span className='gray'>Pending</span>;
});

StatusName.propTypes = {
  status: PropTypes.number.isRequired,
};

export default StatusName;
