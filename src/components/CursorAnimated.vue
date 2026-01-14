<template>
  <div ref="largeHeader">
    <canvas id="demo-canvas" ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'CursorAnimated',
  setup() {
    const largeHeader = ref(null)
    const canvas = ref(null)

    let width, height, ctx, points, target, animateHeader = true
    let animationId = null
    let primaryRGB = null

    const getPrimaryColor = () => {
      const rootStyles = getComputedStyle(document.documentElement)
      const primaryColor = rootStyles.getPropertyValue('--v-theme-primary').trim()

      if (primaryColor.includes('rgb')) {
        const match = primaryColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          return `${match[1]}, ${match[2]}, ${match[3]}`
        }
      }

      // Si viene en formato hex #RRGGBB, convertir a rgb
      if (primaryColor.startsWith('#')) {
        const hex = primaryColor.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        return `${r}, ${g}, ${b}`
      }

      // Si ya viene como "r, g, b"
      return primaryColor
    }

    const initHeader = () => {
      width = window.innerWidth
      height = window.innerHeight
      target = { x: width / 2, y: height / 2 }

      // Obtener color primario
      primaryRGB = getPrimaryColor()

      largeHeader.value.style.height = height + 'px'

      canvas.value.width = width
      canvas.value.height = height
      ctx = canvas.value.getContext('2d')

      points = []
      for (let x = 0; x < width; x = x + width / 20) {
        for (let y = 0; y < height; y = y + height / 20) {
          const px = x + Math.random() * width / 20
          const py = y + Math.random() * height / 20
          const p = { x: px, originX: px, y: py, originY: py }
          points.push(p)
        }
      }

      for (let i = 0; i < points.length; i++) {
        const closest = []
        const p1 = points[i]

        for (let j = 0; j < points.length; j++) {
          const p2 = points[j]
          if (!(p1 == p2)) {
            let placed = false
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] == undefined) {
                  closest[k] = p2
                  placed = true
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2
                  placed = true
                }
              }
            }
          }
        }
        p1.closest = closest
      }

      for (let i in points) {
        const c = new Circle(points[i], 2 + Math.random() * 2, primaryRGB)
        points[i].circle = c
      }
    }

    const mouseMove = (e) => {
      let posx = 0, posy = 0
      if (e.pageX || e.pageY) {
        posx = e.pageX
        posy = e.pageY
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
      }
      target.x = posx
      target.y = posy
    }

    const scrollCheck = () => {
      if (document.body.scrollTop > height) {
        animateHeader = false
      } else {
        animateHeader = true
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      largeHeader.value.style.height = height + 'px'
      canvas.value.width = width
      canvas.value.height = height
    }

    const addListeners = () => {
      if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove)
      }
      window.addEventListener('scroll', scrollCheck)
      window.addEventListener('resize', resize)
    }

    const removeListeners = () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('scroll', scrollCheck)
      window.removeEventListener('resize', resize)
    }

    const initAnimation = () => {
      animate()
      for (let i in points) {
        shiftPoint(points[i])
      }
    }

    const animate = () => {
      if (animateHeader) {
        ctx.clearRect(0, 0, width, height)
        for (let i in points) {
          const distance = Math.abs(getDistance(target, points[i]))

          if (distance < 4000) {
            points[i].active = 0.3
            points[i].circle.active = 0.6
          } else if (distance < 20000) {
            points[i].active = 0.1
            points[i].circle.active = 0.3
          } else if (distance < 40000) {
            points[i].active = 0.02
            points[i].circle.active = 0.1
          } else {
            points[i].active = 0
            points[i].circle.active = 0
          }

          drawLines(points[i])
          points[i].circle.draw()
        }
      }
      animationId = requestAnimationFrame(animate)
    }

    const shiftPoint = (p) => {
      const duration = 1000 + Math.random() * 1000
      const startTime = Date.now()
      const startX = p.x
      const startY = p.y
      const endX = p.originX - 50 + Math.random() * 100
      const endY = p.originY - 50 + Math.random() * 100

      const tweenStep = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2

        p.x = startX + (endX - startX) * easedProgress
        p.y = startY + (endY - startY) * easedProgress

        if (progress < 1) {
          requestAnimationFrame(tweenStep)
        } else {
          setTimeout(() => shiftPoint(p), Math.random() * 100)
        }
      }

      tweenStep()
    }

    const drawLines = (p) => {
      if (!p.active) return
      for (let i in p.closest) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.closest[i].x, p.closest[i].y)
        ctx.strokeStyle = `rgba(${primaryRGB}, ${p.active})`
        ctx.stroke()
      }
    }

    function Circle(pos, rad, color) {
      this.pos = pos || null
      this.radius = rad || null
      this.color = color || null
      this.active = 0

      this.draw = () => {
        if (!this.active) return
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = `rgba(${primaryRGB}, ${this.active})`
        ctx.fill()
      }
    }

    const getDistance = (p1, p2) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    }

    onMounted(() => {
      initHeader()
      initAnimation()
      addListeners()
    })

    onUnmounted(() => {
      removeListeners()
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    })

    return {
      largeHeader,
      canvas
    }
  }
}
</script>

<style scoped>
div {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

canvas {
  display: block;
}
</style>