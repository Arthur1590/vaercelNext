import { KaboomCtx } from 'kaboom'
import { getSpriteWidth } from '../utils'
import { PlayerGameObj } from './player'
import { randFloat, randInt } from '@/utils/random'

export function makeBomb(k: KaboomCtx, posX: number, posY: number, speed: number) {
    const bomb = k.make([
        'bomb',
        k.sprite('items', { anim: 'bomb', width: getSpriteWidth(k, 18) }),
        k.area({ collisionIgnore: ['food', 'bomb', 'boost'] }),
        k.body({ gravityScale: speed }),
        k.pos(posX, posY),
        k.rotate(0),
        k.anchor('center'),
        k.offscreen({ destroy: true }),
    ])
    bomb.onUpdate(() => {
        bomb.rotateBy(5 * speed)
    })
    return bomb
}

export function spawnBombs(k: KaboomCtx, player: PlayerGameObj) {
    const speed = randFloat(0.8, 1.5) * player.speedBoost
    const posX = randInt(60, k.width() - 60)
    const posY = 40

    const bomb = makeBomb(k, posX, posY, speed)
    k.add(bomb)
}
