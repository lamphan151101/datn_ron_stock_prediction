import React, { useEffect, useMemo, useState } from "react";
import { Space, Table, Tag, Input, Tooltip, Alert, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import httpClient from "../../httpClient";
import SiteLayout from "../../layouts/SiteLayout";
import Header from "../../components/Header/Header";
import Loader from "../../components/Common/loader/loader";
import { PlusCircleOutlined } from "@ant-design/icons";

interface DataType {
	symbol: string;
	country: string;
	currency: string;
	mic_code: string;
	name: string;
	type: string;
}

const Transactions: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<any>();
	const [searchText, setSearchText] = useState<string>("");
	const [isLoader, setIsLoader] = useState<boolean>(false);
	const Context = React.createContext({ name: "Default" });
	const contextValue = useMemo(() => ({ name: "Ant Design" }), []);

	useEffect(() => {
		initData();
	}, []);

	const onClick = (symbol: string) => {
		navigate(`/datadetail/${symbol}`);
	};

	const handleSearch = (value: string) => {
		setSearchText(value);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: "Symbol",
			dataIndex: "symbol",
			key: "symbol",
			render: (_, render) => {
				return (
					<div
						style={{ cursor: "pointer" }}
						onClick={() => onClick(render?.symbol)}
					>
						<a>{render?.symbol}</a>
					</div>
				);
			},
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (_, render) => {
				return <div>{render?.name}</div>;
			},
		},
		{
			title: "Currency",
			dataIndex: "currency",
			key: "currency",
			render: (_, render) => {
				return <div>{render?.currency}</div>;
			},
		},
		{
			title: "Country",
			key: "country",
			dataIndex: "country",
			render: (_, render) => {
				return <div>{render?.country}</div>;
			},
		},
		{
			title: "Action",
			key: "action",
			dataIndex: "action",
			render: (_, render) => {
				return (
					<div
						style={{
							cursor: "pointer",
							marginLeft: 10,
						}}
					>
						<Tooltip title="Add to Watch List" color="red" key="red">
							<PlusCircleOutlined
								onClick={() => addStockToWatchList(render.symbol)}
							/>
						</Tooltip>
					</div>
				);
			},
		},
	];

	const filteredData = data?.filter((item: DataType) =>
		item.symbol.toLowerCase().includes(searchText.toLowerCase())
	);

	const initData = async () => {
		try {
			setIsLoader(true);
			const res = await httpClient.get("//localhost:5000/allStock");
			if (true) {
				console.log(res.data.data, "res");
				setData(res.data.data);
				setIsLoader(false);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const addStockToWatchList = async (symbol: string) => {
		try {
			setIsLoader(true);
			const res = await httpClient.post("//localhost:5000/add_watch_list", {
				symbol: symbol,
			});
			console.log("Response:", res); // Thêm dòng này
			if (res.data.status === "200") {
				openNotification();
				console.log("Status 200 reached!"); // Thêm dòng này
				setIsLoader(false);
			}
			if (res.data.status === "401") {
				openNotificationFail();
				console.log("Status 200 reached!");
				setIsLoader(false);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const openNotification = () => {
		notification.success({
			message: `Add Stock Successfully`,
			duration: 2,
		});
	};
	const openNotificationFail = () => {
		notification.error({
			message: `Add Stock Faild`,
			description: (
				<Context.Consumer>
					{() => `The Symbol had been already exist`}
				</Context.Consumer>
			),
			duration: 2,
		});
	};

	return (
		<Context.Provider value={contextValue}>
			<SiteLayout>
				<Header icon="sort" title="Stock Market" />
				<Input
					placeholder="Search by Symbol"
					onChange={(e) => handleSearch(e.target.value)}
					style={{ marginBottom: 16, width: 200, height: 40, display: "flex" }}
				/>
				{isLoader ? (
					<div
						style={{ width: "100%", display: "flex", justifyContent: "center" }}
					>
						<Loader />
					</div>
				) : (
					<Table
						style={{
							border: "1px solid #d7d7d7",
							borderRadius: "10px",
							padding: "10px",
						}}
						columns={columns}
						dataSource={filteredData}
					/>
				)}
			</SiteLayout>
		</Context.Provider>
	);
};

export default Transactions;
