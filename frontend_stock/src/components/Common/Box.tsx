import React, { FC, ReactNode, memo } from 'react';
export {};
interface BoxProps {
  children: ReactNode;
}

const Box: FC<BoxProps> = memo(({ children }) => <div className='box'>{children}</div>);

export default Box;
