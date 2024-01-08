
import { Collapse, CollapseProps } from "antd";
import ChartComponent from "../lineChart/lineChart";
import TableData from "../table/table";
import "./Result.scss";
import BasicTable from "../resultTable/resultTable";
export { };



const Result = (props: any) => {
    console.log(props, 'props')
    const { res } = props;
    interface DataItem {
    day: string;
    value: number;
    }

    const items: CollapseProps['items'] = [
    {
        key: '1',
        label: 'Dự đoán giá cho 1 ngày sau',
        children:
            <div className="container-props">
                <div className="row">
                    <div className="today-stock-data">
                        <div className="title">
                        </div>
                    </div>
                    <div className="table-prediction">
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu huấn luyện giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-trainning-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu huấn luyện giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-trainning-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu huấn luyện giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-trainning-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu huấn luyện giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-trainning-close"></div>
                        </div>




                    <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu đánh giá giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-val-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu đánh giá giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-val-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu đánh giá giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-val-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu đánh giá giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-val-close"></div>
                    </div>



                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu kiểm tra giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-test-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu kiểm tra giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-test-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu kiểm tra giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-test-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu kiểm tra giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-test-close"></div>
                    </div>
                </div>
                    <div className="image-loss-total">
                        <h2>Mất mát huấn luyện và mất mát đánh giá của dữ liệu có phân tích cảm xúc</h2>
                    <div className="image-loss"></div>
                </div>
                    <div className="image-loss-total">
                        <h2>Mất mát huấn luyện và mất mát đánh giá của dữ liệu không có phân tích cảm xúc</h2>
                    <div className="image-loss-without"></div>
                    </div>


                </div>
                <div><BasicTable data={1 } /></div>
                <div className="cards">
                    <div className="card red">
                        <p className="tip">Giá thực tế</p>
                        <p className="second-text">Open: 186.02 Close: 186.97</p>
                    </div>
                    <div className="card blue">
                        <p className="tip">Giá dự đoán</p>
                        <p className="second-text">Open: 172.48077 Close: 207.92961</p>
                    </div>
            </div>
        </div>
    },
    {
        key: '2',
        label: 'Dự đoán giá cho 3 ngày sau',
        children: <div className="container-props_3">
                <div className="row">
                    <div className="today-stock-data">
                        <div className="title">
                        </div>
                    </div>
                    <div className="table-prediction">
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu huấn luyện giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-trainning-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu huấn luyện giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-trainning-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu huấn luyện giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-trainning-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu huấn luyện giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-trainning-close"></div>
                        </div>




                    <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu đánh giá giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-val-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu đánh giá giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-val-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu đánh giá giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-val-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu đánh giá giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-val-close"></div>
                    </div>



                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu kiểm tra giá mở cửa không có twitters</h4>
                            </div>
                            <div className="image-test-open-without"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Dữ liệu kiểm tra giá mở cửa có twitters</h4>
                            </div>
                            <div className="image-test-open"></div>
                        </div>
                        <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu kiểm tra giá đóng cửa không có twitters</h4>
                                </div>
                            <div className="image-test-close-without"></div>
                            </div>
                            <div className="table-prediction-image">
                                <div className="table-prediciton-tile">
                                    <h4>Dữ liệu kiểm tra giá đóng cửa có twitters</h4>
                                </div>
                                <div className="image-test-close"></div>
                    </div>
                </div>
                    <div className="image-loss-total_3">
                        <h2>Mất mát huấn luyện và mất mát đánh giá của dữ liệu có phân tích cảm xúc</h2>
                    <div className="image-loss"></div>
                </div>
                    <div className="image-loss-total">
                        <h2>Mất mát huấn luyện và mất mát đánh giá của dữ liệu không có phân tích cảm xúc</h2>
                    <div className="image-loss-without"></div>
                    </div>


                </div>
            <div><BasicTable data={2} /></div>
            <div className="cards">
                <div className="item-red" style={{
                    display: 'flex', flexDirection: 'column', gap: '5px'
                }}>
                    <div className="card red">
                        <p className="tip">Giá thực tế</p>
                        {/* <p className="second-text">Open: 185.2 Close: 184.05</p> */}
                    </div>
                    <div className="card red">
                        {/* <p className="tip"></p> */}
                        <p className="second-text">Open: 184.27 Close: 189.27</p>
                    </div>
                    <div className="card red">
                        {/* <p className="tip">Giá thực tế</p> */}
                        <p className="second-text">Open: 186.02 Close: 186.97</p>
                    </div>
                    <div className="card red">
                        {/* <p className="tip">Giá thực tế</p> */}
                        <p className="second-text">Open: 186.02 Close: 186.97</p>
                    </div>
                </div>
                <div className="item-blue" style={{
                    display: 'flex', flexDirection: 'column', gap: '5px'
                }}>
                    <div className="card blue">
                        <p className="tip">Giá dự đoán</p>
                        {/* <p className="second-text">Open: 172.48077 Close: 207.92961</p> */}
                    </div>
                    <div className="card blue">
                        {/* <p className="tip">Giá dự đoán</p> */}
                        <p className="second-text">Open: 187.6 Close: 193.8</p>
                    </div>
                    <div className="card blue">
                        {/* <p className="tip">Giá dự đoán</p> */}
                        <p className="second-text">Open: 194.13 Close: 211.43</p>
                    </div>
                    <div className="card blue">
                        {/* <p className="tip">Giá dự đoán</p> */}
                        <p className="second-text">Open: 175.27 Close: 173.09</p>
                    </div></div>

            </div>

        </div>,
    }
    ];
    const onChange = (key: string | string[]) => {
    console.log(key);
  };

	return (
        <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
	);
};

export default Result;
