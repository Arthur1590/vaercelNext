import { KaboomCtx } from 'kaboom'
import { getSpriteWidth } from '../utils'
import { PlayerGameObj } from './player'
import { randFloat, randInt } from '@/utils/random'

export function selectRandomFood() {
    const foodsList = Object.values(foods)
    const randomIndex = randInt(0, foodsList.length)
    return foodsList[randomIndex]
}

export function findFood(name: string) {
    return Object.values(foods).find((food) => food.name == name)
}

export const foods: {
    [food: string]: {
        name: string
        score: number
    }
} = {
    beer: {
        name: 'beer',
        score: 300,
    },
    burger: {
        name: 'burger',
        score: 150,
    },
    fires: {
        name: 'fries',
        score: 150,
    },
    pizza: {
        name: 'pizza',
        score: 200,
    },
    broccoli: {
        name: 'broccoli',
        score: -250,
    },
    celery: {
        name: 'celery',
        score: -250,
    },
}

export function makeFood(k: KaboomCtx, name: string, posX: number, posY: number, speed: number) {
    const foodItem = findFood(name)
    if (!foodItem) return
    const food = k.make([
        'food',
        foodItem.name,
        k.sprite('items', { anim: foodItem.name, width: getSpriteWidth(k, 18) }),
        k.pos(posX, posY),
        k.area({ collisionIgnore: ['food', 'boost', 'bomb'] }),
        k.body({ gravityScale: speed }),
        k.rotate(0),
        k.anchor('center'),
        k.offscreen({ destroy: true }),
    ])
    food.onUpdate(() => {
        food.rotateBy(5 * speed)
    })
    return food
}

export function spawnFoods(k: KaboomCtx, player: PlayerGameObj) {
    const randomFood = selectRandomFood()
    const speed = randFloat(0.8, 1.5) * player.speedBoost
    const posX = randInt(60, k.width() - 60)
    const posY = 40

    const food = makeFood(k, randomFood.name, posX, posY, speed)
    if (!food) return
    k.add(food)
}
