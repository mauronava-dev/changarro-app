/**
 * Creates a burst of lavender dot particles from the click/touch position.
 * Dots fly out in random directions and fade away.
 */
export function emitParticles(event: MouseEvent | TouchEvent) {
  let originX: number
  let originY: number

  if ('touches' in event && event.touches.length > 0) {
    originX = event.touches[0]!.clientX
    originY = event.touches[0]!.clientY
  } else if ('clientX' in event) {
    originX = event.clientX
    originY = event.clientY
  } else {
    return
  }

  const particleCount = 12

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')

    // Fully random angle
    const angle = Math.random() * Math.PI * 2
    const distance = 30 + Math.random() * 50
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance

    // Small dot size
    const size = 4 + Math.random() * 4

    // Stagger delay for organic feel
    const delay = Math.random() * 50

    particle.style.cssText = `
      position: fixed;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: #c5c5d8;
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transform: translate(-50%, -50%);
    `

    document.body.appendChild(particle)

    setTimeout(() => {
      particle.style.transition = `transform 0.45s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.45s ease-out`
      particle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
      particle.style.opacity = '0'
    }, delay)

    setTimeout(() => {
      particle.remove()
    }, 500 + delay)
  }
}

/**
 * Creates a single green firework explosion of particles with a glowing shadow.
 */
export function emitGreenExplosion(originX: number, originY: number) {
  const particleCount = 28

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')

    // Direction and distance scatter
    const angle = Math.random() * Math.PI * 2
    const distance = 40 + Math.random() * 110
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance

    // Tiny particle size
    const size = 3 + Math.random() * 5

    // Slight delay for organic spread
    const delay = Math.random() * 60

    particle.style.cssText = `
      position: fixed;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80, 0 0 16px rgba(74, 222, 128, 0.4);
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transform: translate(-50%, -50%);
    `

    document.body.appendChild(particle)

    setTimeout(() => {
      particle.style.transition = `transform 0.65s cubic-bezier(0.1, 0.8, 0.25, 1), opacity 0.65s ease-out`
      particle.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
      particle.style.opacity = '0'
    }, delay)

    setTimeout(() => {
      particle.remove()
    }, 700 + delay)
  }
}

/**
 * Coordinates three green firework explosions sequentially across the viewport.
 */
export async function playCheckoutSuccessAnimation(): Promise<void> {
  const width = window.innerWidth
  const height = window.innerHeight

  // 1. Explosion (Left-Middle)
  emitGreenExplosion(width * 0.35, height * 0.45)

  // 2. Explosion (Right-Middle) after 200ms
  await new Promise((resolve) => setTimeout(resolve, 200))
  emitGreenExplosion(width * 0.65, height * 0.35)

  // 3. Explosion (Center-Higher) after 200ms
  await new Promise((resolve) => setTimeout(resolve, 200))
  emitGreenExplosion(width * 0.5, height * 0.4)

  // Wait for the final explosion to finish fading
  await new Promise((resolve) => setTimeout(resolve, 750))
}

