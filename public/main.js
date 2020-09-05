var c = document.getElementById('myCanvas')
const ctx = c.getContext('2d')
c.height = window.innerHeight
c.width = window.innerWidth

let leftScore = 0
let rightScore = 0

let moreBulletsImage = new Image()
moreBulletsImage.src = 'Bullets.png'

let installCannonImage = new Image()
installCannonImage.src = 'Cannon.png'

class Ball {
	constructor() {
		this.lastHitPad = null
		this.x = window.innerWidth / 2
		this.y = window.innerHeight / 2
		this.radius = 20
		this.xSpeed = Math.random() * 5 + 2
		this.ySpeed = Math.random() * 5 + 2
		this.speedInterval = Math.random() * 1
	}

	drawCircle = () => {
		ctx.beginPath()
		if (this.x >= window.innerWidth - this.radius || this.x <= this.radius) {
			this.xSpeed = -this.xSpeed
		}
		if (this.y >= window.innerHeight - this.radius || this.y <= this.radius) {
			this.ySpeed = -this.ySpeed
		}
		if (this.x >= window.innerWidth - 100) {
			if (this.y >= rightPad.y && this.y <= rightPad.y + rightPad.height) {
				this.xSpeed = -this.xSpeed - this.speedInterval
				this.lastHitPad = 'right'
			} else {
				this.x = window.innerWidth / 2
				this.y = window.innerHeight / 2
				leftScore += 1
				this.clearScore()
			}
		}
		if (this.x <= 100) {
			if (this.y >= leftPad.y && this.y <= leftPad.y + leftPad.height) {
				this.xSpeed = -this.xSpeed + this.speedInterval
				this.lastHitPad = 'left'
			} else {
				this.x = window.innerWidth / 2
				this.y = window.innerHeight / 2
				this.xSpeed = Math.random() * 5 + 2
				this.ySpeed = Math.random() * 5 + 2
				this.speedInterval = Math.random() * 1
				rightGun.function = true
				rightGun.x = window.innerWidth - 123
				rightGun.y = rightPad.y + rightPad.height / 2
				rightGun.width = 50
				rightGun.height = 20
				leftGun.function = true
				leftGun.x = 70
				leftGun.y = leftPad.y + leftPad.height / 2
				leftGun.width = 50
				leftGun.height = 20
				rightScore += 1
				this.clearScore()
			}
		}
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
		ctx.stroke()
		ctx.strokeStyle = 'black'
		ctx.fill()
		ctx.fillStyle = 'black'
		ctx.closePath()
	}

	clearCircle = () => {
		ctx.clearRect(
			this.x - this.radius - this.radius * 0.25,
			this.y - this.radius - this.radius * 0.25,
			this.radius * 2.25 * 1.05,
			this.radius * 2.25 * 1.05
		)
	}

	clearScore = () => {
		ctx.clearRect(window.innerWidth / 2 - 30, 20, 60, 40)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearCircle()
			ctx.font = '30px Arial'
			ctx.fillText(`${leftScore} | ${rightScore}`, window.innerWidth / 2 - 30, 50)
			this.x += this.xSpeed
			this.y += this.ySpeed
			this.drawCircle()
			this.update()
		})
	}
}

class LeftPad {
	constructor() {
		this.x = 50
		this.y = window.innerHeight / 4
		this.height = window.innerHeight / 3
		this.ySpeedInterval = 5
		this.ySpeed = 0
	}

	drawRect = () => {
		ctx.beginPath()
		if (this.y <= 0) {
			this.y = 0
		} else if (this.y >= window.innerHeight - this.height) {
			this.y = window.innerHeight - this.height
		}
		ctx.rect(this.x, this.y, 20, this.height)
		ctx.stroke()
		ctx.fill()
		ctx.fillStyle = 'blue'
		ctx.closePath()
	}

	keysDownHandler = (event) => {
		if (event.code === 'KeyW') {
			this.ySpeed = -this.ySpeedInterval
		} else if (event.code === 'KeyS') {
			this.ySpeed = this.ySpeedInterval
		}
	}

	keysUpHandler = (event) => {
		if (event.code === 'KeyW' || event.code === 'KeyS') {
			this.ySpeed = 0
		}
	}

