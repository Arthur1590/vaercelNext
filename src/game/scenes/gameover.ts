import { profiles } from '@prisma/client'
import { KaboomCtx } from 'kaboom'
import { PlayerGameObj } from '../entities/player'
import { randFloat } from '@/utils/random'
import axios from 'axios'

export default async (k: KaboomCtx, player: PlayerGameObj, profile: profiles) => {
    const twitterMultiplier = parseFloat(randFloat(1.1, 2).toFixed(1))
    const res = await axios.post('/api/updateBalance', { balance: profile.balance + player.score }).catch()
    let updatedProfie: profiles = res.data.profile

    const modal = k.add([k.sprite('gameOver'), k.anchor('center'), k.pos(k.width() / 2, k.height() / 2 - 100)])

    const message = modal.add([k.text(`${player.score} coins`, { size: 30 }), k.color([0, 0, 0]), k.anchor('center'), k.pos(0, 0)])
    modal.add(['playAgain', k.area({ shape: new k.Rect(k.vec2(0, 0), 200, 60) }), k.pos(0, 71), k.anchor('center')])

    const share = k.add(['share', k.sprite('shareResults'), k.anchor('center'), k.pos(k.width() / 2, modal.pos.y + 100 + 120), k.area()])
    share.add([k.text(`And get x${twitterMultiplier} of your results`, { size: 20 }), k.color([0, 0, 0]), k.anchor('center'), k.pos(0, 10)])

    k.onClick('playAgain', () => {
        k.go('game', k, updatedProfie)
    })

    k.onClick('share', async () => {
        const res = await axios.post('/api/updateBalance', { balance: profile.balance + parseInt((player.score * (twitterMultiplier - 1)).toFixed(0)) }).catch()
        updatedProfie = res.data.profile

        message.text = `${parseInt((player.score * twitterMultiplier).toFixed(0))} coins`

        k.destroy(share)

        window.open(`https://twitter.com/intent/tweet?text=I've+got+${player.score}+coins+in+a+cool+game.+You+can+try+too+on+https://localhost:3000`)
    })
}
