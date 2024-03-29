import "./adminOfficeList.css";
import MiddleBar from "../../../components/middleBar/MiddleBar";
import ListWrapper from "../../../components/listWrapper/ListWrapper";
import AdminHeader from "../../../components/adminHeader/AdminHeader";
import AdminSideBar from "../../../components/adminSideBar/AdminSideBar";
import ListCardContainer from "../../../components/listCardContainer/ListCardContainer";
import ListCard from "../../../components/listCard/ListCard";
import {
	AddCard,
	AddRounded,
	Apartment,
	ApartmentRounded,
	CorporateFareRounded,
	ExpandMoreRounded,
	PersonAddRounded,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import AdminOfficeEditModal from "../../../components/adminOfficeEditModal/AdminOfficeEditModal";
import { getThemeColor } from "../../../utilities/themeColor";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingIcon from "../../../utilities/LoadingIcon";
import { getFullName } from "../../../utilities/getFullName";
import AdminStaffView from "../adminStaffView/adminStaffView";
import { CircularProgress } from "@mui/material";

export default function AdminOfficeList() {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState();
	const [staff, setStaff] = useState([]);
	const [region, setRegion] = useState([]);
	const themeColor = getThemeColor();
	const [reload, setReload] = useState();

	const navigate = useNavigate();

	useEffect(() => {
		const getData = async () => {
			try {
				let host = import.meta.env.VITE_SERVER;

				const res = await Promise.all([
					axios.get(`${host}/admin/office`),
					axios.get(`${host}/admin/staff`),
					axios.get(`${host}/admin/region`),
				]);

				setData(res[0].data);
				setStaff(res[1].data);
				setRegion(res[2].data);
				setIsLoading(false);

				// console.log(res[0].data);
				// console.log(res[1].data);
			} catch (error) {
				let message = error.response
					? error.response.data.message
					: error.message;
				// console.log(error);
				// console.log(message);

				setTimeout(() => {
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
				}, 0);
				setIsLoading(false);
			}
		};

		getData();

		// return () => {
		// 	second
		// }
	}, [reload]);

	const todayDate = new Date().toISOString().slice(0, 10);
	return (
		<>
			<div className="pageWrapper"></div>

			<div className="Office">
				<AdminHeader />
				<div className="OfficeWrapper">
					<div className="OfficeSideBar">
						<AdminSideBar selected={"office"} />
					</div>

					<div className="OfficeMiddleBar">
						<MiddleBar
							topBarData={{
								action: "Office List",
								options: (
									<AdminOfficeEditModal
										modalType={"add"}
										buttonIcon={<AddRounded />}
										buttonClass={"addStaffButton primary"}
										buttonName={"Create Office"}
										setReload={setReload}
										region={region}
									/>
								),
							}}>
							{isLoading && <LoadingIcon />}
							{data && (
								<>
									<div className="listQuery">
										<div className="listQueryOptions">
											<span>REGION: </span>
											<select name="listQueryOption" id="listQueryOption">
												<option value="incoming">Benin</option>
												{/* <option value="Outgoing">Outgoing</option> */}
												{/* <option value="current">Current</option> */}
											</select>
										</div>

										<div>
											<input type="text" placeholder="Search list..." />
										</div>

										<div className="listCount">
											<span>Count:</span>
											<span>{data.length}</span>
										</div>

										<div className="listSort">
											<span>Latest to Oldest</span>
											<ExpandMoreRounded />
										</div>
									</div>
									<div className="adminStaffListHeader">
										<span className="adminOfficeListHeader__name"> Name</span>
										<span className="adminOfficeListHeader__staff">Staff</span>
										<span className="adminOfficeListHeader__tasks">Tasks</span>
										<span className="adminOfficeListHeader__region">
											Region
										</span>
										<span className="adminOfficeListHeader__status">
											Status
										</span>
										<span className="adminOfficeListHeader__edit">Edit</span>
									</div>

									<div className="adminStaffListCardWrapper">
										{data.map((d) => {
											return (
												<div className=" adminOfficeListCard" key={d._id}>
													<div className="adminOfficeListCard__name">
														{d.name}
													</div>

													<div className="adminOfficeListCard__staff">
														{staff
															.filter((s) =>
																s.office.some(
																	(office) => office?.id?._id === d?._id
																)
															)
															.map((s, i) => (
																<span
																	key={i}
																	onClick={() => {
																		navigate("/staffs/staff", {
																			state: { data: s },
																		});
																	}}>
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
																</span>
															))}
													</div>
													<div className="adminOfficeListCard__tasks">
														{d.tasks.map((word) => {
															let wordsArray = word.split(" ");
															let capitalizedArray = wordsArray.map(
																(word) =>
																	word.charAt(0).toUpperCase() + word.slice(1)
															);
															return capitalizedArray.join(" ");
														})}
													</div>
													<div className="adminOfficeListCard__region">
														{d?.region?.name}
													</div>
													<div
														className={
															d.isActive
																? "adminOfficeListCard__status active"
																: "adminOfficeListCard__status inactive"
														}>
														{d.isActive ? "Active" : "Inactive"}
													</div>

													<div className="adminOfficeListCard__edit">
														<AdminOfficeEditModal
															className="adminOfficeListCardEditButton"
															buttonName={"Edit"}
															modalType={"edit"}
															setReload={setReload}
															data={d}
															region={region}
														/>
													</div>
												</div>
											);
										})}
										{/*
										<ListCard />
										<ListCard /> */}
									</div>
								</>
							)}
						</MiddleBar>
					</div>
				</div>
			</div>
		</>
	);
}
