import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import NavbarButton from "./NavbarButton";
export {};

const Navbar: FC = memo(() => (
	<nav className="navbar-inner no-select">
		<div className="logo">
			<Link to="/market">
				<img src="https://cdn5.vectorstock.com/i/1000x1000/01/89/circle-wolf-logo-design-concept-vector-21160189.jpg" alt="Stock Prediciton" draggable="false" />
			</Link>
		</div>
		<h3>Main Menu</h3>
		<ul>
			<li>
				<NavbarButton url="/Home" icon="equalizer" title="Trang chủ" />
			</li>
			<li>
				<NavbarButton
					url="/stockmarket"
					icon="account_balance"
					title="Thị trường cổ phiếu"
				/>
			</li>
			<li>
				<NavbarButton
					url="/MarketScreen"
					icon="list"
					title="Danh sách theo dõi"
				/>
			</li>

			<li>
				<NavbarButton
					url="/stockprediction"
					icon="sync"
					title="Dự đoán giá cổ phiếu"
				/>
			</li>
		</ul>
		{/* <h3>Others</h3>
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
		</ul> */}
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
