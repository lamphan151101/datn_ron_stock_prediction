import React, { FC, ReactNode, memo } from 'react';
export {};
interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = memo(({ children }) => <div>{children}</div>);

export default MainLayout;
