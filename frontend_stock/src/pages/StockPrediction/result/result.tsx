
import "./Result.scss";
export { };



const Result = (props: any) => {
    console.log(props, 'props')
    const { res } = props;
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
                        <div className="image-trend"></div>
                    </div>
                     <div className="table-prediction-image">
                        <div className="table-prediciton-tile"></div>
                        <div className="image"></div>
                    </div>
                     <div className="table-prediction-image">
                        <div className="table-prediciton-tile"></div>
                        <div className="image"></div>
                    </div>
                     <div className="table-prediction-image">
                        <div className="table-prediciton-tile"></div>
                        <div className="image"></div>
                    </div>
                </div>
                </div>
            </div>
	);
};

export default Result;
