import {text} from "stream/consumers";
import {isUndefined} from "util";

export enum TaskStatus {Completed = 1, New = 2, Expired = 3}

export class Task {
    _id: number;
    _text: string;
    _createTime: number; //seconds
    _completeTime: number; //seconds
    _status: TaskStatus;
    _intervalTimer?: NodeJS.Timer; //id of task expiration check timer

    constructor(text: string, completeInterval: number, status?: TaskStatus) {
        //create null task
        this._id = Task._getNewId();
        this._text = text || '';
        this._createTime = Date.now();
        this._completeTime = completeInterval ? Date.now() + (completeInterval * 1000) : Date.now() + 10000;
        this._status = status || TaskStatus.New;
        this._intervalTimer = setInterval(() => {
                if (this._status === TaskStatus.New) {
                    if (this._completeTime - Date.now() <= Task._intervalValue) { //if time expires
                        this._status = TaskStatus.Expired; //set expired status
                        clearInterval(this._intervalTimer) //stop interval checking
                    }
                }
            },
            Task._intervalValue) //interval of checking
    }

    static _intervalValue = 300; //interval of checking value
    static _count = 0; //number of created tasks
    static _getNewId = (): number => {
        return Task._count++
    };

    static compareExpiration = (a: Task, b: Task):number => {
        return a._completeTime-b._completeTime
    }

    get id() {
        return this._id
    }

    get status() {
        return this._status
    }

    set status(s) {
        this._status = this._status === TaskStatus.Expired ? TaskStatus.Expired : s
        if (s === TaskStatus.Completed) {
            this._completeTime = Date.now();
            clearInterval(this._intervalTimer)
        }

    };

    get text() {
        return this._text
    }

    set text(s) {
        this._text = s
    };

    get expirationTime() {
        return new Date(this._completeTime)
    }

    set expirationTime(s) {
        this._completeTime = (+s)
    };

    get createTime() {
        return new Date((this._createTime))
    }

}

export const store = {
    state: {
        todoItems: [] as Task[]
    },
    _subscriber(s: any) {
        console.log('no-subscribers')
    }, //subscribed function
    subscribe(observer: any) {
        this._subscriber = observer
    }, //subscribe function to store
    dispatch(action: any) {
        this.state = todoReducer(this.state, action) //all reducers
        this._subscriber(this.state)// call subscriber (rerender page)
    }
}
export type AppStateInterface = typeof store.state
store.state.todoItems.push(new Task('New task 1', 6))
store.state.todoItems.push(new Task('expired task', 1))
store.state.todoItems.push(new Task('New task 2', 15))
store.state.todoItems.push(new Task('New Completed 2', 15, TaskStatus.Completed))
store.state.todoItems.push(new Task('New Expired 2', 0, TaskStatus.Expired))

const todoReducer = (state: AppStateInterface, action: ActionsTypes): AppStateInterface => {
    switch (action.type) {
        case 'UPDATE_TASK_TEXT': {
            const {task, text} = action.payload
            task.text = text;
            return {
                ...state,
            }
            break;
        }
        case "UPDATE_TASK_STATUS": {
            const {task, status} = action.payload
            task.status = status;
            return {
                ...state,
            }
            break;
        }
        case "TICK": {
            return {...state};
            break
        }
        case "CREATE_NEW_TASK": {
            const task = new Task(action.payload.text, action.payload.expiration);
            const todoList = [...state.todoItems, task]
                //.sort((a,b)=>Task.compareExpiration(a,b))
            return {
                ...state,
                todoItems: todoList
            }

            break
        }
        default:
            return state
    }
}
/*/промежуточный тип pt который уточняется через Т. и если Т это объект, то вернём объединение его значений свойств
//result = condition ? trueExpression : falseExpression
//result Type = SomeType extends OtherType ? TrueType : FalseType
//infer U - запоминаем в переменную U то что стоит на её месте
//в нашем случае - U будет иметь тип 'Функция(paramsType):returnType' -*/
type pt<T> = T extends { [key: string]: infer U } ? U : never
//чтобы заработало нужно возвращаемый объект пометить readonly: ({})as const
//выводимый тип экшенов
type ActionsTypes = ReturnType<pt<typeof actions>>


export const actions = {
    updateTaskText(task: Task, text: string) {
        return ({type: 'UPDATE_TASK_TEXT', payload: {task, text}}) as const
    },
    updateTaskStatus(task: Task, status: TaskStatus) {
        return ({type: 'UPDATE_TASK_STATUS', payload: {task, status}}) as const
    },
    tick() {
        return ({type: 'TICK'}) as const
    },
    createNewTask(text: string, expiration: number){
        return ({type: 'CREATE_NEW_TASK', payload: {text, expiration}}) as const
    },
}
