'use client'

import Nav from '@/components/Nav'
import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { createClient as createComponentClient } from '@/utils/supabase/component'
import { profiles } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Home({ profile: p }: { profile: profiles }) {
    const [profile, setProfile] = useState<profiles | null>(p)
    const [wallet, setWallet] = useState('')
    const [refCode, setRefCode] = useState('')
    const supabase = createComponentClient()
    const router = useRouter()
    // const [hasLoaded, setHasLoaded] = useState(false)

    async function loadSession() {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                try {
                    const res = await axios.get<{ profile: profiles | null }>('/api/profile')
                    setProfile(res.data.profile)
                } catch (error) {
                    console.error('Error fetching profile:', error)
                }
            }
        })
    }

    async function auth() {
        await supabase.auth.signInWithOAuth({ provider: 'twitter' })
    }

    async function addInviter() {
        if (refCode === '') return
        try {
            await axios.post('/api/addInviter', { inviterRefCode: refCode })
            const updatedProfile = (await axios.post('/api/updateProfile', { key: 'passedAddInviter', value: true })).data.profile
            setProfile(updatedProfile)
        } catch (error) {
            alert('Invalid code')
        }
    }

    async function skipAddInviter() {
        try {
            const updatedProfile = (await axios.post('/api/updateProfile', { key: 'passedAddInviter', value: true })).data.profile
            setProfile(updatedProfile)
        } catch (error) {
            console.error('Error skipping inviter:', error)
        }
    }

    async function addWallet() {
        try {
            const updatedProfile = (await axios.post('/api/updateWallet', { wallet })).data.profile
            setProfile(updatedProfile)
            await router.push('/')
        } catch (error) {
            console.error('Error adding wallet:', error)
        }
    }

    useEffect(() => {
        loadSession()
    }, [])

    // if (!hasLoaded) {
    //     return (
    //         <div className="w-full h-screen flex justify-center">
    //             <Loader setHasLoaded={setHasLoaded} />
    //         </div>
    //     )
    // }

    if (!profile) {
        return (
            <div className="w-full h-screen flex flex-col relative bg-[#4e5788]">
                <div className="w-full h-full absolute top-0 left-0">
                    <img src="homepage.jpg" alt="homepage" className="w-full h-full" />
                </div>
                <div className="w-full h-full flex items-center justify-center z-[10]">
                    <div className="px-[30px] py-[20px] bg-black text-white rounded-[20px] text-[20px] font-semibold z-[10] cursor-pointer" onClick={auth}>
                        Authorize with Twitter
                    </div>
                </div>
            </div>
        )
    }

    if (!profile.passedAddInviter) {
        return (
            <div className="w-full h-screen flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <img src="homepage.jpg" alt="homepage" className="w-full h-full" />
                </div>
                <div className="z-[10] p-[20px] flex flex-col gap-[20px] bg-[#fff2dc] rounded-[20px]">
                    Enter your inviter&apos;s referral code
                    <input type="text" value={refCode} onChange={(e) => setRefCode(e.target.value)} className="bg-inherit px-[20px] py-[10px] outline-none border-black border rounded-[20px]" />
                    <div className="w-full flex gap-[20px] justify-between">
                        <button className="w-full px-[10px] py-[5px] rounded-[20px] bg-black text-white flex items-center justify-center" onClick={addInviter}>
                            Submit
                        </button>
                        <button className="w-full px-[10px] py-[5px] rounded-[20px] bg-black text-white flex items-center justify-center" onClick={skipAddInviter}>
                            I don&apos;t have an inviter
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!profile.wallet) {
        return (
            <div className="w-full h-screen flex items-center justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <img src="homepage.jpg" alt="homepage" className="w-full h-full" />
                </div>
                <div className="z-[10] p-[20px] flex flex-col gap-[20px] bg-[#fff2dc] rounded-[20px]">
                    Enter your wallet
                    <input type="text" value={wallet} onChange={(e) => setWallet(e.target.value)} className="bg-inherit px-[20px] py-[10px] outline-none border-black border rounded-[20px]" />
                    <div className="w-full flex gap-[20px] justify-between">
                        <button className="w-full px-[10px] py-[5px] rounded-[20px] bg-black text-white flex items-center justify-center" onClick={addWallet}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex flex-col relative bg-[#4e5788]">
            <Nav profile={profile} />
            <div className="w-full h-[calc(100%-100px)] absolute top-[100px] z-[1] left-0">
                <img src="homepage.jpg" alt="homepage" className="w-full h-full" />
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data } = await supabase.auth.getUser()

    const profile = data.user ? await prisma.profiles.findUnique({ where: { id: data.user.id } }) : null

    return { props: { profile } }
}
