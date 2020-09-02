var c = document.getElementById('myCanvas')
const ctx = c.getContext('2d')
c.height = window.innerHeight
c.width = window.innerWidth

let leftScore = 0
let rightScore = 0

// const bounceSound = new sound('Pong.mp3')

class Ball {
	constructor() {
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
				// bounceSound.play()
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
				// bounceSound.play()
			} else {
				this.x = window.innerWidth / 2
				this.y = window.innerHeight / 2
				this.xSpeed = Math.random() * 5 + 2
				this.ySpeed = Math.random() * 5 + 2
				this.speedInterval = Math.random() * 1
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
		ctx.clearRect(0, 0, 73, c.height)
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

document.addEventListener('resie', () => {
	c.height = window.innerHeight
	c.width = window.innerWidth
})
