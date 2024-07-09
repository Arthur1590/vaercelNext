import Nav from '@/components/Nav'
import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { profiles } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { useRef, useState } from 'react'
import ToastComponent from '../components/Toast'
import axios from 'axios'
import Background from '@/components/Background'

export default function Chest({ profile: p }: { profile: profiles }) {
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState<boolean>(false)
    const timerRef = useRef(0)
    const [profile, setProfile] = useState(p)

    const openToast = () => {
        setOpen(false)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
            setOpen(true)
        }, 100)
    }

    async function buy() {
        if (open) return
        if (profile.balance < 55555) {
            setSuccess(false)
            return openToast()
        }
        setSuccess(true)
        openToast()

        await axios.post('/api/updateBalance', { balance: profile.balance - 55555 }).catch(console.log)

        const res = await axios.post('/api/updateChests', { chests: profile.chests + 1 }).catch(console.log)

        if (res) {
            setProfile(res.data.profile)
        }
    }
    return (
        <div className="w-full h-screen flex flex-col">
            <Background />
            <Nav profile={profile} />
            <div className="w-full h-full flex px-[80px] py-[20px] items-center justify-center relative">
                <div className="p-[20px] min-w-[600px] border border-yellow-500 bg-[#fff2dc] rounded-[20px] flex flex-col gap-[20px]">
                    <div className="w-full flex justify-between items-end">
                        <span className="text-[20px]">Box</span>
                        <span>Your balance: {profile.balance} coins</span>
                    </div>
                    <img src="box.png" alt="chest" className="w-[300px] h-[300px] mx-auto" />
                    <button className="w-full p-[10px] bg-black text-white rounded-[20px] flex items-center justify-center" onClick={buy}>
                        Buy for 55555 coins
                    </button>
                </div>
            </div>
            <ToastComponent
                success={success}
                title={success ? 'Successful purchase' : 'Failed to purchase'}
                description={success ? 'You have bought a chest, which you can open in your inventory' : 'You do not have enough scores to purchase a chest'}
                open={open}
                setOpen={setOpen}
                timerRef={timerRef}
            />
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
