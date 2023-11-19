import "./Loader.scss";

const Loader = () => {
	return (
		<div className="loader">
			<div className="wrapper">
				<div className="circle"></div>
				<div className="circle"></div>
				<div className="circle"></div>
				<div className="shadow"></div>
				<div className="shadow"></div>
				<div className="shadow"></div>
			</div>
		</div>
	);
};

export default Loader;
