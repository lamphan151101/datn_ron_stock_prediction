import { memo } from 'react';

interface StatusProps {
  status: number;
}

const Status: React.FC<StatusProps> = memo(({ status }) => {
  if (status === 1) {
    return <span className='status green'>COMPLETED</span>;
  }

  if (status === 2) {
    return <span className='status red'>CANCELLED</span>;
  }

  return <span className='status gray'>PENDING</span>;
});

export default Status;
