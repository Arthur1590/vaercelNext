/* eslint-disable @typescript-eslint/no-unused-vars */
import { profiles } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Nav({ profile }: { profile: profiles | null }) {
    const nav = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState(100)
    function getWidth(p: number) {
        return (p * width) / 100
    }
    useEffect(() => {
        if (nav.current) {
            setWidth(nav.current.clientWidth)
        }
    }, [nav])
    return (
        <div className="w-full relative flex justify-between items-center px-[10px] z-[2]" ref={nav}>
            <img src="/nav/bg.png" alt="bg" className="w-full h-full absolute top-0 left-0" />
            <Link href="/" className="z-[2]" style={{ width: getWidth(15) }}>
                <img src="/nav/logo.png" alt="Ordinal Jack" className="h-full" />
            </Link>
            <div className="flex gap-[20px] items-center z-[2]">
                <Link href="/game" className="flex justify-center" style={{ width: getWidth(9) }}>
                    <img src="/nav/game.png" alt="Game" className="h-full" />
                </Link>
                <Link href="/leaderboard" className="flex justify-center" style={{ width: getWidth(12) }}>
                    <img src="/nav/leaderboard.png" alt="Leaderboard" className="h-full" />
                </Link>
                <Link href="/checker" className="flex justify-center" style={{ width: getWidth(12) }}>
                    <img src="/nav/checker.png" alt="Wallet checker" className="h-full" />
                </Link>

                <Link href="/profile" className="flex justify-center" style={{ width: getWidth(7) }}>
                    <img src="/nav/profile.png" alt="Profile" className="h-full" />
                </Link>
                <Link href="/box" className="flex justify-center" style={{ width: getWidth(13) }}>
                    <img src="/nav/box.png" alt="Buy a box" className="h-full" />
                </Link>
            </div>
            <div className="flex gap-[20px] items-center z-[2]">
                <Link href="/discord" className="flex justify-center" style={{ width: getWidth(6) }}>
                    <img src="/nav/discord.png" alt="Discord" className="h-full" />
                </Link>
                <Link href="/twitter" className="flex justify-center" style={{ width: getWidth(6) }}>
                    <img src="/nav/twitter.png" alt="X" className="h-full" />
                </Link>
            </div>
        </div>
    )
}
