import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./scss/index.scss";
import App from "./components/App";
import ModalManager from "./components/ModalManager";
import WindowSizeListener from "./components/WindowSizeListener";
import TabViewManager from './components/TabViewManager';
import ReadOnlyListener from "./components/ReadOnlyListener";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <WindowSizeListener>
    <Provider store={store}>
      <ModalManager>
        <TabViewManager>
          <ReadOnlyListener>
            <App />
          </ReadOnlyListener>
        </TabViewManager>
      </ModalManager>
    </Provider>
  </WindowSizeListener>
);
