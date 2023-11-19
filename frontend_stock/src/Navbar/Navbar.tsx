import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import NavbarButton from "./NavbarButton";
export {};

const Navbar: FC = memo(() => (
	<nav className="navbar-inner no-select">
		<div className="logo">
			<Link to="/market">
				<img src="/images/logo.png" alt="Crypto Exchange" draggable="false" />
			</Link>
		</div>
		<h3>Main Menu</h3>
		<ul>
			<li>
				<NavbarButton url="/Home" icon="equalizer" title="Home" />
			</li>
			<li>
				<NavbarButton
					url="/stockmarket"
					icon="account_balance"
					title="Stock Market"
				/>
			</li>
			<li>
				<NavbarButton
					url="/MarketScreen"
					icon="list"
					title="Watch List"
				/>
			</li>

			<li>
				<NavbarButton
					url="/stockprediction"
					icon="sync"
					title="Stock Prediciton"
				/>
			</li>
		</ul>
		<h3>Others</h3>
		<ul>
			<li>
				<NavbarButton url="/members" icon="account_circle" title="Profile" />
			</li>
			<li>
				<NavbarButton url="/contacts" icon="contacts" title="Contacts" />
			</li>
			<li>
				<NavbarButton url="/messages" icon="chat" title="Messages" />
			</li>
			<li>
				<NavbarButton url="/settings" icon="settings" title="Settings" />
			</li>
		</ul>
		<div className="copyright">
			<strong>Stock Prediction</strong>
			<p>
				2023 &copy; All rights reserved.
				<br />
				<br />
				Made with <span>❤</span> by Ron Phan
			</p>
		</div>
	</nav>
));

export default Navbar;
