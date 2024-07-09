import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/server-props'
import { Config, profiles } from '@prisma/client'
import Nav from '@/components/Nav'
import prisma from '@/utils/prisma/client'
import { useEffect, useRef, useState } from 'react'
import ToastComponent from '../components/Toast'
import { useRouter } from 'next/router'
import axios from 'axios'
import { randInt } from '@/utils/random'
import Background from '@/components/Background'

export default function Profile({ profile: p, config }: { profile: profiles; config: Config }) {
    const [open, setOpen] = useState(false)
    const timerRef = useRef(0)
    const [success, setSuccess] = useState(true)
    const [message, setMessage] = useState('')
    const [wallet, setWallet] = useState('')
    const [profile, setProfile] = useState(p)
    const [inventoryLength, setInventoryLength] = useState(profile.chests + (profile.hasSpecialItem ? 1 : 0) + (profile.hasSpecialPrize ? 1 : 0))

    const openToast = () => {
        setOpen(false)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
            setOpen(true)
        }, 100)
    }

    const router = useRouter()

    useEffect(() => {
        const { toast } = router.query
        if (typeof toast == 'string') {
            setSuccess(false)
            setMessage('You need to add your wallet to play the game')
            openToast()
        }
    }, [])

    async function updateWallet() {
        setSuccess(true)
        setMessage('Your wallet was successfully updated')
        openToast()
        const res = await axios.post('/api/updateWallet', { wallet }).catch()
        setProfile(res.data.profile)
        setWallet('')
    }
    async function openChest() {
        if (open) return
        const chance = randInt(1, 100)
        if (chance < config.addWalletChance && profile.wallet && !profile.hasSpecialPrize) {
            setSuccess(true)
            setMessage('You won a special prize, and your wallet will be added to our wallet list!')
            openToast()
            await axios.get('/api/addWallet').catch()
        } else if (chance < config.addWalletChance + config.addWalletUsernameChance && profile.wallet && !profile.hasSpecialPrize) {
            setSuccess(true)
            setMessage('You won a special prize, and your wallet and username will be added to our list! You will be contacted on your Twitter')
            setOpen(true)
            openToast()
            await axios.get(`/api/addWallet?username=${profile.username}`).catch()
        } else {
            const prize = randInt(1, 100000)
            setSuccess(true)
            setMessage(`You won ${prize} coins!`)
            openToast()
            const res = await axios.post('/api/updateBalance', { balance: profile.balance + prize })
            setProfile(res.data.profile)
        }
        const res = await axios.post('/api/updateChests', { chests: profile.chests - 1 })
        setProfile(res.data.profile)
    }
    function shareRefCode() {
        window.open(`https://twitter.com/intent/tweet?text=My+referral+code:+${profile.refCode}`)
    }
    function copyRefCode() {
        setSuccess(true)
        setMessage(`Referral code copied to clipboard`)
        openToast()
        navigator.clipboard.writeText(profile.refCode!.toString())
    }
    useEffect(() => {
        setInventoryLength(profile.chests + (profile.hasSpecialItem ? 1 : 0) + (profile.hasSpecialPrize ? 1 : 0))
    }, [profile.chests])

    return (
        <div className="w-full h-screen flex flex-col relative">
            <Background />
            <Nav profile={profile} />
            <div className="w-full max-h-full h-full overflow-scroll pt-[20px] px-[80px] py-[20px] flex items-center justify-center">
                <div className="p-[20px] border bg-[#fff2dc] border-yellow-500 rounded-[20px] flex gap-[50px]">
                    <img src={profile.photo} alt={profile.username} className="w-[200px] h-[200px]" />
                    <div className="flex flex-col gap-[20px]">
                        <span className="text-[30px] font-semibold">{profile.username}</span>
                        <span>Balance: {profile.balance} coins</span>
                        {profile.wallet ? (
                            <span>Wallet: {profile.wallet}</span>
                        ) : (
                            <div className="flex gap-[20px]">
                                <input
                                    className="bg-inherit outline-none border border-black text-black placeholder:text-black rounded-[20px] p-[10px] min-w-[300px]"
                                    placeholder="Enter your wallet here"
                                    type="text"
                                    value={wallet}
                                    onChange={(e) => setWallet(e.target.value)}
                                />
                                <div className="p-[10px] border border-black rounded-[20px] cursor-pointer" onClick={updateWallet}>
                                    Submit
                                </div>
                            </div>
                        )}
                        <div className="w-full flex items-center justify-between gap-[10px]">
                            <span>Referral code: {profile.refCode}</span>
                            <div className="px-[20px] py-[10px] rounded-[20px] bg-black text-white cursor-pointer" onClick={copyRefCode}>
                                Copy
                            </div>
                            <div className="px-[20px] py-[10px] rounded-[20px] bg-black text-white cursor-pointer" onClick={shareRefCode}>
                                Share
                            </div>
                        </div>
                        {profile.chests + (profile.hasSpecialItem ? 1 : 0) + (profile.hasSpecialPrize ? 1 : 0) > 0 ? (
                            <>
                                <span>Inventory:</span>
                                <div className="w-full min-w-[330px] grid grid-cols-3">
                                    {Array(inventoryLength + (inventoryLength % 3 != 0 ? 3 - (inventoryLength % 3) : 0))
                                        .fill('chest')
                                        .map((_, index) => {
                                            if (profile.hasSpecialItem && profile.hasSpecialPrize) {
                                                if (index == 0) {
                                                    return (
                                                        <div
                                                            className={`p-[5px] ${index % 3 != 2 ? 'border-r' : ''} ${index >= 3 ? 'border-t' : ''} border-black flex items-center justify-center`}
                                                            key={0}
                                                        >
                                                            <img src="hasSpecial.png" alt="Item" className="w-[100px] h-[100px] cursor-pointer" />
                                                        </div>
                                                    )
                                                } else if (index == 1) {
                                                    return (
                                                        <div
                                                            className={`p-[5px] ${index % 3 != 2 ? 'border-r' : ''} ${index >= 3 ? 'border-t' : ''} border-black flex items-center justify-center`}
                                                            key={1}
                                                        >
                                                            <img src="hasSpecial.png" alt="Prize" className="w-[100px] h-[100px] cursor-pointer" />
                                                        </div>
                                                    )
                                                }
                                            } else if (profile.hasSpecialItem && index == 0) {
                                                return (
                                                    <div
                                                        className={`p-[5px] ${index % 3 != 2 ? 'border-r' : ''} ${index >= 3 ? 'border-t' : ''} border-black flex items-center justify-center`}
                                                        key={0}
                                                    >
                                                        <img src="hasSpecial.png" alt="Item" className="w-[100px] h-[100px] cursor-pointer" />
                                                    </div>
                                                )
                                            } else if (profile.hasSpecialPrize && index == 0) {
                                                return (
                                                    <div
                                                        className={`p-[5px] ${index % 3 != 2 ? 'border-r' : ''} ${index >= 3 ? 'border-t' : ''} border-black flex items-center justify-center`}
                                                        key={0}
                                                    >
                                                        <img src="hasSpecial.png" alt="Prize" className="w-[100px] h-[100px] cursor-pointer" />
                                                    </div>
                                                )
                                            }
                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-[5px] ${index % 3 != 2 ? 'border-r' : ''} ${index >= 3 ? 'border-t' : ''} border-black flex items-center justify-center`}
                                                >
                                                    {index < inventoryLength && <img src="box.png" alt="chest" className="w-[100px] h-[100px] cursor-pointer" onClick={openChest} />}
                                                </div>
                                            )
                                        })}
                                </div>
                            </>
                        ) : (
                            <span>Empty Inventory</span>
                        )}
                    </div>
                </div>
                <ToastComponent success={success} title={message} description="" open={open} setOpen={setOpen} timerRef={timerRef} />
            </div>
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
    if (!profile?.wallet) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const config = await prisma.config.findUnique({ where: { id: 1 } })

    return { props: { profile, config } }
}
