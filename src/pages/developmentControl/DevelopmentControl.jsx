import FeedBackground from "../../components/feedBackground/FeedBackground";
import Header from "../../components/header/Header";
import SideBar from "../../components/sidebar/SideBar";

export default function DevelopmentControl() {
	return (
		<>
			<Header />
			<div className="homeContainer">
				<SideBar />
				<FeedBackground></FeedBackground>
			</div>
		</>
	);
}
