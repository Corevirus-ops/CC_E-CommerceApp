
import { useState, useEffect } from "react"
export default function SearchBar() {
    const [search, setSearch] = useState('');
    const [anim, setAnim] = useState('');

    function startIdle() {
        if (search) return;
        
    }

    useEffect(() => {

        if (search) return;
        if (anim.length >= 5) setAnim('search');
        setAnim(prev => `${prev}.`)

    }, [])

    useEffect(() => {

    }, [])

    return (
        <div className="flex row gap-1 fit relative app-border main-input">
            <input type="text" spellCheck="false" required placeholder={anim} />
        </div> 
    )
}