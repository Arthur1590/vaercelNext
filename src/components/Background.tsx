import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function getFrame(num: number, min: number, max: number) {
    return num >= min ? (num < max ? num + 1 : min) : min
}

export default function Background() {
    const [frame, setFrame] = useState(1)
    const framer = useRef(0)

    useEffect(() => {
        framer.current = window.setInterval(() => {
            setFrame((f) => getFrame(f, 1, 26))
        }, 50)

        return () => {
            window.clearInterval(framer.current)
        }
    }, [])

    return <Image src={`/bubble/bubble${frame.toString().padStart(4, '0')}.png`} className="w-screen h-screen -z-[100] absolute top-0 left-0" width="0" height="0" sizes={'1000px'} alt="bubble" />
}
