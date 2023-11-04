import React, { FC, memo } from 'react';
export {}
interface StatusNameProps {
  status: number;
}

const StatusName: FC<StatusNameProps> = memo(({ status }) => {
  if (status === 1) {
    return <span className='green'>Limit suitable</span>;
  }

  return <span className='red'>Insufficient balance</span>;
});

export default StatusName;
