
import Header from '../../components/Header/Header';
import SiteLayout from '../../layouts/SiteLayout';
import './Home.scss';
export {}

const Home = () => {
    return (
        <SiteLayout>
            <Header icon='sort' title='Deposit and Withdraw' />
            <div className='home-image-top'>
                <div className='home-first-child'>Dự báo đầu tư</div>
                <div className='home-second-child'>
                    <p>
                        <strong>InsightfulEquity</strong> là đối tác đáng tin cậy của bạn trong việc thám hiểm thế giới phức tạp của đầu tư vào thị trường chứng khoán. Với trọng tâm vào phân tích dự đoán và phân tích tâm trạng, chúng tôi trang bị nhà đầu tư bằng thông tin dựa trên dữ liệu để giúp họ đưa ra quyết định có sự hiểu biết.
                    </p>
                    <br></br>
                    <p>Sứ mệnh của chúng tôi là cung cấp cho bạn một lợi thế cạnh tranh trên thị trường tài chính bằng cách tiết lộ các xu hướng, đánh giá rủi ro và xác định cơ hội. Khám phá tương lai đầu tư cùng với <strong>InsightfulEquity</strong>.</p>
                </div>
            </div>
            <div className='home-choose-us'>
                <span className='home-choose-'>while</span>
                <br/>
                <h2>Choose Us?</h2>
                <br/>
                <span>Our seasoned team has a track record of successful stock analysis and revenue forecasting, providing you with the best insights for financial growth.</span>
            </div>
            <div className='home-best-feature'></div>
        </SiteLayout>

    )
}

export default Home;
