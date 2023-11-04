import React, { memo } from 'react';

interface IconProps {
  type: number;
}

const Icon: React.FC<IconProps> = memo(({ type }) => {
  return (
    <div className={`operation ${type === 1 ? 'red' : 'green'}`}>
      <i className={`material-icons`}>{type === 1 ? 'arrow_upward' : 'arrow_downward'}</i>
    </div>
  );
});

export default Icon;
