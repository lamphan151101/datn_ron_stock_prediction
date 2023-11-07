import Header from "../../components/Header/Header";
import SiteLayout from "../../layouts/SiteLayout";
import "./Home.scss";
export {};

const Home = () => {
	return (
		<SiteLayout>
			<Header icon="sort" title="Deposit and Withdraw" />
			<div className="home-image-top">
				<div className="home-section">
					<div className="home-mage-text">
						<h2>Investment Forecast</h2>
						<h1>Market Insights</h1>
						<p>
							InsightfulEquity is your trusted partner in navigating the complex
							world of stock market investments. With a focus on predictive
							analytics and sentiment analysis, we empower investors with
							data-driven insights to make informed decisions. Our mission is to
							provide you with a competitive edge in the financial markets by
							uncovering trends, assessing risks, and identifying opportunities.
							Explore the future of investment with InsightfulEquity.
						</p>
					</div>
					<div className="home-image-right"></div>
				</div>
			</div>
			<div className="home-choose-us">
				<span className="home-choose-while">while</span>
				<br />
				<h2>Choose Us?</h2>
				<br />
				<p>
					Our seasoned team has a track record of successful stock analysis and
					revenue forecasting, providing you with the best insights for
					financial growth.
				</p>
            </div>
            <div className="home-choose-section">
                <div className="home-choose-image"></div>
                <div className="home-choose-item">
                    <div className="item">
                        <div className="item-image-smart"></div>
                        <div className="item-text">
                            <h6>Smart Investments</h6>
                            <p>Our data-driven approach helps you identify opportunities for cost savings and efficient portfolio management.</p>
                        </div>
                    </div>
                     <div className="item">
                        <div className="item-image-innovation"></div>
                       <div className="item-text">
                            <h6>Innovation</h6>
                            <p>We stay ahead in technology, constantly enhancing our algorithms to deliver accurate predictions and maximize returns.</p>
                        </div>
                    </div>
                     <div className="item">
                        <div className="item-image-customize"></div>
                        <div className="item-text">
                            <h6>Customized Solutions</h6>
                            <p>TWe understand that each investor's goals are unique. Our tailored insights and strategies cater to your specific financial objectives.</p>
                        </div>
                    </div>
                     <div className="item">
                        <div className="item-image-continuous"></div>
                        <div className="item-text">
                            <h6>Continuous Support</h6>
                            <p>Our commitment to your success goes beyond data analysis. We offer ongoing support and guidance throughout your investment journey.</p>
                        </div>
                    </div>
                </div>
            </div>
			<div className="home-best-feature"></div>
		</SiteLayout>
	);
};

export default Home;
