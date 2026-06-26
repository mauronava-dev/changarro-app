/**
 * Creates a burst of lavender dot particles from the click/touch position.
 * Dots fly out in random directions and fade away.
 */
export function emitParticles(event: MouseEvent | TouchEvent) {
  let originX: number
  let originY: number

  if ('touches' in event && event.touches.length > 0) {
    originX = event.touches[0].clientX
    originY = event.touches[0].clientY
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
