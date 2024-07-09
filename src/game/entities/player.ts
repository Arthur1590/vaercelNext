import { KaboomCtx } from 'kaboom'
import { foods } from './food'
import { UIGameObj } from './ui'
import { profiles } from '@prisma/client'
import { getSpriteWidth } from '../utils'
import { randFloat } from '@/utils/random'

export type PlayerGameObj = ReturnType<typeof makePlayer>

export function makePlayer(k: KaboomCtx, ui: UIGameObj, profile: profiles) {
    function hurt(hp?: number) {
        player.hurt(hp)
        ui.healthLabel.text = `HP: ${player.hp()}`
        if (player.hp() <= 0) {
            k.go('gameover', k, player, profile)
        }
    }
    const player = k.make([
        'player',
        k.sprite('player', { anim: 'stand', width: getSpriteWidth(k, 13) * 1.5 }),
        k.pos(k.width() / 6 - 50, k.height() - getSpriteWidth(k, 13) * 2),
        k.area({ collisionIgnore: ['food', 'boost', 'bomb'] }),
        k.body({ isStatic: true }),
        k.health(3),
        { score: 0, speedBoost: 1, scoreBoost: 1, profile, direction: 'left', speed: k.width() / 1.3 },
        k.anchor('top'),
    ])
    const collider = player.add([k.pos(0, 0), k.area({ shape: new k.Rect(k.vec2(0, 30), 100, 20) }), k.anchor('bot')])
    player.onAnimEnd((anim) => {
        switch (anim) {
            case 'turn':
                player.direction = player.direction == 'left' ? 'right' : 'left'
        }
    })
    collider.onCollide('food', (food) => {
        player.play('eat')
        const foodItem = Object.values(foods).find((f) => food.is(f.name))
        if (!foodItem) return
        if (foodItem.score < 0) {
            hurt()
        }
        player.score += foodItem.score * player.scoreBoost
        if (player.score < 0) {
            player.score = 0
        }
        ui.scoreLabel.children[0].text = player.score.toString()
        k.destroy(food)
    })
    k.onKeyPress('right', () => {
        if (player.direction == 'left') {
            player.play('turn')
            player.flipX = true
        }
    })
    k.onKeyPress('left', () => {
        if (player.direction == 'right') {
            player.play('turn')
            player.flipX = false
        }
    })
    k.onKeyDown('right', () => {
        if (player.direction == 'right') {
            if (player.curAnim() != 'run') {
                player.play('run')
            }
            player.flipX = true
            player.move(player.speed, 0)
            player.pos.x = k.clamp(player.pos.x, 0, k.width() - player.width / 2)
        }
    })
    k.onKeyDown('left', () => {
        if (player.direction == 'left') {
            if (player.curAnim() != 'run') {
                player.play('run')
            }
            player.flipX = false
            player.move(-player.speed, 0)
            player.pos.x = k.clamp(player.pos.x, player.width / 2, k.width() - player.width)
        }
    })
    k.onKeyRelease((key) => {
        if (key == 'left' || key == 'right') {
            player.play('stand')
        }
    })
    player.onAnimEnd(() => {
        player.play('stand')
    })
    collider.onCollide('speedBoost', (speedBoost) => {
        const boost = randFloat(0.5, 1.5)
        player.speedBoost = boost
        ui.speedBoostLabel.opacity = 1
        k.wait(45, () => {
            ui.speedBoostLabel.opacity = 0
            player.speedBoost = 1
        })
        k.destroy(speedBoost)
    })
    collider.onCollide('scoreBoost', (scoreMultiplier) => {
        player.scoreBoost = 2
        ui.scoreBoostLabel.opacity = 1
        k.wait(45, () => {
            ui.scoreBoostLabel.opacity = 0
            player.scoreBoost = 1
        })
        k.destroy(scoreMultiplier)
    })
    collider.onCollide('bomb', (bomb) => {
        hurt()
        k.destroy(bomb)
    })
    return player
}
