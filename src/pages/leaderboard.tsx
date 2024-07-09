import Background from '@/components/Background'
import Nav from '@/components/Nav'
import hideWallet from '@/utils/hideWallet'
import prisma from '@/utils/prisma/client'
import { createClient } from '@/utils/supabase/server-props'
import { profiles } from '@prisma/client'
import { GetServerSidePropsContext } from 'next'

export default function Leaderboard({ profiles, profile }: { profiles: profiles[] | null; profile: profiles | null }) {
    return (
        <div className="w-full h-screen flex flex-col">
            <Background />
            <Nav profile={profile} />
            <div className="w-full h-full px-[80px] py-[20px] flex items-center justify-center">
                <table className="w-1/2 border-separate border-spacing-y-[10px]">
                    {profiles &&
                        profiles.map((p, index) => (
                            <tr key={index} className="bg-[#fff2dc] h-[50px]">
                                <td className="flex h-full justify-center px-[20px] py-[10px] bg-[#dad3c6]">{index + 1}</td>
                                <td>
                                    <div className="flex px-[10px] gap-[20px] items-center">
                                        <img src={p.photo} width={30} height={30} alt={p.username} />
                                        <span>{p.username}</span>
                                    </div>
                                </td>
                                <td>{p.wallet ? hideWallet(p.wallet) : 'No wallet'}</td>
                                <td className="bg-[#dad3c6] max-w-min h-full">
                                    <div className="pl-[20px]">{p.balance} coins</div>
                                </td>
                            </tr>
                        ))}
                </table>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const supabase = createClient(context)

    const { data } = await supabase.auth.getUser()
    const profile = data.user ? await prisma.profiles.findUnique({ where: { id: data.user?.id } }) : null

    if (!profile?.wallet) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const profiles = await prisma.profiles.findMany()
    profiles.sort((a, b) => b.balance - a.balance)

    return { props: { profile, profiles } }
}
