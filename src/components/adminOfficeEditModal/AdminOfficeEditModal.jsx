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

export default function AdminOfficeEditModal({ ...props }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState(null);
	const [regions, setRegions] = useState([]);

	const [loading, setLoading] = useState(false);
	const [isActive, setIsActive] = useState(true);

	const [name, setName] = useState(undefined);
	const [region, setRegion] = useState(undefined);
	const [zone, setZone] = useState(undefined);
	const [tasks, setTasks] = useState([]);

	const [regionZones, setRegionZones] = useState(null);

	const [removeTaskButton, setRemoveTaskButton] = useState(null);

	const handleOpen = () => {
		setOpen(true);

		if (props.modalType === "edit") {
			setRegions(props.region);
			setData(props.data);
			setIsActive(props.data.isActive);
			setName(props.data.name);
			setRegion(props.data.region);
			setZone(props.data.zone);
			console.log("REGION DATA", props.data.region);
			setZone(props.data.zone);
			setTasks(props.data.tasks);
			setIsActive(props.data.isActive);
		}
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
		code && (newData.code = code);
		name && (newData.name = name);
		zones && (newData.zones = zones.filter((str) => str !== ""));

		try {
			let host = import.meta.env.VITE_SERVER;
			let res = await axios.post(`${host}/admin/region`, newData);

			handleClose();

			props.setReload(() => []);

			setTimeout(() => {
				toast.success(res.data, {
					position: "top-right",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: theme,
				});
			}, 0);
		} catch (error) {
			setLoading(false);

			let message = error.response
				? error.response.data.message
				: error.message;

			toast.error(message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: theme,
			});
		}
	};
	const handleSubmitEdit = async () => {
		setLoading(true);
		let newData = {};
		newData.isActive = isActive;
		code && (newData.code = code);
		name && (newData.name = name);
		zones && (newData.zones = zones.filter((str) => str !== ""));

		try {
			let host = import.meta.env.VITE_SERVER;
			let res = await axios.put(`${host}/admin/region/${data._id}`, newData);

			setLoading(false);
			setOpen(false);
			props.setReload(() => []);

			setTimeout(() => {
				toast.success(res.data, {
					position: "top-right",
					autoClose: 1000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: theme,
				});
			}, 0);
		} catch (error) {
			setLoading(false);

			let message = error.response
				? error.response.data.message
				: error.message;

			toast.error(message, {
				position: "top-right",
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: theme,
			});
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
					{console.log(regionZones)}
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
										<label htmlFor={"officeName"}>Office Name:</label>
										<input
											type="text"
											name={"officeName"}
											id={"officeName"}
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>

									<div className="applicationItem">
										<div className="applicationItemType">
											<div>
												<label htmlFor="staffOffice">Region:</label>
												<select
													name="staffOffice"
													id="staffOffice"
													onChange={(e) => setRegionZones(e.target.value)}>
													{/* {console.log(region.zones)} */}

													{regions.map((r) => {
														console.log(regions);
														return (
															<option
																selected={r._id === region._id}
																value={r.zones}>
																{r.name}
															</option>
														);
													})}
												</select>
											</div>
											<div>
												<label htmlFor="staffOffice">Zone:</label>
												<select name="staffOffice" id="staffOffice" defaultValue={zone}>
													{regionZones?.split(",").map((sr) => {
														console.log(sr[0]);
														return (
															<option value={sr}>
																{sr}
															</option>
														);
													})}
												</select>
											</div>
										</div>
									</div>

									{/* <br /> */}
									<div className="applicationTitle">
										<h3>Tasks</h3>
									</div>
									{tasks.map((d, i) => {
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
												<label htmlFor={"staffAddress"}>{i + 1} :</label>
												<input
													type="text"
													name={"staffAddress"}
													id={"staffAddress"}
													value={tasks[i]}
													// onChange={(e)=>setTasks(tasks[i] = e.target.value)}
													onChange={(e) => {
														let newArr = [...tasks];
														newArr[i] = e.target.value;
														setTasks(newArr);
													}}
												/>
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

									{/* <div className="applicationItem">
										<label htmlFor="">Office and Tasks</label>
										<div className="inputStaffOfficeWrapper">
											<div className="inputStaffOfficeList">
												<div className="inputStaffOffice">
													<button>-</button>
													<div>
														<label>Office</label>
														<select name="" id=""></select>
													</div>
													<div>
														<label>Tasks</label>
														<div className="taskList">
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Task 1</label>
															</span>
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Minute FIle</label>
															</span>
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Create Plan</label>
															</span>
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Send File</label>
															</span>
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Upload Document</label>
															</span>
															<span>
																<input type="checkbox" name="task" id="task" />
																<label htmlFor="task">Send Message</label>
															</span>
														</div>
													</div>
												</div>
											</div>
											<button>+</button>
										</div>
									</div> */}
								</div>
							</div>
						</div>
					</div>
					<footer>
						<button className="primary">
							{props.modalType === "edit" ? "Update" : "Save"}
						</button>
					</footer>
				</dialog>
			)}
		</>
	);
}
