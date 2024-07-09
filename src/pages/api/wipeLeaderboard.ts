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

        const profile = await prisma.profiles.findUnique({ where: { id: user!.id } })
        if (!profile || profile.role != 'admin') {
            res.status(403).end()
            return
        }

        const profiles = await prisma.profiles.findMany()
        for (const p of profiles) {
            await prisma.profiles.update({ where: { id: p.id }, data: { balance: 0 } })
        }

        res.status(200).end()
    }
}
