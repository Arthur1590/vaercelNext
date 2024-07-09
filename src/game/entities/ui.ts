import { KaboomCtx } from 'kaboom'
import { getSpriteWidth } from '../utils'

export type UIGameObj = ReturnType<typeof makeGameUI>

export function makeGameUI(k: KaboomCtx) {
    const spriteWidth = getSpriteWidth(k)

    const healthLabel = k.make([k.text(`HP: 3`, { size: spriteWidth / 4 }), k.pos(spriteWidth, spriteWidth / 4 + 20), k.anchor('center')])

    const scoreLabel = k.make([k.sprite('items', { anim: 'coin', width: spriteWidth / 2 }), k.pos(k.width() / 3, spriteWidth / 4 + 20), k.anchor('center')])
    scoreLabel.add([k.text('0', { size: spriteWidth / 4 }), k.pos(spriteWidth / 4 + 10, 0), k.anchor('left')])

    const speedBoostLabel = k.make([k.sprite('items', { anim: 'speedBoost', width: spriteWidth / 2 }), k.pos((k.width() / 3) * 2, spriteWidth / 4 + 20), k.anchor('center'), k.opacity(0)])

    const scoreBoostLabel = k.make([k.sprite('items', { anim: 'scoreBoost', width: spriteWidth / 1.5 }), k.pos(k.width() - 75, spriteWidth / 4 + 20), k.anchor('center'), k.opacity(0)])

    return { healthLabel, scoreLabel, speedBoostLabel, scoreBoostLabel }
}
