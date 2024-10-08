import "./adminOfficeEditModal.css";
import {
	AddPhotoAlternateRounded,
	FileUploadRounded,
	Image,
	UploadFileRounded,
} from "@mui/icons-material";
import ToggleSwitch from "../toggleSwitch/ToggleSwitch";
import React, { useCallback, useEffect, useState } from "react";
import { CloseRounded, EditRounded } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { getThemeColor } from "../../utilities/themeColor";
import axios from "axios";
import { TASK_LIST } from "../../utilities/appData";
import { fetchInstance } from "../../utilities/fetcher";

export default function AdminOfficeEditModal({ ...props }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState(null);
	const [regions, setRegions] = useState([]);

	const [loading, setLoading] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [officeStaff, setOfficeStaff] = useState();
	const [officeLead, setOfficeLead] = useState();

	const [name, setName] = useState(undefined);
	const [region, setRegion] = useState(undefined);
	const [zone, setZone] = useState(undefined);
	const [tasks, setTasks] = useState([]);

	const theme = getThemeColor();

	const [removeTaskButton, setRemoveTaskButton] = useState(null);

	const handleOpen = () => {
		setRegions(props.region);
		if (props.modalType === "edit") {
			setData(props.data);
			setIsActive(props.data.isActive);
			setName(props.data.name);
			setRegion(props.data.region);
			setZone(props.data.zone);
			setTasks(props.data.tasks);
			setIsActive(props.data.isActive);
			setOfficeLead(props.data.lead);
			setOfficeStaff(
				props.staff.filter((s) =>
					s.office.some((office) => office?.id?._id === props.data?._id)
				)
			);
		} else {
			setRegion(props.region[0]);
		}
		setOpen(true);
	};
	const handleClose = () => {
		setLoading(false);
		setOpen(false);
		setName(undefined);
		setRegion(undefined);
		setZone(undefined);
		setTasks([]);
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

	useEffect(() => {
		const modal = document.querySelector(".adminOfficeEditModal");
		if (modal) {
			open ? modal.showModal() : modal.close();
		}
		return () => {};
	}, [open]);

	const handleSubmitNew = async () => {
		setLoading(true);
		let newData = {};
		newData.isActive = isActive;
		name && (newData.name = name);
		region && (newData.region = region._id);
		zone && (newData.zone = zone);
		tasks && (newData.tasks = tasks.filter((str) => str !== ""));

		try {
			let res = await fetchInstance.post(`/admin/office`, newData);

			handleClose();

			props.setReload(() => []);

			setTimeout(() => {
				toast.success(res.data, {});
			}, 0);
		} catch (error) {
			setLoading(false);

			let message = error.response
				? error.response.data.message
				: error.message;

			toast.error(message, {});
		}
	};
	const handleSubmitEdit = async () => {
		setLoading(true);
		let newData = {};
		newData.isActive = isActive;
		name && (newData.name = name);
		region && (newData.region = region._id);
		officeLead && (newData.lead = officeLead);
		zone && (newData.zone = zone);
		tasks && (newData.tasks = tasks.filter((str) => str !== ""));

		try {
			let res = await fetchInstance.put(`/admin/office/${data._id}`, newData);

			setLoading(false);
			setOpen(false);
			props.setReload(() => []);

			setTimeout(() => {
				toast.success(res.data, {});
			}, 0);
		} catch (error) {
			setLoading(false);

			let message = error.response
				? error.response.data.message
				: error.message;

			toast.error(message, {});
		}
	};

	return (
		<>
			<button className={props.buttonClass} onClick={handleOpen}>
				{props.buttonIcon}
				{props.buttonName}
			</button>

			{open && (
				<dialog className="modalView adminOfficeEditModal ">
					<header>
						<span>
							{props.modalType === "add"
								? "Create New Office"
								: props.modalType === "edit"
								? "Edit Office Info"
								: ""}
						</span>

						<div className="modalViewCloseButton" onClick={handleClose}>
							<CloseRounded className="closeButton" />
						</div>
					</header>

					<div className="applicationForm">
						<div className="applicationInputWrapper">
							<div className="applicationItemsWrapper">
								<div className="inputStaffHeader">
									<div className="inputStaffHeaderLeft">
										<div>
											<span>Active Status:</span>
										</div>
									</div>
									<div className="inputStaffHeaderRight">
										<div>
											<ToggleSwitch
												toggled={isActive}
												label={"isActive"}
												onClick={setIsActive}
											/>
										</div>
									</div>
								</div>
								<div className="applicationTitle">
									<h3>Office Information</h3>
								</div>
								<div className="applicationItems">
									<div className="applicationItem">
										<label htmlFor={"adminEditOfficeName"}>Office Name:</label>
										<input
											type="text"
											name={"adminEditOfficeName"}
											id={"adminEditOfficeName"}
											value={name}
											onChange={(e) => setName(e.target.value.toUpperCase())}
										/>
									</div>

									<div className="applicationItem">
										<div className="applicationItemType">
											<div>
												<label htmlFor="adminEditOfficeRegion">Region:</label>
												<select
													name="adminEditOfficeRegion"
													id="adminEditOfficeRegion"
													defaultValue={region?._id}
													// onChange={(e) => setRegion(regions[e.target.value])}>

													onChange={(e) => {
														const reg = regions.find(
															(option) => option._id === e.target.value
														);
														setRegion(reg);
													}}>
													{regions?.map((r, i) => {
														return (
															<option key={i} data={i} value={r._id}>
																{r.name}
															</option>
														);
													})}
												</select>
											</div>
											<div>
												<label htmlFor="adminEditOfficeZone">Zone:</label>
												<select
													name="adminEditOfficeZone"
													id="adminEditOfficeZone"
													defaultValue={zone ? zone : ""}>
													{region?.zones?.map((rz) => {
														return <option value={rz}>{rz}</option>;
													})}
													<option value="">----</option>
												</select>
											</div>
										</div>
									</div>

									<div className="applicationTitle">
										<h3>Office Lead</h3>
									</div>

									<select
										name=""
										id=""
										defaultValue={officeLead?.id}
										onChange={(e) => {
											const val = e.target.value;
											const newD = {};
											newD.id = val;
											const user = officeStaff.filter((s, i) => {
												return s._id === val;
											});

											const name = [
												user[0].title,
												user[0].firstName,
												user[0].middleName,
												user[0].lastName,
												user[0].prefix,
											]
												.filter(
													(value) =>
														value != null && value !== "" && value !== undefined
												)
												.join(" ");
											newD.name = name;
											// console.log(newD);
											setOfficeLead(newD);
										}}>
										<option value="">---</option>
										{officeStaff.map((s, i) => (
											<option value={s._id} key={i}>
												{[
													s.title,
													s.firstName,
													s.middleName,
													s.lastName,
													s.prefix,
												]
													.filter(
														(value) =>
															value != null &&
															value !== "" &&
															value !== undefined
													)
													.join(" ")}
											</option>
										))}
									</select>

									{/* <br /> */}
									<div className="applicationTitle">
										<h3>Office Tasks</h3>
									</div>
									{tasks?.map((d, i) => {
										return (
											<div
												key={i}
												className="applicationItem zones"
												onMouseEnter={() => setRemoveTaskButton(i)}
												onMouseLeave={() => setRemoveTaskButton(false)}>
												{removeTaskButton === i && (
													<div className="removeItemButton">
														<CloseRounded
															className="clearPhotoIcon"
															onClick={() => {
																let newArr = [...tasks];
																newArr.splice(i, 1);
																setTasks(newArr);
															}}
														/>
													</div>
												)}
												<label htmlFor={"adminEditOfficeTaskCount"}>
													{i + 1} :
												</label>

												<select
													name={"adminEditOfficeTaskCount"}
													id={"adminEditOfficeTaskCount"}
													defaultValue={tasks[i]}
													onChange={(e) => {
														let newArr = [...tasks];
														newArr[i] = e.target.value.toUpperCase().trim();
														setTasks(newArr);
													}}>
													<option value=""></option>
													{TASK_LIST.map((e) => {
														return <option value={e}>{e}</option>;
													})}
												</select>

												{/* <input
													type="text"
													name={"adminEditOfficeTaskCount"}
													id={"adminEditOfficeTaskCount"}
													value={tasks[i]}
													// onChange={(e)=>setTasks(tasks[i] = e.target.value)}
													onChange={(e) => {
														let newArr = [...tasks];
														newArr[i] = e.target.value.toUpperCase().trim();
														setTasks(newArr);
													}}
												/> */}
											</div>
										);
									})}
									<button
										onClick={() => {
											let newArr = [...tasks];
											newArr.push("");
											setTasks(newArr);
										}}>
										Add
									</button>
								</div>
							</div>
						</div>
					</div>
					<footer>
						{/* <div>
							{props.modalType === "edit" && (
								<button className="deleteBtn">Delete</button>
							)}
						</div> */}
						{/* <div> */}
						<button
							disabled={loading}
							onClick={
								props.modalType === "edit" ? handleSubmitEdit : handleSubmitNew
							}
							className="primary">
							{loading ? (
								<CircularProgress
									thickness={5}
									size={20}
									sx={{ color: "white" }}
								/>
							) : props.modalType === "edit" ? (
								"Update"
							) : (
								"Save"
							)}
						</button>
						{/* </div> */}
					</footer>
				</dialog>
			)}
		</>
	);
}
