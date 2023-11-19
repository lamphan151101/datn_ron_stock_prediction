import { memo, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

import Box from "../../Common/Box";
import { Select, Space, Typography } from "antd";

const CandleStick = memo((props: any) => {
	const [chartData, setChartData] = useState<any | null>(null);
	console.log(props, "prop ");
	const [lineStyle, setLineStyle] = useState<"candlestick" | "line">(
		"candlestick"
  );
  const [isLoader, setIsLoader] = useState<boolean>(false);

	const onChange = (value: string) => {
		console.log(`selected ${value}`);
		setLineStyle(value as "candlestick" | "line");
	};
	console.log(lineStyle, "lin");

	const onSearch = (value: string) => {
		console.log("search:", value);
	};

	const filterOption = (
		input: string,
		option?: { label: string; value: string }
	) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
	useEffect(() => {
		const data = {
			series: [
				{
					data: props.data,
				},
			],
			options: {
				chart: {
					type: "candlestick",
					height: 470,
				},
				xaxis: {
					type: "datetime",
				},
				yaxis: {
					tooltip: {
						enabled: true,
					},
				},
			},
		};

		setChartData(data);
	}, [props]);

	return (
		<Box>
			<div className="box-title box-vertical-padding box-horizontal-padding no-select">
				Market History Of {props.symbol}
			</div>
			<div className="box-content box-content-height-nobutton">
				<Select
					showSearch
					placeholder="Select a person"
					optionFilterProp="children"
					onChange={onChange}
					onSearch={onSearch}
					filterOption={filterOption}
					style={{ width: "200px" }}
					options={[
						{
							value: "line",
							label: "line",
						},
						{
							value: "candlestick",
							label: "candlestick",
						},
					]}
				/>
				{chartData && (
					<ReactApexChart
						options={chartData.options}
						series={chartData.series}
						type={lineStyle}
						height={470}
					/>
				)}
			</div>
		</Box>
	);
});

export default CandleStick;
