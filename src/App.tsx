import React from 'react';
import './App.css';
import {Header} from "./Components/Header/Header";
import TodoContainer from "./Components/TodoContainer/TodoContainer";
import {actions, AppStateInterface, store} from "./store";

type AppProps = AppStateInterface & {dispatch: typeof store.dispatch}


function App(props: AppProps) {

  return (
    <div className="App">
      <Header>
        Header content
      </Header>
        <main>
            <TodoContainer todoItems={props.todoItems} dispatch={props.dispatch}/>
        </main>
        <footer>footer</footer>
    </div>
  );
}

export default App;
