import React, { FC, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
export {}

interface NavbarButtonProps {
  url: string;
  icon: string;
  title: string;
}

const NavbarButton: FC<NavbarButtonProps> = memo(({ url, icon, title }) => {
  const location = useLocation();

  return (
    <Link
      to={url}
      className={location.pathname.toLowerCase().includes(url) ? 'active nowrap' : 'passive nowrap'}
    >
      <i className='material-icons'>{icon}</i>
      <span>{title}</span>
    </Link>
  );
});

export default NavbarButton;
