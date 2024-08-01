import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Home from "../pages/home/Home";
import Plan from "../pages/plan/Plan.jsx";
import CreateApplication from "../pages/createApplication/CreateApplication";
import Office from "../pages/office/Office";
import Minute from "../pages/minute/Minute";
import CreateBill from "../pages/createBill/CreateBill";
import ViewBill from "../pages/viewBill/ViewBill";
import ActivitiesView from "../pages/activitiesView/ActivitiesView";
import Analysis from "../pages/analysis/Analysis";
import BuildingControl from "../pages/buildingControl/BuildingControl";
import Petition from "../pages/petition/Petition";
import Approval from "../pages/approval/Approval";
import DocumentView from "../pages/documentView/DocumentView";
import LoginPage from "../pages/loginPage/LoginPage";
import { useDispatch, useSelector } from "react-redux";
import { getThemeColor, setThemeColor } from "./themeColor";
import OfficeSelect from "../pages/officeSelect/OfficeSelect.jsx";
import DevelopmentControl from "../pages/buildingControl/BuildingControl";
import InDevelopment from "../pages/inDevelopment/InDevelopment.jsx";
import Profile from "../pages/profile/Profile.jsx";
import Activity from "../pages/activity/Activity.jsx";
import OfficeSetting from "../pages/officeSetting/OfficeSetting.jsx";
import Chat from "../pages/chat/chat.jsx";
import { allDirectMessages, socket } from "./socket.js";
import { logout, setChat } from "../redux/userSlice.js";
import { resetOfficeData } from "../redux/appSlice.js";

const events = [
	"load",
	"mousemove",
	"mousedown",
	"click",
	"scroll",
	"keypress",
];

