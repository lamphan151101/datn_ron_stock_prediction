import React, { memo, useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines-typescript";
import httpClient from "../../../httpClient";

interface MarketRowProps {
	item: {
		id: number;
		name: string;
		icon: string;
		date: string;
		amount: string;
		currency: string;
		change: string;
		lineChartData: number[];
		status: number;
	};
}

const MarketRow: React.FC<any> = memo(({ item, callbackData }) => {
	console.log(item, "props");
	const [dataLine, setDataLine] = useState<any>();
	const [chooseData, setChooseData] = useState<string>();
	const [color, setColor] = useState<string>("");

	const getDetailDataWatch = async () => {
		const res = await httpClient.post(
			"//localhost:5000/get_stock_detail_from_database",
			{
				symbol: item,
			}
		);
		console.log(res, "aaaa");
		if (res) {
			const closeValues = res.data.values.map((item: any) => item.close);
			console.log(closeValues, "closeValues");
			setDataLine(closeValues);
		}
	};

	const senData = (item: any) => {
    callbackData(item);
    console.log(chooseData, "chooo");
    console.log(item, 'item')
	};

	useEffect(() => {
		getDetailDataWatch();
	}, []);
	useEffect(() => {
		senData(chooseData);
	}, [chooseData]);


	return (
		<div className="market-row flex flex-center flex-space-between">
			<div onClick={() => setChooseData(item)} style={{ cursor: "pointer" }}>
				<p>
					<strong>{item.name}</strong>
					<span className="gray">{item}</span>
				</p>
			</div>
			<div>
				<Sparklines data={dataLine} width={50} height={50}>
					<SparklinesLine
						style={{ strokeWidth: 2, fill: "none" }}
						color={color}
					/>
				</Sparklines>
			</div>
		</div>
	);
});

export default MarketRow;