	clearRect = () => {
		ctx.clearRect(0, 0, 71, c.height)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearRect()
			this.y += this.ySpeed
			this.drawRect()
			this.update()
		})
	}
}

class LeftGun {
	constructor() {
		this.function = true
		this.bullets = 0
		this.bulletsLimit = 50
		this.x = 70
		this.y = leftPad.y + leftPad.height / 2
		this.width = 50
		this.height = 20
		this.destroyed = false
	}

	drawRect = () => {
		if (
			ball.x <= this.x + this.width &&
			ball.y >= this.y &&
			ball.y <= this.y + this.height
		) {
			this.x = 0
			this.y = 0
			this.width = 0
			this.height = 0
			this.function = false
			this.destroyed = true
		}
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.stroke()
		ctx.fill()
		ctx.closePath()
	}

	clearRect = () => {
		ctx.clearRect(this.x + 1, this.y - 1, this.width + 1, this.height + 5)
	}

	clearBulletsRemaining = () => {
		ctx.clearRect(80, window.innerHeight - 130, 400, 50)
	}

	keysDownHandler = (event) => {
		if (
			event.code === 'ShiftLeft' &&
			this.function === true &&
			this.bullets <= this.bulletsLimit
		) {
			const bullet = new Bullet(
				false,
				0.5,
				10,
				this.x + this.width,
				this.y + this.height / 3,
				10,
				10
			)
			console.log(this.bullets)
			this.clearBulletsRemaining()
			this.bullets += 1
			bullet.drawRect()
			bullet.update()
		}
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearRect()
			ctx.font = '30px Arial'
			ctx.fillText(`${this.bulletsLimit - this.bullets}`, 100, window.innerHeight - 100)
			this.destroyed
				? ctx.fillText('CANNON DESTROYED', 80, window.innerHeight - 30)
				: (this.y = leftPad.y + leftPad.height / 2)
			this.drawRect()
			this.update()
		})
	}
}

class RightPad {
	constructor() {
		this.x = window.innerWidth / 1.0575
		this.y = window.innerHeight / 4
		this.ySpeedInterval = 5
		this.ySpeed = 0
		this.height = window.innerHeight / 3
	}

	drawRect = () => {
		ctx.beginPath()
		if (this.y <= 0) {
			this.y = 0
		} else if (this.y >= window.innerHeight - this.height) {
			this.y = window.innerHeight - this.height
		}
		ctx.rect(this.x, this.y, 20, this.height)
		ctx.stroke()
		ctx.fill()
		ctx.fillStyle = 'black'
		ctx.closePath()
	}

	keysDownHandler = (event) => {
		if (event.code === 'ArrowUp') {
			this.ySpeed = -this.ySpeedInterval
		} else if (event.code === 'ArrowDown') {
			this.ySpeed = this.ySpeedInterval
		}
	}

	keysUpHandler = (event) => {
		if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
			this.ySpeed = 0
		}
	}

	clearRect = () => {
		ctx.clearRect(window.innerWidth - 74, 0, 74, c.height)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearRect()
			this.y += this.ySpeed
			this.drawRect()
			this.update()
		})
	}
}

class RightGun {
	constructor() {
		this.function = true
		this.bullets = 0
		this.bulletsLimit = 50
		this.x = window.innerWidth - 123
		this.y = rightPad.y + rightPad.height / 2
		this.width = 50
		this.height = 20
		this.destroyed = false
	}

	drawRect = () => {
		if (ball.x >= this.x && ball.y >= this.y && ball.y <= this.y + this.height) {
			this.x = 0
			this.y = 0
			this.width = 0
			this.height = 0
			this.function = false
			this.destroyed = true
		}
		ctx.beginPath()
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.stroke()
		ctx.fill()
		ctx.closePath()
	}

	clearRect = () => {
		ctx.clearRect(this.x - 1, this.y - 1, this.width + 1, this.height + 5)
	}

	keysDownHandler = (event) => {
		if (
			event.code === 'ArrowLeft' &&
			this.function === true &&
			this.bullets <= this.bulletsLimit
		) {
			const bullet = new Bullet(
				true,
				0.5,
				-10,
				this.x - 10,
				this.y + this.height / 3,
				10,
				10
			)
			this.bullets += 1
			this.clearBulletsRemaining()
			bullet.drawRect()
			bullet.update()
		}
	}

