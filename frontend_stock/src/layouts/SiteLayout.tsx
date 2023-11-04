import React, { FC, ReactNode, memo } from 'react';

import Navbar from '../Navbar/Navbar';
export {}

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout: FC<SiteLayoutProps> = memo(({ children }) => (
  <div className='flex'>
    <div className='navbar full-height responsive-hide'>
      <Navbar />
    </div>
    <div className='content full-height flex-1'>{children}</div>
  </div>
));

export default SiteLayout;
