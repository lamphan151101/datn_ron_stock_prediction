import React, { FC, ReactNode, memo } from 'react';
export {}

interface HeaderLeftProps {
  icon?: string | null;
  title: string;
}

const HeaderLeft: FC<HeaderLeftProps> = memo(({ icon, title }) => (
  <div className='header-left nowrap no-select'>
    {icon && (
      <button type='button' className='pointer'>
        <i className='material-icons'>{icon}</i>
      </button>
    )}
    <h1>{title}</h1>
  </div>
));

HeaderLeft.defaultProps = {
  icon: null,
};

export default HeaderLeft;
