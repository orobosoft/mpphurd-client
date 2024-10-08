import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./theme.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import "mapbox-gl/dist/mapbox-gl.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter
				// basename={import.meta.env.DEV ? "/" : "/mpphurd-client/"}
				>
					<App />
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
