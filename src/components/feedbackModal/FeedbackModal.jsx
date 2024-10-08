import React, { useCallback, useEffect, useState } from "react";
import "./feedbackModal.css";
import {
	CloseRounded,
	EditRounded,
	FileUploadRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { getThemeColor } from "../../utilities/themeColor";
import { CircularProgress } from "@mui/material";
import { FEEDBACK_LIST } from "../../utilities/appData";
import { useSelector } from "react-redux";
import { fetchInstance } from "../../utilities/fetcher";

export default function FeedbackModal({ classList }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const { currentUser } = useSelector((state) => state.user);
	const { currentAdmin } = useSelector((state) => state.admin);

	const themeColor = getThemeColor();

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setLoading(false);
		setOpen(false);
	};

	const KEY_NAME_ESC = "Escape";
	const KEY_EVENT_TYPE = "keyup";

	useEscapeKey(handleClose);

	function useEscapeKey(handleClose) {
		const handleEscKey = useCallback(
			(event) => {
				if (event.key === KEY_NAME_ESC) {
					handleClose();
				}
			},
			[handleClose]
		);

		useEffect(() => {
			document.addEventListener(KEY_EVENT_TYPE, handleEscKey, false);

			return () => {
				document.removeEventListener(KEY_EVENT_TYPE, handleEscKey, false);
			};
		}, [handleEscKey]);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const form = new FormData(e.target);
		// console.log(form);

		const newData = {
			category: form.get("minuteStatus"),
			comment: form.get("minuteText"),
		};
		// console.log(newData);

		try {
			const res = await fetchInstance.post(
				`/staffs/staff/${currentUser._id}/feedback`,
				newData
			);

			handleClose();

			setTimeout(() => {
				toast.success(res.data, {});
			}, 200);
		} catch (error) {
			let message = error.response
				? error.response.data.message
				: error.message;
			// console.log(error);
			// console.log(message);

			setLoading(false);

			toast.error(message, {});
		}
	};

	useEffect(() => {
		const modal = document.querySelector(".modalView");
		if (modal) {
			open ? modal.showModal() : modal.close();
		}
	}, [open]);

	return (
		<div>
			<div>
				<span
					className={`${classList} modalTrigger feedBackModalButton`}
					onClick={handleOpen}>
					Send Feedback
				</span>
			</div>

			{open && (
				<dialog className="modalView">
					<header>
						<span>Feedback</span>
						<div className="modalViewCloseButton" onClick={handleClose}>
							<CloseRounded className="closeButton" />
						</div>
					</header>

					<form action="" onSubmit={handleSubmit}>
						<div className="applicationItemsWrapper">
							<div className="applicationTitle">
								<h3>Add Feedback Comment</h3>
							</div>

							<div>
								<div className="minuteItems">
									<div className="minuteItem">
										<label htmlFor="minuteStatus">Category:</label>
										<select required name="minuteStatus" id="minuteStatus">
											<option value="">...</option>

											{FEEDBACK_LIST.map((e) => {
												return <option value={e}>{e}</option>;
											})}
										</select>
									</div>

									<div className="minuteItem">
										<label htmlFor="minuteText">Comment:</label>
										<textarea
											required
											name="minuteText"
											id="minuteText"
											cols="30"
											rows="8"></textarea>
									</div>
								</div>
							</div>
						</div>
						<footer>
							<button type="submit" className="primary" disabled={loading}>
								{loading ? (
									<CircularProgress
										thickness={5}
										size={20}
										sx={{ color: "white" }}
									/>
								) : (
									"Send"
								)}
							</button>
						</footer>
					</form>
				</dialog>
			)}
		</div>
	);
}