function LoggedWrapper() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser, chat } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.app);
	const themeColor = getThemeColor();
	// console.log(currentUser);


  const [allDirectMessages, setAllDirectMessages]= useState([])

	useEffect(() => {
		setThemeColor(theme);
	}, [theme]);

	let logoutCount = 0;
	// AUTO LOG OUT FUNCTIONALITY
	let timer;

	// this resets the timer if it exists.
	const resetTimer = () => {
		if (timer) clearTimeout(timer);
	};

	useEffect(() => {
		if (currentUser) {
			Object.values(events).forEach((item) => {
				window.addEventListener(item, () => {
					resetTimer();
					handleLogoutTimer();
				});
			});

			return () => {
				resetTimer();
				// Listener clean up. Removes the existing event listener from the window
				Object.values(events).forEach((item) => {
					window.removeEventListener(item, resetTimer);
				});
			};
		}
	});

	// this function sets the timer that logs out the user after 10 secs
	const handleLogoutTimer = () => {
		const time = import.meta.env.VITE_LOGOUT_TIMER;
		if (currentUser) {
			// Add this check to ensure the user is still authenticated
			timer = setTimeout(() => {
				// clears any pending timer.
				resetTimer();
				// console.log("INSIDE TIMER");

				// logs out user
				// logoutAction();

				if (logoutCount === 1) {
					toast.error("Session Timeout", {
						position: "top-right",
						autoClose: 2500,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: themeColor,
					});
				}

				// Listener clean up. Removes the existing event listener from the window
				Object.values(events).forEach((item) => {
					window.removeEventListener(item, resetTimer);
				});

				// increase logoutCount on every call.
				logoutCount++;

				socket.disconnect();
				socket.on("disconnected", () => {
					console.log(`I'm disconnected from the back-end`);
				});
				dispatch(logout());
				dispatch(resetOfficeData());

				window.location.reload();
			}, 1000 * 60 * time); // 1000ms = 1secs. You can change the time in .env file.
		} else {
			resetTimer(); // Clear the timer
			Object.values(events).forEach((item) => {
				window.removeEventListener(item, resetTimer);
			});
		}
	};


	// Connect Socket Io
	useEffect(() => {
		socket.auth = { userId: currentUser._id };
		socket.connect();
		socket.on("connect", () => {
			console.log(`I'm connected with the back-end`);
		});
		socket.onAny((event, ...args) => {
			console.log(event, args);
		});
		socket.on("users", (data) => {
			console.log("USER:", data);
		});
		return () => {
			socket.off("connect", () => {
				console.log(`I'm disconnected with the back-end`);
			});
			socket.offAny((event, ...args) => {
				console.log(event, args);
			});
			socket.off("users", (data) => {
				console.log("USER:", data);
			});
		};
	}, []);

	// Receive Messages
	useEffect(() => {

		socket.on("directMessage", (data) => {
			console.log("INSIDE CLIENT DIRECT MSSG");
			// setAllDirectMessages((prev) => [
			// 	...prev,
			// 	{
			// 		timestamp: data.timestamp,
			// 		content: data.content,
			// 		sender: data.sender,
			// 		receiver: data.receiver,
			// 		read: data.read,
			// 	},
			// ]);

			console.log(chat);
      console.log(data);
      const newAllMessages = [...chat.allDirectMessages, data]
      console.log(newAllMessages);

      // const newData = {
      //   ...chat,
      //   allDirectMessages:
      // }

			// dispatch(
			// 	setChat({
			// 		// ...chat,
			// 		allDirectMessages: newAllMessages,
			// 	})
      // );

      allDirectMessages().add(data)

			console.log(chat);
		});
		socket.on("allDirectMessages", (data) => {
			console.log("INSIDE CLIENT ALL DIRECT MSSG");
			setAllDirectMessages(data);
		});
		socket.on("messageRead", (data) => {
			setAllDirectMessages((prev) =>
				prev.map((msg) =>
					msg.timestamp === data.timestamp ? { ...msg, read: true } : msg
				)
			);
		});

		// return () => {
		// 	socket.off("directMessage");
		// 	socket.off("messageRead");
		// };
	}, []);

	// useEffect(() => {
	// 	if (!currentUser) {
	// 		navigate("/login");
	// 	}
	// 	// return () => {};
	// }, [currentUser]);

	return (
		<>
			<div>WORKING YEAH</div>

			<Routes>
				{/* HOME PAGE */}
				<Route path="/">
					<Route
						index
						// element={!currentUser ? <Navigate to="/login" /> : <Home />}
						element={<Home />}
					/>
				</Route>

				{/* PERMIT | APPROVAL */}
				<Route path="/permit">
					{/* <Route index element={currentUser && <Approval />} /> */}
					<Route index element={<OfficeSelect />} />

					<Route path="new" element={<CreateApplication />} />
					<Route path=":id">
						<Route index element={<Plan />} />
						<Route path="bills" element={<ViewBill />} />
						<Route path="create_bill" element={<CreateBill />} />
						<Route path="minute" element={<Minute />} />
						<Route path="documents" element={<DocumentView />} />
					</Route>
					<Route path="office">
						<Route path=":id" element={<Office />} />
					</Route>
				</Route>

				{/* PETITION */}
				<Route path="/petition">
					<Route index element={<InDevelopment />} />
				</Route>

				{/* BUILDING CONTROL */}
				<Route path="/b_control">
					{/* <Route index element={<BuildingControl />} /> */}
					<Route index element={<InDevelopment />} />
				</Route>

				{/* DEVELOPMENT CONTROL */}
				<Route path="/d_control">
					{/* <Route index element={<DevelopmentControl />} /> */}
					<Route index element={<InDevelopment />} />
				</Route>

				{/* ACTIVITIES */}
				<Route path="/activities">
					{/* <Route index element={<ActivitiesView />} /> */}
					<Route index element={<Activity />} />
				</Route>
				{/* ANALYSIS */}
				<Route path="/analysis">
					{/* <Route index element={<Analysis />} /> */}
					<Route index element={<Analysis />} />
				</Route>

				{/* PROFILE */}
				<Route path="/profile">
					<Route index element={<Profile />} />

					<Route path="new" element={<CreateApplication />} />
					<Route path=":id">
						<Route index element={<Plan />} />
						<Route path="bills" element={<ViewBill />} />
						<Route path="create_bill" element={<CreateBill />} />
						<Route path="minute" element={<Minute />} />
						<Route path="documents" element={<DocumentView />} />
					</Route>
					<Route path="office">
						<Route path=":id" element={<Office />} />
					</Route>
				</Route>

				{/* OFFICE SETTING */}
				<Route path="/office_setting">
					<Route index element={<OfficeSetting />} />

					<Route path="new" element={<CreateApplication />} />
					<Route path=":id">
						<Route index element={<Plan />} />
						<Route path="bills" element={<ViewBill />} />
						<Route path="create_bill" element={<CreateBill />} />
						<Route path="minute" element={<Minute />} />
						<Route path="documents" element={<DocumentView />} />
					</Route>
					<Route path="office">
						<Route path=":id" element={<Office />} />
					</Route>
				</Route>

				{/* CHAT  */}
				<Route path="/chat">
					<Route index element={<Chat />} />

					<Route path="new" element={<CreateApplication />} />
					<Route path=":id">
						<Route index element={<Plan />} />
						<Route path="bills" element={<ViewBill />} />
						<Route path="create_bill" element={<CreateBill />} />
						<Route path="minute" element={<Minute />} />
						<Route path="documents" element={<DocumentView />} />
					</Route>
					<Route path="office">
						<Route path=":id" element={<Office />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default LoggedWrapper;