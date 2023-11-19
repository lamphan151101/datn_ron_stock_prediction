import React, { useEffect, useState } from "react";
import httpClient from "../../../../httpClient";
import CandleStick from "../../../../components/Widgets/CandleStick/CandleStick";
import { useParams } from "react-router-dom";

const DataDetail: React.FC = () => {
	const [data, setData] = useState<any>([]);
  const { symbol } = useParams<{ symbol: string }>();
  const [isLoader, setIsLoader] = useState<boolean>(false);

	useEffect(() => {
		initData();
	}, []);
	const initData = async () => {
    try {
      setIsLoader(true);
			const res = await httpClient.post("//localhost:5000/stockDataDetail", {
				symbol: symbol,
				interval: "1day",
				outputsize: "300",
			});
			if (res) {
				const rawData = res.data.values.map((item: any) => ({
					x: new Date(item.datetime).getTime(),
					y: [
						parseFloat(item.open),
						parseFloat(item.high),
						parseFloat(item.low),
						parseFloat(item.close),
					],
				}));
        setData(rawData);
        setIsLoader(false);
				console.log(rawData, "raw");
			}
		} catch (e) {
			console.log(e);
		}
	};
	return (
		<>
			<CandleStick data={data} symbol={symbol} />
		</>
	);
};

export default DataDetail;
