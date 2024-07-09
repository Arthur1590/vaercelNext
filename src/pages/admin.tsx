import Nav from '@/components/Nav'
import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { Config, profiles } from '@prisma/client'
import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useRef, useState } from 'react'
import ToastComponent from '../components/Toast'
import Background from '@/components/Background'

export default function Admin({ profile, config: c }: { profile: profiles; config: Config }) {
    const [open, setOpen] = useState(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [message, setMessage] = useState('')
    const timerRef = useRef(0)

    const [addWalletChance, setAddWalletChance] = useState('')
    const [addWalletUsernameChance, setAddWalletUsernameChance] = useState('')
    const [config, setConfig] = useState(c)

    const openToast = () => {
        setOpen(false)
        window.clearTimeout(timerRef.current)
        timerRef.current = window.setTimeout(() => {
            setOpen(true)
        }, 100)
    }

    async function downloadFile(file: 'wallets' | 'usernames') {
        if (open) return
        setSuccess(true)
        setMessage(`File ${file}.txt will be downloaded soon`)
        openToast()

        const res = await axios.get(`/api/${file == 'wallets' ? 'downloadWallets' : 'downloadUsernames'}`, { responseType: 'blob' }).catch()

        const contentDisposition = res.headers['content-disposition']
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
        const fileName = fileNameMatch ? fileNameMatch[1] : 'wallets.txt'

        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url

        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    async function updateAddWalletChance() {
        if (open) return
        const chance = Number(addWalletChance)
        setSuccess(true)
        setMessage(`Chance of adding the wallet to wallets.txt was set to ${addWalletChance}%`)
        openToast()
        if (chance == config.addWalletChance) {
            return setAddWalletChance('')
        }
        const res = await axios
            .post('/api/updateConfig', {
                key: 'specialItemChance',
                value: chance,
            })
            .catch()
        setAddWalletChance('')
        setConfig(res.data.config)
    }
    async function updateAddWalletUsernameChance() {
        if (open) return
        const chance = Number(addWalletUsernameChance)
        setSuccess(true)
        setMessage(`Chance of adding the wallet and username to usernames.txt was set to ${addWalletUsernameChance}%`)
        openToast()
        if (chance == config.addWalletUsernameChance) {
            return setAddWalletUsernameChance('')
        }
        const res = await axios
            .post('/api/updateConfig', {
                key: 'specialPrizeChance',
                value: chance,
            })
            .catch()
        setAddWalletUsernameChance('')
        setConfig(res.data.config)
    }
    async function toggleCheckerEnabled() {
        if (open) return
        const status = !config.checkerEnabled
        setSuccess(true)
        setMessage(status ? 'Wallet checker was enabled' : 'Wallet checker was disabled')
        openToast()
        const res = await axios.post('/api/updateConfig', { key: 'checkerEnabled', value: status }).catch()
        setConfig(res.data.config)
    }
    async function wipeLeaderboard() {
        setSuccess(true)
        setMessage('The leaderboard was wiped')
        openToast()
        await axios.get('/api/wipeLeaderboard').catch()
    }
    return (
        <div className="w-full h-screen flex flex-col">
            <Background />
            <Nav profile={profile} />
            <div className="w-full h-full px-[80px] py-[20px] flex items-center justify-center">
                <div className="rounded-[20px] py-[20px] border border-black flex flex-col">
                    <span className="text-[20px] mx-[20px] mb-[20px]">Config</span>
                    <div className="w-full border-t border-b border-black flex flex-col gap-[10px] p-[20px]">
                        <span>Chance of adding the wallet to wallets.txt: {config.addWalletChance}%</span>
                        <div className="w-full flex gap-[20px] justify-between">
                            <input
                                className="w-full bg-inherit outline-none p-[10px] placeholder:text-black min-w-[50px] border border-black rounded-[20px]"
                                placeholder="Enter a new value"
                                value={addWalletChance}
                                onChange={(e) => setAddWalletChance(e.target.value)}
                            />
                            <button className="py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={updateAddWalletChance}>
                                Change
                            </button>
                        </div>
                    </div>
                    <div className="w-full border-b border-black flex flex-col gap-[10px] p-[20px]">
                        <span>Chance of adding the wallet and username to usernames.txt: {config.addWalletUsernameChance}%</span>
                        <div className="w-full flex gap-[20px] justify-between">
                            <input
                                className="w-full bg-inherit outline-none p-[10px] placeholder:text-black min-w-[50px] border border-black rounded-[20px]"
                                placeholder="Enter a new value"
                                value={addWalletUsernameChance}
                                onChange={(e) => setAddWalletUsernameChance(e.target.value)}
                            />
                            <button className="py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={updateAddWalletUsernameChance}>
                                Change
                            </button>
                        </div>
                    </div>
                    <div className="w-full border-b border-black flex flex-col gap-[10px] p-[20px]">
                        <span>Status of the wallet checker: {config.checkerEnabled ? 'Enabled' : 'Disabled'}</span>
                        <button className="w-full flex justify-center py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={toggleCheckerEnabled}>
                            {config.checkerEnabled ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                    <div className="w-full border-b border-black flex gap-[20px] p-[20px]">
                        <button className="w-full flex justify-center py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={() => downloadFile('wallets')}>
                            wallets.txt
                        </button>
                        <button className="w-full flex justify-center py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={() => downloadFile('usernames')}>
                            usernames.txt
                        </button>
                    </div>
                    <div className="w-full border-b border-black flex gap-[20px] p-[20px]">
                        <button className="w-full flex justify-center py-[10px] px-[20px] bg-black text-white rounded-[20px]" onClick={wipeLeaderboard}>
                            Wipe the leaderboard
                        </button>
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
    if (!profile || profile.role != 'admin') {
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
