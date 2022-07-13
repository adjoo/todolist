import React, {useRef, useState} from 'react';
import style from '../TodoContainer/TodoContainer.module.sass'
import complete from '../../assets/checkmark.svg'
import expired from '../../assets/cross.svg'
import {actions, Task, TaskStatus} from "../../store";


interface TodoItemProps {
    task: Task,
    id: number,
    taskText: string,
    taskStatus: TaskStatus,
    taskExpireTime: Date,
    dispatch: any,
}

const TodoItem = (props: TodoItemProps) => {
    const taskStatus = props.taskStatus;

    const taskCompleteTime = taskStatus===TaskStatus.New
        ? Math.floor((props.taskExpireTime.getTime() - Date.now())/1000)
        : props.taskExpireTime.toLocaleTimeString();
    const [taskText,setTaskText] = useState(props.taskText);
    const [isEditModeText, setIsEditText] = useState(false)
    const inputRef = useRef(null)
    const activateEditTextMode = ()=>{
        if (taskStatus===TaskStatus.New){setIsEditText(true);}
    };
    const onInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {setTaskText(e.currentTarget.value)}
    const onBlur = () => {
        setIsEditText(false);
        props.dispatch(actions.updateTaskText(props.task, taskText))
    }
    const onStatusClick = ()=>{
        console.log(props.taskStatus)
        props.dispatch(actions.updateTaskStatus(props.task, TaskStatus.Completed));
    }
    return (
        <li className={style.TodoItem}>
            <div className={style.TodoItemStatusIcon} onClick={onStatusClick}>

                {taskStatus == TaskStatus.Expired && <img src={expired} alt="expired"/>}
                {taskStatus == TaskStatus.Completed && <img src={complete} alt="completed"/>}
            </div>
            <div className={style.TodoItemText}>
                {isEditModeText && <input ref={inputRef} type={'text'} value={taskText}
                                        onChange={onInputChange} autoFocus={true}
                                        onBlur={onBlur}/>}
                {!isEditModeText &&<span onDoubleClick={activateEditTextMode}>{taskText}</span>}
            </div>
            <div className={style.TodoItemDate}>
                {taskStatus===TaskStatus.New && <span>{taskCompleteTime} sec</span>}
                {taskStatus!==TaskStatus.New && taskCompleteTime}
            </div>
        </li>
    );
}

export default TodoItem
