import React, { useCallback, useEffect, useState } from "react";
import "./addCommentModal.css";
import {
	CloseRounded,
	EditRounded,
	FileUploadRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { getThemeColor } from "../../utilities/themeColor";
import { CircularProgress } from "@mui/material";
import { COMMENT_STATUS_LIST } from "../../utilities/appData";

export default function AddCommentModal({
	buttonIcon,
	buttonText,
	children,
	data,
	reload,
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const themeColor = getThemeColor();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

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
			status: form.get("minuteStatus"),
			text: form.get("minuteText"),
		};
		// console.log(newData);

		try {
			let host = import.meta.env.VITE_SERVER;
			const res = await axios.post(
				`${host}/staffs/plan/${data._id}/comment`,
				newData
			);

			reload(() => []);
			handleClose();

			setTimeout(() => {
				toast.success(res.data, {
					position: "top-right",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: themeColor,
				});
			}, 200);
		} catch (error) {
			let message = error.response
				? error.response.data.message
				: error.message;
			// console.log(error);
			// console.log(message);

			setLoading(false);

			toast.error(message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: themeColor,
			});
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
				<button className="modalTrigger secondary" onClick={handleOpen}>
					Add Comment
				</button>
			</div>

			{open && (
				<dialog className="modalView">
					<header>
						<span>Plan - {data?.planNumber?.fullValue || data?.uniqueId}</span>
						<div className="modalViewCloseButton" onClick={handleClose}>
							<CloseRounded className="closeButton" />
						</div>
					</header>

					<form action="" onSubmit={handleSubmit}>
						<div className="applicationItemsWrapper">
							<div className="applicationTitle">
								<h3>Add Comment</h3>
							</div>

							<div>
								<div className="minuteItems">
									<div className="minuteItem">
										<label htmlFor="minuteStatus">Status:</label>
										<select name="minuteStatus" id="minuteStatus">
											<option value="">...</option>

											{COMMENT_STATUS_LIST.map((e) => {
												return <option value={e}>{e}</option>;
											})}
										</select>
									</div>

									<div className="minuteItem">
										<label htmlFor="minuteText">Comment:</label>
										<textarea
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
									"Save"
								)}
							</button>
						</footer>
					</form>
				</dialog>
			)}
		</div>
	);
}
