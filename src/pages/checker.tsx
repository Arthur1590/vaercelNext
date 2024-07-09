import Nav from '@/components/Nav'
import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { Config, profiles } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { useRef, useState } from 'react'
import ToastComponent from '../components/Toast'
import Background from '@/components/Background'

export default function Checker({ profile, config }: { profile: profiles; config: Config }) {
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState<boolean>(false)
    const timerRef = useRef(0)
    const [wallet, setWallet] = useState('')

    const openToast = () => {
        setOpen(false)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
            setOpen(true)
        }, 100)
    }

    async function checkWallet() {
        if (!config.checkerEnabled || open) return
        setSuccess(config.wallets.includes(wallet))
        openToast()
        setWallet('')
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <Background />
            <Nav profile={profile} />
            <div className="w-full h-full px-[80px] py-[20px] flex justify-center items-center">
                {config.checkerEnabled ? (
                    <div className="flex flex-col gap-[20px] p-[20px] rounded-[20px] border border-yellow-500 bg-[#fff2dc]">
                        <span className="text-[20px]">Wallet Checker</span>
                        <input
                            className="w-full min-w-[600px] bg-inherit outline-none p-[10px] placeholder:text-black border border-black rounded-[20px]"
                            placeholder="Enter the wallet to check"
                            value={wallet}
                            onChange={(e) => setWallet(e.target.value)}
                        />
                        <button className="w-full p-[10px] bg-black text-white rounded-[20px] flex items-center justify-center" onClick={checkWallet}>
                            Check
                        </button>
                    </div>
                ) : (
                    <span>Wallet checker is disabled by admins</span>
                )}
                <ToastComponent success={success} title={success ? 'Eligible' : 'Not eligible'} description="" open={open} setOpen={setOpen} timerRef={timerRef} />
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)
    const { data } = await supabase.auth.getUser()
    const config = await prisma.config.findUnique({ where: { id: 1 } })
    const profile = data.user ? await prisma.profiles.findUnique({ where: { id: data.user.id } }) : null
    if (!profile || !profile.wallet) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            },
        }
    }

    return { props: { profile, config } }
}
