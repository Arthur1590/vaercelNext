import kaboom, { KaboomCtx } from 'kaboom'
import { RefObject } from 'react'

export function makeCtx(canvasRef: RefObject<HTMLCanvasElement>, navRef: RefObject<HTMLDivElement>): KaboomCtx {
    const k = kaboom({
        font: 'Chalkboard SE',
        global: false,
        background: [70, 70, 70],
        canvas: canvasRef.current!,
        width: window.innerWidth,
        height: window.innerHeight - navRef.current!.clientHeight,
        loadingScreen: true,
    })
    k.loadSprite('items', '/items.png', {
        sliceX: 6,
        sliceY: 2,
        anims: {
            beer: 0,
            burger: 1,
            fries: 2,
            pizza: 3,
            broccoli: 4,
            celery: 5,
            bomb: 6,
            gift: 7,
            speedBoost: 8,
            coin: 9,
            scoreBoost: 10,
        },
    })
    k.loadSprite('background', '/background.png', {
        sliceX: 6,
        sliceY: 5,
        anims: {
            bubble: { from: 0, to: 25, loop: true, speed: 50 },
        },
    })
    k.loadSprite('player', '/player.png', {
        sliceX: 7,
        sliceY: 5,
        anims: {
            run: { from: 0, to: 11, loop: true, speed: 20 },
            eat: { from: 14, to: 20, loop: false, speed: 14 },
            turn: { from: 21, to: 26, loop: false, speed: 70 },
            stand: { from: 28, to: 34, loop: true, speed: 10 },
        },
    })
    k.loadSprite('gameOver', './gameover.png')
    k.loadSprite('shareResults', './share.png')
    return k
}
