import axios from "axios";
import { useRef, useState } from "react";
import "./loginPage.css";
import { useDispatch, useSelector } from "react-redux";

import {
	Facebook,
	Instagram,
	LockOutlined,
	MailOutlineRounded,
	Twitter,
	VisibilityOffOutlined,
	VisibilityOutlined,
} from "@mui/icons-material";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePasswordModal from "../../components/changePasswordModal/ChangePasswordModal";
import { getThemeColor } from "../../utilities/themeColor";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../../widgets/animatedBackground/AnimatedBackground";
import { socket } from "../../utilities/socket";
import { useEffect } from "react";
import { fetchInstance } from "../../utilities/fetcher";

function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { currentUser, loading } = useSelector((state) => state.user);
	const themeColor = getThemeColor();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser) {
			navigate("/");
		}
	}, []);

	const email = useRef();
	const password = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(loginStart());

		try {
			setIsLoading(true);
			const res = await fetchInstance.post(`/staffs/auth/login`, {
				email: email.current.value,
				password: password.current.value,
			});

			dispatch(loginSuccess(res.data));

			navigate("/");

			socket.auth = { userId: res.data._id };
			socket.connect();

			setTimeout(() => {
				toast.success("Login Successful", {});
			}, 200);
		} catch (error) {
			let message = error.response
				? error.response.data.message
				: error.message;
			// console.log(error);
			// console.log(message);

			toast.error(message, {});

			dispatch(loginFailure());
		} finally {
			setIsLoading(false);
		}
		if (loading) {
			dispatch(loginFailure());
		}
	};

	return (
		<>
			<div className="login">
				{/* <div className="login__background"></div> */}
				{/* <div className="pageWrapper"></div> */}
				<AnimatedBackground />
				<section className="login__header">
					<div className="login__formBackground">
						<section className="app-cover__info">
							<div className="app-cover__info-top">
								<div className="app-cover__info__logo">
									<img
										src="/assets/logos/Logo-Mpphurd.png"
										alt="MPPHURD Logo"
									/>
								</div>
								<h1>M-FLOW</h1>
							</div>
							<h2>
								ministry of physical planning, housing, urban and regional
								development app
							</h2>
							<p>
								For a simplified, efficient and automated <br />
								<span className="app-cover__info--highlight">
									Workflow <span className="app-cover__info--svg" />
								</span>
								of the Ministry
							</p>
						</section>

						<form action="#" className="login__form" onSubmit={handleSubmit}>
							<div className="form-logo">
								{/* <img src="Mpphurd.png" alt="Mpphurd Logo" /> */}
							</div>
							<p className="form-greeting">Login to continue</p>
							<div className="form-input">
								<label htmlFor="email">Email</label>
								<div>
									<span>
										<MailOutlineRounded className="formIcon" />
									</span>
									<input
										type="email"
										name="email"
										id="email"
										placeholder="Enter your email address"
										required
										ref={email}
									/>
								</div>
							</div>
							<div className="form-input">
								<label htmlFor="password">Password</label>
								<div>
									<span>
										<LockOutlined className="formIcon" />
									</span>
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										id="password"
										placeholder="Enter your password"
										required
										ref={password}
									/>
									<span
										className="btn"
										onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? (
											<VisibilityOutlined className="formIcon" />
										) : (
											<VisibilityOffOutlined className="formIcon" />
										)}
									</span>
								</div>
							</div>

							<div className="btn password-reset">
								{loading ? (
									"Forgot Password"
								) : (
									<ChangePasswordModal
										name={"Forgot Password"}
										onSubmit={(e) => {
											e.preventDefault();
											alert("WOWOWOWOWOWO");
										}}
									/>
								)}
							</div>
							<button
								type="submit"
								className="btn btn-form-submit"
								disabled={isLoading}>
								{" "}
								Login
								{isLoading && (
									<CircularProgress
										thickness={6}
										size={22}
										sx={{ color: "white" }}
									/>
								)}
							</button>
						</form>
					</div>
				</section>
				<footer className="login__footer">
					<div className="login__footer--copyright">
						<div>© {new Date().getFullYear()} Copyright MPPHURD</div>
					</div>
					<div className="login__footer--mda">
						<div className="login__footer--logos">
							<div className="login__footer--logo">
								<img
									src="/assets/logos/Logo-Edo State.png"
									alt="Edo State Logo"
								/>
							</div>
							<div className="login__footer--logo">
								<img src="/assets/logos/Logo-Mpphurd.png" alt="MPPHURD Logo" />
							</div>
						</div>
						<div className="login__footer--text">
							EDO STATE MINISTRY OF PHYSICAL PLANNING, HOUSING, URBAN AND
							REGIONAL DEVELOPMENT
						</div>
					</div>
					<div className="login__footer--social">
						<div className="login__socialIcons">
							<a href="http://facebook.com/mpphurd.edostate/" target="_blank">
								<Facebook className="btn login__socialIcon" />
							</a>

							<a href="http://instagram.com/mpphurd_edostate" target="_blank">
								<Instagram className="btn login__socialIcon" />
							</a>
							<a href="" target="_blank">
								<Twitter className="btn login__socialIcon" />
							</a>
						</div>
						<div className="login__socialText">
							<p>Follow On Social Media</p>
						</div>
					</div>
				</footer>
			</div>
		</>
	);
}

export default LoginPage;
