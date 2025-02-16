import { tailwindKit } from '@libs/tailwind-kit'
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tailwindKit],
  content: ['./src/**/*.{vue,js,ts}'],
}
