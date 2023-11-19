import React, { FC, ReactNode, memo } from "react";

import HeaderLeft from "./HeaderLeft";
export {};

interface HeaderProps {
	icon?: string | null;
	title: string;
}

const Header: FC<HeaderProps> = memo(({ icon, title }) => (
	<header className="flex flex-center flex-space-between">
		<HeaderLeft icon={icon} title={title} />
	</header>
));

Header.defaultProps = {
	icon: null,
};

export default Header;
