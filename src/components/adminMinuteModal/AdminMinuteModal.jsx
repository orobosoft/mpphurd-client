import React, { useCallback, useEffect, useState } from "react";
import "./adminMinuteModal.css";
import {
	CloseRounded,
	EditRounded,
	FileUploadRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { getThemeColor } from "../../utilities/themeColor";
import { CircularProgress } from "@mui/material";
import { MINUTE_STATUS_LIST } from "../../utilities/appData";
import { fetchInstance } from "../../utilities/fetcher";

export default function AdminMinuteModal({
	buttonIcon,
	buttonText,
	children,
	data,
	reload,
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [planData, setPlanData] = useState(data);

	const [officeList, setOfficeList] = useState([]);
	const [staffList, setStaffList] = useState([]);
	const [initLoading, setInitLoading] = useState(false);

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

		let newData = {
			newOfficeId: form.get("minuteToOfficer"),

			status: form.get("minuteStatus"),
			text: form.get("minuteText"),
			date: form.get("minuteItemData"),
			fromOfficeId: form.get("minuteFromOffice"),
		};

		// console.log(newData);

		try {
			const res = await fetchInstance.post(
				`/admin/plan/${data._id}/minute`,
				newData
			);
			// console.log(res.data);

			// dispatch(resetOfficeData());
			// navigate(-2);
			reload(() => []);
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

			toast.error(message, {});
		}
		setLoading(false);
	};

	useEffect(() => {
		const modal = document.querySelector(".modalView");
		if (modal) {
			open ? modal.showModal() : modal.close();
		}
	}, [open]);

	// Fetch Data on Load
	useEffect(() => {
		setInitLoading(true);

		const getData = async () => {
			try {
				const res = await Promise.all([
					fetchInstance.get(`/admin/office`),
					fetchInstance.get(`/admin/staff/active`),
				]);

				const office = res[0].data;
				const staff = res[1].data;
				// console.log(staff);

				let currentStaffList = staff.filter((s) =>
					s?.office?.some((so) => so?.id?._id === data?.currentOffice?.id?._id)
				);

				setStaffList(currentStaffList);

				// console.log(staff);

				let presentOfficeList = office.map((o) => {
					// Prevent showing current plan office
					// if (o._id === data.currentOffice?.id?._id) return;

					let officeStaff = staff.filter((s) =>
						s.office.some((so) => so?.id?._id === o._id)
					);
					let text;
					if (officeStaff.length === 0) {
						text = `${o.name}`;
					} else if (officeStaff.length > 1) {
						text = `${o.name} (Multiple)`;
					} else {
						text = `${o.name} (${officeStaff[0].fullName})`;
					}
					return {
						office: o,
						officeId: o._id,
						text,
					};
				});

				// Sort list and set as office list
				setOfficeList(
					presentOfficeList.sort((a, b) => {
						const nameA = a.text.toUpperCase(); // ignore upper and lowercase
						const nameB = b.text.toUpperCase(); // ignore upper and lowercase
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						// names must be equal
						return 0;
					})
				);
				// console.log("Office List:", officeList);
				// console.log("Staff List:", staffList);
				setInitLoading(false);
			} catch (error) {
				let message = error.response
					? error.response.data.message
					: error.message;
				// console.log(error);
				// console.log(message);
			}
		};
		getData();
	}, []);

	return (
		<div>
			<div>
				<button className="modalTrigger primary" onClick={handleOpen}>
					Minute
				</button>
			</div>

			{open && (
				<dialog className="modalView">
					{initLoading ? (
						<div className="loading-container">
							<CircularProgress
								thickness={3}
								size={55}
								className="loading-icon"
							/>
						</div>
					) : (
						<>
							<header>
								<span>{data?.planNumber?.fullValue || data?.uniqueId}</span>
								<div className="modalViewCloseButton" onClick={handleClose}>
									<CloseRounded className="closeButton" />
								</div>
							</header>

							<form action="" onSubmit={handleSubmit}>
								<div className="applicationItemsWrapper">
									<div className="applicationTitle">
										<h3>Minute Plan</h3>
									</div>

									<div>
										<div className="minuteItems">
											<div className="minuteItem">
												<label htmlFor="minuteItemData">
													Date:{" "}
													<span className="optionIssueTag">
														Do not select a date except for backlog
													</span>
												</label>
												<input
													type="date"
													name="minuteItemData"
													id="minuteItemData"
												/>
											</div>

											{/* Show from staff if plan office is captured */}
											{/* {data?.currentOffice?.id && (
										<div className="minuteItem">
											<label htmlFor="minuteFromOfficer">From Officer:</label>
											<select name="minuteFromOfficer" id="minuteFromOfficer">
												{staffList.map((o) => {
													console.log(o);
													if (o?._id) {
														return (
															<option key={o._id} value={o._id}>
																{o?.region?.code.toUpperCase()} -{" "}
																{data.currentOffice?.id?.name} ({o?.fullName})
															</option>
														);
													}
												})}
											</select>
										</div>
									)} */}

											{/* Show from office if plan current office is not yet captured */}
											{/* {data?.currentOffice?.id && ( */}
											<div className="minuteItem">
												<label htmlFor="minuteToOfficer">From Office:</label>

												<select name="minuteFromOffice" id="minuteFromOffice">
													<option value=""></option>
													{officeList.map((o) => {
														if (o?.officeId) {
															return (
																<option key={o.officeId} value={o.officeId}>
																	{o.text}
																</option>
															);
														}
													})}
												</select>
											</div>
											{/* )} */}
											<div className="minuteItem">
												<label htmlFor="minuteToOfficer">To Office:</label>

												<select name="minuteToOfficer" id="minuteToOfficer">
													<option value=""></option>
													{officeList.map((o) => {
														if (o?.officeId) {
															return (
																<option key={o.officeId} value={o.officeId}>
																	{o.text}
																</option>
															);
														}
													})}
												</select>
											</div>

											<div className="minuteItem">
												<label htmlFor="minuteStatus">Status:</label>
												<select required name="minuteStatus" id="minuteStatus">
													<option value="">...</option>
													{MINUTE_STATUS_LIST.map((e) => {
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
													rows="7"></textarea>
											</div>
										</div>
									</div>
								</div>
								<footer>
									<button type="submit" className="primary">
										{loading ? (
											<CircularProgress
												thickness={5}
												size={20}
												sx={{ color: "white" }}
											/>
										) : (
											"Minute"
										)}
									</button>
								</footer>
							</form>
						</>
					)}
				</dialog>
			)}
		</div>
	);
}
