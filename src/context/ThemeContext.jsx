import {  createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext("")


export const ThemeProvider = ({children}) =>{
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "nord")

    useEffect(()=>{
        
        document.documentElement.setAttribute("data-theme",theme)
        localStorage.setItem("theme",theme)
    },[theme])

    const toggleTheme = ()=>{
        // console.log("theme chnaged ");
        
        setTheme((prev)=>(prev === "nord"? "night" : "nord"))
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const  useThemeContext = ()=> useContext(ThemeContext)

