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
            res.status(401).end()
            return
        }

        const profile = await prisma.profiles.findUnique({ where: { id: user.id } })
        if (!profile || profile.role != 'admin') {
            res.status(403).end()
            return
        }

        const { key, value }: { key: string; value: unknown } = req.body

        const config = await prisma.config.update({ where: { id: 1 }, data: { [key]: value } })

        res.status(200).json({ config })
    }
}