	clearBulletsRemaining = () => {
		// ctx.rect((window.innerWidth - 100), (window.innerHeight - 150), 50, 70)
		// ctx.fill()
		ctx.clearRect(window.innerWidth - 100, window.innerHeight - 150, 50, 70)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearRect()
			ctx.font = '30px Arial'
			ctx.fillText(
				`${this.bulletsLimit - this.bullets}`,
				window.innerWidth - 100,
				window.innerHeight - 100
			)
			this.destroyed
				? ctx.fillText(
						'CANNON DESTROYED',
						window.innerWidth - 400,
						window.innerHeight - 30
				  )
				: (this.y = rightPad.y + rightPad.height / 2)
			this.drawRect()
			this.update()
		})
	}
}

class Bullet {
	constructor(rightOrNot, strength, xSpeed, x, y, width, height) {
		this.strength = strength
		this.x = x
		this.y = y
		this.xSpeed = xSpeed
		this.width = width
		this.height = height
		this.rightOrNot = rightOrNot
	}

	drawRect = () => {
		if (this.rightOrNot === true) {
			if (
				this.x <= ball.x + ball.radius * 2 &&
				this.y >= ball.y &&
				this.y <= ball.y + ball.radius * 2
			) {
				ball.xSpeed -= this.strength
				this.x = 0
				this.y = 0
				this.xSpeed = 0
				this.width = 0
				this.height = 0
			}
		} else if (this.rightOrNot === false) {
			if (this.x >= ball.x && this.y >= ball.y && this.y <= ball.y + ball.radius * 2) {
				ball.xSpeed += this.strength
				this.x = 0
				this.y = 0
				this.xSpeed = 0
				this.width = 0
				this.height = 0
			}
		}
		ctx.rect(this.x, this.y, this.width, this.height)
		ctx.fillStyle = 'red'
		ctx.fill()
	}

	clearRect = () => {
		ctx.clearRect(this.x, this.y - 1, this.width, this.height + 3)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearRect()
			this.x += this.xSpeed
			this.drawRect()
			this.update()
		})
	}
}

class Item {
	constructor({ imageSource, x, y, width, height }) {
		x ? (this.x = x) : this.x = Math.floor(Math.random() * 700) + 200
		y ? (this.y = y) : this.y = Math.floor(Math.random() * 400) + 100
		width ? (this.width = width) : this.width = 50
		height ? (this.height = height) : this.height = 50
		this.image = imageSource
	}

	drawImage = () => {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
	}

	clearImage = () => {
		ctx.clearRect(this.x, this.y, this.width, this.height)
	}

	update = () => {
		requestAnimationFrame(() => {
			this.clearImage()
			this.drawImage()
			this.update()
		})
	}
}

const rightPad = new RightPad()
rightPad.drawRect()
rightPad.update()

document.addEventListener('keydown', rightPad.keysDownHandler, false)
document.addEventListener('keyup', rightPad.keysUpHandler, false)

const leftPad = new LeftPad()
leftPad.drawRect()
leftPad.update()

document.addEventListener('keydown', leftPad.keysDownHandler, false)
document.addEventListener('keyup', leftPad.keysUpHandler, false)

const ball = new Ball()
ball.drawCircle()
ball.update()

const rightGun = new RightGun()
rightGun.drawRect()
rightGun.update()

document.addEventListener('keydown', rightGun.keysDownHandler, false)

const leftGun = new LeftGun()
leftGun.drawRect()
leftGun.update()

document.addEventListener('keydown', leftGun.keysDownHandler, false)

moreBulletsImage.addEventListener('load', () => {
	setTimeout(() => {
		const moreBulletsItem = new Item({ imageSource: moreBulletsImage })
		moreBulletsItem.drawImage()
		moreBulletsItem.update()
		console.log(moreBulletsItem.x, moreBulletsItem.y, moreBulletsItem.width, moreBulletsItem.height, moreBulletsItem.image)
	}, 0)
	setTimeout(() => {
		const installCannon = new Item({
			imageSource: installCannonImage,
			height: 100,
			width: 100,
		})
		installCannon.drawImage()
		installCannon.update()
	}, 0)
})

document.addEventListener('resize', () => {
	c.height = window.innerHeight
	c.width = window.innerWidth
})
