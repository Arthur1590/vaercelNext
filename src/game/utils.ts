import { KaboomCtx } from 'kaboom'

export function getSpriteWidth(k: KaboomCtx, divider: number = 15) {
    return k.width() / divider
}
