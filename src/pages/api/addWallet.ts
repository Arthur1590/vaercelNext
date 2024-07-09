import prisma from '@/utils/prisma/client'
import createClient from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'GET') {
        const supabase = createClient(req, res)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            res.status(401).end()
            return
        }

        const { username } = req.query
        const profile = await prisma.profiles.findUnique({ where: { id: user.id } })
        if (!profile || !profile.wallet) {
            res.status(400).end()
            return
        }

        if (typeof username == 'string') {
            await prisma.config.update({
                where: { id: 1 },
                data: { specials: { push: typeof username == 'string' ? `${profile.wallet} | ${username}` : undefined } },
            })
            await prisma.profiles.update({
                where: { id: user.id },
                data: { hasSpecialItem: true },
            })
        } else {
            await prisma.config.update({
                where: { id: 1 },
                data: { wallets: { push: profile.wallet! } },
            })
            await prisma.profiles.update({
                where: { id: user.id },
                data: { hasSpecialPrize: true },
            })
        }

        res.status(200).end()
    }
}
