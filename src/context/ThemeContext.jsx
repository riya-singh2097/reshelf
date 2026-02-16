import {  createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext("")


export const ThemeProvider = ({children}) =>{
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "emerald")

    useEffect(()=>{
        
        document.documentElement.setAttribute("data-theme",theme)
        localStorage.setItem("theme",theme)
    },[theme])

    const toggleTheme = ()=>{
        // console.log("theme chnaged ");
        
        setTheme((prev)=>(prev === "emerald"? "night" : "emerald"))
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const  useThemeContext = ()=> useContext(ThemeContext)

