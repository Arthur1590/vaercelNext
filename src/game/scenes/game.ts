import { KaboomCtx } from 'kaboom'
import { GRAVITY } from '../constants'
import { makePlayer } from '../entities/player'
import { spawnFoods } from '../entities/food'
import { makeGameUI } from '../entities/ui'
import { spawnBombs } from '../entities/bomb'
import { profiles } from '@prisma/client'
import { spawnScoreBoosts } from '../entities/scoreBoost'
import { spawnSpeedBoosts } from '../entities/speedBoost'

export default (k: KaboomCtx, profile: profiles) => {
    k.setGravity(GRAVITY)
    const ui = makeGameUI(k)
    const player = makePlayer(k, ui, profile)
    k.add([k.sprite('background', { anim: 'bubble', width: k.width() }), k.stay()])
    k.add(ui.scoreLabel)
    k.add(ui.speedBoostLabel)
    k.add(ui.healthLabel)
    k.add(ui.scoreBoostLabel)
    k.add(player)
    k.loop(1, () => {
        spawnFoods(k, player)
    })
    k.loop(10, () => {
        spawnSpeedBoosts(k, player)
    })
    k.loop(11, () => {
        spawnScoreBoosts(k, player)
    })
    k.loop(5, () => {
        spawnBombs(k, player)
    })
}
