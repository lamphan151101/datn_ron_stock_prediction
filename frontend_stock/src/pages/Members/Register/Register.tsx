import MainLayout from "../../../layouts/MainLayout";
import Box from "../../../components/Common/Box";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

const SignupScreen = () => {
	const navigate = useNavigate();
	const [formValues, setFormValues] = useState({
		email: "",
		phone: "",
		password: "",
		password1: "",
		name: "",
		lastname: "",
		citizenship: false,
		identityType: "",
		identityNumber: "",
		day: "",
		month: "",
		year: "",
		country: "",
		operator: "",
		agreeToPolicies1: false,
		agreeToPolicies2: false,
		agreeToPolicies3: false,
	});

	const handleChange = (e: any) => {
		const { name, value } = e.target;

		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	const handleCheckboxChange = (e: any) => {
		const { name, checked } = e.target;

		setFormValues({
			...formValues,
			[name]: checked,
		});
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
	};

	return (
		<MainLayout>
			<div className="flex flex-center">
				<div className="login no-select">
					<Box>
						<div
							className="box-vertical-padding box-horizontal-padding"
							style={{ display: "flex", justifyContent: "center" }}
						>
							<form className="form-register" onSubmit={handleSubmit}>
								<p className="title-register">Register </p>
								<p className="message-register">
									Signup now and get full access to our app.{" "}
								</p>
								<div className="flex-register">
									<label>
										<input
											required={true}
											placeholder=""
											type="text"
											className="input-register"
											onChange={handleSubmit}
										/>
										<span>Firstname</span>
									</label>

									<label>
										<input
											required={true}
											placeholder=""
											type="text"
											className="input-register"
											onChange={handleSubmit}
										/>
										<span>Lastname</span>
									</label>
								</div>

								<label>
									<input
										required={true}
										placeholder=""
										type="email"
										className="input-register"
										onChange={handleSubmit}
									/>
									<span>Email</span>
								</label>

								<label>
									<input
										required={true}
										placeholder=""
										type="password"
										className="input-register"
										onChange={handleSubmit}
									/>
									<span>Password</span>
								</label>
								<label>
									<input
										required={true}
										placeholder=""
										type="password"
										className="input-register"
										onChange={handleSubmit}
									/>
									<span>Confirm password</span>
								</label>
								<button className="submit-register">Submit</button>
								<p className="signin-register">
									Already have an acount ?{" "}
									<a
										href="#"
										onClick={() => {
											return navigate("/Login");
										}}
									>
										Signin
									</a>{" "}
								</p>
							</form>
						</div>
					</Box>
				</div>
			</div>
		</MainLayout>
	);
};

export default SignupScreen;
