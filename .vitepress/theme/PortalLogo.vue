<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import rawLogoSvg from '../../src/bfportaldocs-logo.svg?raw'

const logoSvg = rawLogoSvg
  .replace(/<\?xml[\s\S]*?\?>\s*/, '')
  .replace(/<!DOCTYPE[\s\S]*?>\s*/, '')

const logo = ref<HTMLElement | null>(null)
const { isDark } = useData()

const lightColor = '#1a1a1a'
const darkColor = '#ffffff'
const duration = 500
let animationFrame = 0
let currentColor = lightColor

function colorForMode(dark: boolean) {
  return dark ? darkColor : lightColor
}

function colorToRgb(color: string) {
  const rgb = color.match(/\d+/g)
  if (rgb && rgb.length >= 3) {
    return {
      r: Number(rgb[0]),
      g: Number(rgb[1]),
      b: Number(rgb[2])
    }
  }

  const value = color.replace('#', '')
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  }
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function foregroundPaths() {
  return logo.value?.querySelectorAll<SVGElement>('.logo-foreground') ?? []
}

function setForegroundColor(color: string) {
  foregroundPaths().forEach((path) => {
    path.style.fill = color
  })
  currentColor = color
}

function animateForegroundColor(toColor: string) {
  cancelAnimationFrame(animationFrame)

  const from = colorToRgb(currentColor)
  const to = colorToRgb(toColor)
  const startedAt = performance.now()

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1)
    const eased = easeInOutCubic(progress)
    const r = Math.round(from.r + (to.r - from.r) * eased)
    const g = Math.round(from.g + (to.g - from.g) * eased)
    const b = Math.round(from.b + (to.b - from.b) * eased)

    setForegroundColor(`rgb(${r}, ${g}, ${b})`)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(tick)
    } else {
      setForegroundColor(toColor)
    }
  }

  animationFrame = requestAnimationFrame(tick)
}

onMounted(() => {
  setForegroundColor(colorForMode(isDark.value))

  watch(isDark, (dark) => {
    animateForegroundColor(colorForMode(dark))
  })
})
</script>

<template>
  <span ref="logo" class="PortalLogo" v-html="logoSvg" role="img" aria-label="Portal Docs" />
</template>

<style>
.PortalLogo {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;
  margin-right: 8px;
}

.PortalLogo .logo-foreground {
  fill: #1a1a1a;
}

.dark .PortalLogo .logo-foreground {
  fill: #fff;
}

.PortalLogo svg {
  display: block;
  width: auto;
  height: 100%;
}
</style>
