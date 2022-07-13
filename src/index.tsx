import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {actions, AppStateInterface, store} from "./store";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const rerend = (state: AppStateInterface ) => {
    root.render(
        <React.StrictMode>
            <App {...state} dispatch={store.dispatch.bind(store)}/>
        </React.StrictMode>
    );
}
rerend(store.state)

store.subscribe(rerend)

const ticker = setInterval(()=>{store.dispatch(actions.tick())}, 200)