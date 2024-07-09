'use client'

import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useRef, useState } from 'react'
import { makeCtx } from '@/game/context'
import game from '@/game/scenes/game'
import gameover from '@/game/scenes/gameover'
import { profiles } from '@prisma/client'
import Link from 'next/link'

export default function Game({ profile }: { profile: profiles }) {
    const nav = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [width, setWidth] = useState(1500)
    function getWidth(p: number) {
        return (p * width) / 100
    }
    useEffect(() => {
        if (nav.current) {
            setWidth(nav.current.clientWidth)
        }
    }, [nav])
    useEffect(() => {
        const k = makeCtx(canvasRef, nav)
        k.scene('game', game)
        k.scene('gameover', gameover)
        k.go('game', k, profile)
    }, [nav])

    return (
        <div className="w-full h-screen flex flex-col bg-[#e19e18]">
            <div className="w-full relative flex justify-between items-center px-[10px]" ref={nav}>
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
                    <Link href="/discord" className="flex justify-center" style={{ width: getWidth(6) }}>
                        <img src="/nav/twitter.png" alt="X" className="h-full" />
                    </Link>
                </div>
            </div>
            <canvas className="w-full h-full bg-black" ref={canvasRef}></canvas>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)
    const { data, error } = await supabase.auth.getUser()

    if (error || !data) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const profile = await prisma.profiles.findUnique({ where: { id: data.user.id } })
    if (!profile || !profile.wallet) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            },
        }
    }

    return { props: { profile } }
}
