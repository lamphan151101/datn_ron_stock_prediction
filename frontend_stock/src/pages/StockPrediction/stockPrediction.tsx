import { ChangeEvent, FormEvent, useState } from "react";
import Header from "../../components/Header/Header";
import SiteLayout from "../../layouts/SiteLayout";
import "./StockPrediciton.scss";
import FormInput from "../../components/FormInput/FormInput";
import FormButton from "../../components/FormInput/FormButton";
import httpClient from "../../httpClient";
import Result from "./result/result";
export {};

    interface FormValues {
        symbol: string
    }
const StockPrediciton = () => {
    const [formValues, setFormValues] = useState<FormValues>({
    symbol: '',
    });
    const [data, setData] = useState<any>();
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(formValues, "formValues");
        try {
            const res = await httpClient.post("//localhost:5000/result", {
            symbol: formValues.symbol
            })
            if (res) {
                console.log(res, "res")
                setData(res);
            }
        }
        catch (e) {
            console.log(e)
        }



    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
    };

	return (
		<SiteLayout>
			<Header icon="sort" title="Deposit and Withdraw" />
            <div className="container">
                <div className="first-bg">
                    <div className="row">
                        <div className="children">
                            <div className="children-image"></div><div className="children-text">
                                <h3>Enter a Stock Symbol for Market Insights</h3>
                                <p>Simply input a stock symbol like TCS, CTSH, TSLA, IBM, ACN, AMZN, ADBE, CAP.PA, AX, AXP, AAPL or any other to discover market trends and predictions, and gain valuable insights for informed investment decisions.</p>
                            <br/>
                                <div className="form-input-symbol">
                                    <form className='form' onSubmit={handleSubmit} style={{width: "100%", border: "1px solid #d8d8d8", padding: "12px 30px", borderRadius: "3px", marginBottom: "30px"}}>
                                        <FormInput
                                        type='text'
                                        name='symbol'
                                        value={formValues.symbol}
                                        placeholder='Enter the symbol'
                                        onChange={handleChange}
                                        />

                                    </form>
                                     <div className='buttons'>
                                        <FormButton type='submit' text='Submit' onClick={handleSubmit} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Result symbol={formValues.symbol} res={data} />
		</SiteLayout>
	);
};

export default StockPrediciton;
