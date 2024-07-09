import { KaboomCtx } from 'kaboom'
import { getSpriteWidth } from '../utils'
import { PlayerGameObj } from './player'
import { randFloat, randInt } from '@/utils/random'

export function makeSpeedBoost(k: KaboomCtx, player: PlayerGameObj, posX: number, posY: number, speed: number) {
    if (player.speedBoost != 1) return
    const boost = k.make([
        'boost',
        'speedBoost',
        k.sprite('items', { anim: 'speedBoost', width: getSpriteWidth(k, 18) }),
        k.area({ collisionIgnore: ['food', 'boost', 'bomb'] }),
        k.body(),
        k.pos(posX, posY),
        k.anchor('center'),
        k.offscreen({ destroy: true }),
        k.rotate(0),
    ])
    boost.onUpdate(() => {
        boost.rotateBy(5 * speed)
    })
    return boost
}

export function spawnSpeedBoosts(k: KaboomCtx, player: PlayerGameObj) {
    if (Math.random() * 100 > 30) return
    const speed = randFloat(0.8, 1.5) * player.speedBoost
    const posX = randInt(60, k.width() - 60)
    const posY = 10
    const speedMultiplier = makeSpeedBoost(k, player, posX, posY, speed)
    k.add(speedMultiplier)
}
