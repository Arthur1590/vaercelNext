import generateRefCode from '@/utils/generateRefCode'
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
            res.json({ profile: null })
            return
        }

        const have = await prisma.profiles.findUnique({ where: { id: user.id } })
        if (!have) {
            res.json({ profile: null })
            return
        }
        if (have.refCode) {
            res.json({ profile: have })
            return
        }

        let refCode = generateRefCode(6)
        let exists = await prisma.profiles.findFirst({ where: { refCode } })
        while (exists) {
            refCode = generateRefCode(6)
            exists = await prisma.profiles.findFirst({ where: { refCode } })
        }

        const profile = await prisma.profiles.update({ where: { id: user.id }, data: { refCode } })

        res.json({ profile })
    }
}
