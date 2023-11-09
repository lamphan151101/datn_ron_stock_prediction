
import ChartComponent from "../lineChart/lineChart";
import TableData from "../table/table";
import "./Result.scss";
export { };



const Result = (props: any) => {
    console.log(props, 'props')
    const { res } = props;
    interface DataItem {
    day: string;
    value: number;
    }

    const data: DataItem[] = [
    { day: 'Mon', value: 820 },
    { day: 'Tue', value: 932 },
    { day: 'Wed', value: 901 },
    { day: 'Thu', value: 934 },
    { day: 'Fri', value: 1290 },
    { day: 'Sat', value: 1330 },
    { day: 'Sun', value: 1320 },
    ];

	return (
            <div className="container-props">
                <div className="row">
                    <div className="today-stock-data">
                        <div className="title">
                            <h4>
                                Today's {props.symbol} Stock Data
                            </h4>
                        </div>
                        <div className="value">
                            <div className="item">
                                <div className="title-value"><p>OPEN</p></div>
                                <div className="value-number"><h3>{res ? res.data.open_s : ''}</h3></div>
                            </div>
                            <div className="item">
                                <div className="title-value"><p>HIGHT</p></div>
                                <div className="value-number"><h3>{res ? res.data.high_s : ''}</h3></div>
                            </div>
                            <div className="item">
                                <div className="title-value"><p>LOW</p></div>
                                <div className="value-number"><h3>{res ? res.data.low_s : ''}</h3></div>
                            </div>
                            <div className="item">
                                <div className="title-value"><p>CLOSE</p></div>
                                <div className="value-number"><h3>{res ? res.data.close_s : ''}</h3></div>
                            </div>
                            <div className="item">
                                <div className="title-value"><p>ADJ CLOSE</p></div>
                                <div className="value-number"><h3>{res ? res.data.adj_close : ''}</h3></div>
                            </div>
                            <div className="item">
                                <div className="title-value"><p>VOLUMN</p></div>
                                <div className="value-number"><h3>{res ? res.data.vol : ''}</h3></div>
                            </div>
                        </div>
                </div>

                    <div className="table-prediction">
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Recent Trend In {props.symbol} Stock Prices</h4>
                            </div>
                            <ChartComponent data={res ? res.data.quantityDate : []} />
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>ARIMA Model Accuracy</h4>
                            </div>
                            <div className="image-arima"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>LSTM Model Accuracy</h4>
                            </div>
                            <div className="image-lstm"></div>
                        </div>
                        <div className="table-prediction-image">
                            <div className="table-prediciton-tile">
                                <h4>Linear Regression Model Accuracy</h4>
                            </div>
                            <div className="image-regression"></div>
                        </div>
                </div>
                <div className="revenue-overview">
                    <div className="title">
                        <h4>Revenue Overview</h4>
                    </div>
                    <div className="tomorrow-close">
                        <div className="tomorrow-title">
                            <h4>
                                Tomorrow's {props.symbol} Closing Price
                            </h4>
                        </div>
                        <div className="tomorrow-item">
                            <div className="item-1">
                                <span>BY ARIMA:</span>
                                <b> { res ? res.data?.arima_pred : ''}</b>
                            </div>
                            <div className="item-2">
                                <span>BY LSTM:</span>
                                <b> { res ?res.data?.lstm_pred : ''}</b>
                            </div>
                            <div className="item-3">
                                <span>BY LINEAR REGRESSION:</span>
                                <b> {res ? res.data?.lr_pred : ''}</b>
                            </div>
                        </div>
                    </div>
                    <div className="tomorrow-close">  <div className="tomorrow-title">
                            <h4>
                                Model Evaluation
                            </h4>
                        </div>
                        <div className="tomorrow-item">
                            <div className="item-1">
                                <span>ARIMA RMSE:</span>
                                <b>{ res ? res.data?.error_arima : ''}</b>
                            </div>
                            <div className="item-2">
                                <span>LSTM RMSE:</span>
                                <b>{ res ? res.data?.error_lstm : ''}</b>
                            </div>
                            <div className="item-3">
                                <span>LINEAR REGRESSION RMSE: </span>
                                <b>{res ? res.data?.error_lr : ''}</b>
                            </div>
                        </div></div>
                </div>
                <TableData res={res} />
                <div className="component-result">
                    <div className="right-side">
                        <div className="title">
                            <h4>Sentiment Analysis For {props.symbol} News</h4>
                        </div>
                        <div className="image"></div>
                        <div className="text">
                            <div className="text-tiltle">
                                <h4>Market Sentiment Analysis</h4>
                                <p>Conducting sentiment analysis for AAPL news provides valuable insights into the public's perception, guiding informed decisions in the financial realm.</p>
                            </div>
                        </div>
                    </div>
                    <div className="left-side">
                        <div className="predic">

                        </div>
                        <div className="recommence"></div>
                    </div>
                </div>
                </div>
            </div>
	);
};

export default Result;
