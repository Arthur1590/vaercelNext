// !
// ? DISABLED
// !
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

interface LoaderProps {
    setHasLoaded: Dispatch<SetStateAction<boolean>>
}

export default function Loader({ setHasLoaded }: LoaderProps) {
    const [frame, setFrame] = useState(1)
    const framer = useRef<number | null>(null)

    useEffect(() => {
        framer.current = window.setInterval(() => {
            setFrame((f) => {
                if (f === 124) {
                    clearInterval(framer.current!)
                }
                return f + 1
            })
        }, 20)

        return () => {
            clearInterval(framer.current!)
        }
    }, [])

    // Вызываем setHasLoaded(true) с юзЭффектом тут для оптимального рендеринга
    useEffect(() => {
        if (frame === 124) {
            setHasLoaded(true)
        }
    }, [frame, setHasLoaded])

    return (
        <div className="w-full h-screen flex justify-center">
            <Image src={`/beer/BEER_${frame.toString().padStart(4, '0')}.png`} className="w-1/2 h-[70%]" width="0" height="0" sizes={'1000px'} alt="beer" priority />
        </div>
    )
}
