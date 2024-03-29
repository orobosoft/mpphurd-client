import { useSelector } from "react-redux";


export const getThemeColor = () => {
	const { theme } = useSelector((state) => state.app);
	const isDark = window.matchMedia("(prefers-color-scheme: dark)");

	if (theme === "light") {
		return "light";
	} else if (theme === "dark") {
		return "dark";
	} else {
		if (!isDark) {
			return "dark";
		} else {
			return "light";
		}
	}
};

export const setThemeColor = (t) => {
	const isDark = window.matchMedia("(prefers-color-scheme: dark)");
	const doc = document.querySelector("html");

	if (t === "light") {
		doc.dataset.theme = "light";
	} else if (t === "dark") {
		doc.dataset.theme = "dark";
	} else {
		!isDark ? (doc.dataset.theme = "dark") : (doc.dataset.theme = "light");
	}
};
