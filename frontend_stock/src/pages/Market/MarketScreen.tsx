import React, { useState, useEffect } from "react";

import MainLayout from "../../layouts/MainLayout";
import Header from "../../components/Header/Header";

import Market from "../../components/Widgets/Market/Market";
import BuySell from "../../components/Widgets/BuySell/BuySell";
import BuyOrders from "../../components/Widgets/BuyOrders/BuyOrders";
import SellOrders from "../../components/Widgets/SellOrders/SellOrders";
import TradeHistory from "../../components/Widgets/TradeHistory/TradeHistory";
import CoinVertical from "../../components/Widgets/Coin/CoinVertical";
import CoinHorizontal from "../../components/Widgets/Coin/CoinHorizontal";
import CandleStick from "../../components/Widgets/CandleStick/CandleStick";
import SiteLayout from "../../layouts/SiteLayout";

const MarketScreen: React.FC = () => {
	const [keyword, setKeyword] = useState<string>("");
	const [coinInfo, setCoinInfo] = useState<any>(null);

	useEffect(() => {
		const coinData = {
			id: 1,
			name: "Bitcoin",
			symbol: "BTC",
			change: "-%3.28",
			currency: "TRY",
			exchange: "BTC/TRY",
			weight: "104k",
			financialRate: "-0.0252%/hr",
			icon: "https://icons-for-free.com/iconfiles/png/512/btc+coin+crypto+icon-1320162856490699468.png",
			amount: "18.783,33",
			description: `Bitcoin, invented by an unknown person or group using the pseudonym Satoshi Nakamoto in 2008, is a cryptocurrency. In 2009, it was released as open-source software.`,
		};

		setCoinInfo(coinData);
	}, []);

	const handleSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setKeyword(value);
	};

	const handleSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle search here if needed
	};

	return (
		<SiteLayout>
			<div className="content">
				<Header title="Market" />
				<div className="flex flex-destroy">
					<div className=" box-right-padding">
						<Market />
					</div>
					
				</div>
			</div>
		</SiteLayout>
	);
};

export default MarketScreen;
