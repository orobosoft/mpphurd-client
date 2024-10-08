import { useDispatch, useSelector } from "react-redux";
import FeedBackground from "../../components/feedBackground/FeedBackground";
import FeedCard from "../../components/feedCard/FeedCard";
import Header from "../../components/header/Header";
import SideBar from "../../components/sidebar/SideBar";
import { loginFailure, loginSuccess, logout } from "../../redux/userSlice";
import CreateApplication from "../createApplication/CreateApplication";
import "./home.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { resetOfficeData } from "../../redux/appSlice";
import { ToastContainer, toast } from "react-toastify";
import { getThemeColor } from "../../utilities/themeColor";
// const { format, getHours } = require("date-fns");
import { format, getHours } from "date-fns";
import { fetchInstance } from "../../utilities/fetcher";

export default function Home() {
	const { currentUser, loading } = useSelector((state) => state.user);
	const themeColor = getThemeColor();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);
	const [reload, setReload] = useState();
	const [err, setErr] = useState(false);

	const [isLogout, setIsLogout] = useState(0);

	// Check if Plan is in User Office(s)
	// const isInUserOffice = currentUser.office.some((e) => {
	// 	return data.currentOffice.id._id === e.id._id;
	// });
	// Check if Plan is in User Office(s)
	const isInUserOffice = currentUser.office.some((e) => {
		return e?.id?.name?.includes("ASSESSMENT");
	});

	const [assessment, setAssessment] = useState(
		currentUser.office.some((e) => {
			return e?.id?.name?.includes("ASSESSMENT");
		})
	);
	const [clearing, setClearing] = useState(
		currentUser.office.some((e) => {
			return e?.id?.name?.includes("CLEARING HOUSE");
		})
	);
	const [archive, setArchive] = useState(
		currentUser.office.some((e) => {
			return e?.id?.name?.includes("ARCHIVE");
		})
	);

	// FORMAT GREETING
	const getGreeting = () => {
		// Get the current time
		const currentTime = new Date();

		// Get the hour from the current time
		const currentHour = getHours(currentTime);

		// Display the appropriate greeting based on the current time
		let greeting;
		if (currentHour >= 5 && currentHour < 12) {
			greeting = "Good Morning";
		} else if (currentHour >= 12 && currentHour < 18) {
			greeting = "Good Afternoon";
		} else {
			greeting = "Good Evening";
		}

		// Display the greeting with the formatted date
		// console.log(`${greeting} ${currentUser.firstName}`);
		return `${greeting} ${currentUser.firstName}`;
	};
	const getGreetingDate = () => {
		// Get the current time
		const currentTime = new Date();
		// Format the current date
		const formattedDate = format(currentTime, "EEEE, MMMM do, yyyy");
		return `${formattedDate}`;
	};

	const clearingHouseActions = () => {
		return (
			<>
				<div className="feedCard__container">
					<div className="feedCard__list">
						<FeedCard
							priText={"Create New Application"}
							secText={"Clearing"}
							route={"/permit/new"}
						/>
						<FeedCard
							count={44}
							priText={"Awaiting Action"}
							secText={"Clearing"}
						/>
					</div>
				</div>
			</>
		);
	};

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetchInstance.get(`/staffs/staff`);

				setData(res.data);
				setIsLoading(false);
				// console.log(res.data);
				dispatch(loginSuccess(res.data));

				// console.log(res.data);
			} catch (error) {
				setIsLoading(false);
				setErr(true);
			}
		};

		getData();

		// return () => {
		// 	second
		// }
	}, [reload]);

	return (
		<>
			<Header />
			<div className="homeContainer">
				<SideBar />
				<div className="homePage">
					<div className="home__greetings">
						<span>{getGreeting()}</span>
						<span>{getGreetingDate()}</span>
					</div>

					<FeedBackground>
						{clearing && clearingHouseActions()}

						{/* <div className="feedCard__container">
							<div className="feedCard__list">
								<FeedCard
									count={24}
									priText={"Create New Application"}
									secText={"Clearing"}
									route={"/permit/new"}
								/>
								<FeedCard
									count={44}
									priText={"Payment made"}
									secText={"Assessment"}
								/>
								<FeedCard
									count={7}
									priText={"Minuted Files"}
									secText={"Assessment"}
								/>
								<FeedCard
									count={7}
									priText={"Minuted Files"}
									secText={"Assessment"}
								/>
							</div>
						</div>

						<div className="feedCard__container">
							<div className="feedCard__list">
								<FeedCard
									count={24}
									priText={"Create New Application"}
									secText={"Clearing"}
									route={"/permit/new"}
								/>
								<FeedCard
									count={44}
									priText={"Payment made"}
									secText={"Assessment"}
								/>
								<FeedCard
									count={7}
									priText={"Minuted Files"}
									secText={"Assessment"}
								/>
							</div>
						</div>
						<div className="feedCard__container">
							<div className="feedCard__list">
								<FeedCard
									count={24}
									priText={"Create New Application"}
									secText={"Clearing"}
									route={"/permit/new"}
								/>
								<FeedCard
									count={44}
									priText={"Payment made"}
									secText={"Assessment"}
								/>
								<FeedCard
									count={7}
									priText={"Minuted Files"}
									secText={"Assessment"}
								/>
							</div>
						</div>
						<div className="feedCard__container">
							<div className="feedCard__list">
								<FeedCard
									count={24}
									priText={"Create New Application"}
									secText={"Clearing"}
									route={"/permit/new"}
								/>
								<FeedCard
									count={44}
									priText={"Payment made"}
									secText={"Assessment"}
								/>
								<FeedCard
									count={7}
									priText={"Minuted Files"}
									secText={"Assessment"}
								/>
							</div>
						</div> */}
					</FeedBackground>
				</div>
			</div>
		</>
	);
}
