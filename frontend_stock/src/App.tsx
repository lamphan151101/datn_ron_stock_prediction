import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom';
import './App.css';
import Login from './pages/Members/Login';
import Register from './pages/Members/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProfileScreen from './pages/Members/ProfileScreen';
import SignupScreen from './pages/Members/Register/Register';
import ForgotScreen from './pages/Members/ForgotScreen';
import DashboardScreen from './pages/Dashboard/Dashboard';
import MarketScreen from './pages/Market/MarketScreen';
import CapitalScreen from './pages/Capital/CapitalScreen';
import Home from './pages/Home/Home';
import StockPrediciton from './pages/StockPrediction/stockPrediction';
import DataDetail from './pages/Home/component/dataDetail/dataDetail';
import { Audio } from 'react-loader-spinner';
import Transactions from './pages/Transactions/TransactionsScreen';


function App() {
  return (
		<div className="App">
			<BrowserRouter>
				<ToastContainer />
				<Routes>
					<Route path="/" element={<Navigate to="/Login" replace />} />
					<Route path="/Login" element={<Login />} />
					<Route path="/Register" element={<Register />} />
					<Route path="/Dashboard" element={<Dashboard />} />
					<Route path="/ProfileScreen" element={<ProfileScreen />} />
					<Route path="/Register" element={<SignupScreen />} />
					<Route path="/ForgotScreen" element={<ForgotScreen />} />
					<Route path="/DashboardScreen" element={<DashboardScreen />} />
					<Route path="/MarketScreen" element={<MarketScreen />} />
					<Route path="/CapitalScreen" element={<CapitalScreen />} />
					<Route path="/stockmarket" element={<Transactions />} />
					<Route path="/Home" element={<Home />} />
					<Route path="/stockprediction" element={<StockPrediciton />} />
					<Route path="/datadetail/:symbol" element={<DataDetail />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
