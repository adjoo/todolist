import React, {ChangeEventHandler, useId, useState} from 'react';
import style from '../TodoContainer/TodoContainer.module.sass'
import TodoItem from "./TodoItem";
import {actions, Task, TaskStatus} from "../../store";


interface TodoContainerProps {
    todoItems: Task[],
    dispatch: any
}

const TodoContainer = (props: TodoContainerProps) => {
    const todoItems = props.todoItems


    const uid = useId();

    const [todoText, setTodoText] = useState('');
    const [todoExpiration, setTodoExpiration] = useState(15);

    const onEditText = (e: React.ChangeEvent<HTMLTextAreaElement>):void => {
        setTodoText(e.currentTarget.value)
    }
    const onEditNumber = (e: React.ChangeEvent<HTMLInputElement>):void => {
        if(+e.currentTarget.value <=0){
            setTodoExpiration(0)
        } else {
            setTodoExpiration(+e.currentTarget.value)
        }

    }
    const onSubmit = ()=>{
        props.dispatch(actions.createNewTask(todoText,todoExpiration))
        setTodoText('')
        setTodoExpiration(10)
    }

    return (
        <div className={style.TodoContainer}>

            <ul className={'TodoList'}>
                {todoItems.map((t, i) => <TodoItem key={i}
                                                   task={t}
                                                   id={t.id}
                                                   taskText={t.text}
                                                   taskStatus={t.status}
                                                   taskExpireTime={t.expirationTime}
                                                   dispatch={props.dispatch}/>)}
            </ul>

            <div className={style.TodoForm}>
                <h3>Add new Task</h3>
                <div className={style.TodoFormLine}>
                    <textarea id={`${uid}_number`} value={todoText} onChange={onEditText}/>
                    <label htmlFor={`${uid}_text`}>New task:</label>
                </div>
                <div className={style.TodoFormLine}>
                    <input id={`${uid}_number`} type="number" value={todoExpiration} onChange={onEditNumber}/>
                    <label htmlFor={`${uid}_number`}>Timer:</label>
                </div>
                <div className={style.TodoFormLine}>
                    <button onClick={onSubmit}>Отправить</button>
                </div>
            </div>

        </div>

    );
}

export default TodoContainer
