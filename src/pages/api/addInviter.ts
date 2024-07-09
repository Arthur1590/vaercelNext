import prisma from '@/utils/prisma/client'
import createClient from '@/utils/supabase/api'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const supabase = createClient(req, res)
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const { inviterRefCode }: { inviterRefCode: string } = req.body

        const profile = await prisma.profiles.findUnique({ where: { id: user.id } })
        if (!profile || profile.inviter) {
            res.status(400).end()
            return
        }

        const inviter = await prisma.profiles.findFirst({ where: { refCode: inviterRefCode } })
        if (!inviter) {
            res.status(400).end()
            return
        }

        const referrals = await prisma.profiles.findMany({ where: { inviter: inviter.username } })
        if (referrals.length >= 15) {
            await prisma.profiles.update({ where: { id: inviter.id }, data: { balance: inviter.balance + 2500 } })
            await prisma.profiles.update({ where: { id: profile.id }, data: { balance: profile.balance + 2500, inviter: inviter.username } })
        } else {
            await prisma.profiles.update({ where: { id: inviter.id }, data: { chests: inviter.chests + 1 } })
            await prisma.profiles.update({ where: { id: profile.id }, data: { chests: profile.chests + 1, inviter: inviter.username } })
        }

        res.status(200).end()
    }
}
