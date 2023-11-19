import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "../../Common/Box";
import MarketRow from "./MarketRow";
import httpClient from "../../../httpClient";
import CandleStick from "../CandleStick/CandleStick";

interface MarketData {
	id: number;
	name: string;
	icon: string;
	date: string;
	amount: string;
	currency: string;
	change: string;
	lineChartData: number[];
	status: number;
}

const Market: React.FC = memo(() => {
  const [data, setData] = useState<string[]>([]);
  const [dataChoose, setDataChoose] = useState<string>();

	useEffect(() => {
		callSymbol();

		// setData(dataArray);
	}, []);

	const callSymbol = async () => {
		const res = await httpClient.get("//localhost:5000/get_all_watch_list");
		console.log(res, "res in market");
		if (res) {
			setData(res.data);
		}
	};
	const callbackData = (childata: any) => {
		setDataChoose(childata);
  };
  console.log(dataChoose, 'data')

	return (
		<div style={{ display: "flex", gap: "20px" }}>
			<Box>
				<div className="box-title box-vertical-padding box-horizontal-padding no-select">
					Markets
				</div>
				<div className="box-content box-content-height">
					{data &&
						data.map((item) => (
							<MarketRow item={item} callbackData={callbackData} />
						))}
				</div>
				<div className="box-button box-vertical-padding box-horizontal-padding">
					<Link
						to="/capital"
						className="button button-purple button-medium button-block"
					>
						More
						<i className="material-icons button-icon-right">chevron_right</i>
					</Link>
				</div>
			</Box>
			<div className="flex-1" style={{ width: "85%" }}>
				<div className="flex-1 box-right-padding" style={{ width: "1100px" }}>
					<CandleStick />
				</div>
			</div>
		</div>
	);
});

export default Market;
