import React, {useEffect, useId, useRef, useState} from "react";
import style from './Header.module.sass'
interface HeaderProps {
    children?: React.ReactNode
}

export const Header = (props:HeaderProps) => {



    return(
        <header className={style.MainHeader}>
            <h1>Todo list </h1>
        </header>
    )
}
