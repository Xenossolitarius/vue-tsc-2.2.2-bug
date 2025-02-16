<template>
  <div
    v-bind="$attrs"
    :class="`modal-${name}`"
  >
    <Transition
      :name="`overlay-${name}`"
      appear
      @before-enter="setOverflowHidden"
      @after-leave="restoreOverflowSetting"
    >
      <div
        v-if="open"
        class="overlay bg-black/60 fixed inset-0 z-[9999998] size-full"
        @click.self="closeModal"
      />
    </Transition>

    <Transition
      appear
      mode="out-in"
      :name="`content-${name}`"
      class="modal-content-transition"
    >
      <div
        v-if="open"
        class="modal-content-overlay fixed h-full inset-0 z-[9999999] flex items-center justify-center text-center"
        @click.self="closeModal"
      >
        <div
          ref="modalContent"
          tabindex="0"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
          class="modal-content-dialog md:max-h-full focus:outline-none"
          @keydown.esc="closeModal"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick, ref } from 'vue'

type ModalProps = {
  open?: boolean
  name?: string
  shouldFocus?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  name: 'default',
  shouldFocus: true,
})

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

const modalContent = ref<HTMLElement | null>(null)

watch(
  () => props.open,
  (newVal) => {
    props.shouldFocus &&
      newVal &&
      nextTick(() => modalContent.value && modalContent.value?.focus())
  },
)

const getOverflowCounter = (): number =>
  parseInt(document.body.getAttribute('overflowCounter') ?? '0', 10)

const setOverflowCounter = (count: number): void =>
  count > 0
    ? document.body.setAttribute('overflowCounter', count.toString())
    : document.body.removeAttribute('overflowCounter')

const setOverflowHidden = () => {
  const overflowAttributeCount = getOverflowCounter() + 1

  setOverflowCounter(overflowAttributeCount)

  const { scrollHeight, clientHeight } = document.documentElement

  if (scrollHeight <= clientHeight || overflowAttributeCount !== 1) return

  const topPosition = window.scrollY

  document.body.setAttribute('topPosition', topPosition.toString())
  document.body.style.top = `${-topPosition}px`
  document.body.classList.add('lock-scrollbar')
}

const restoreOverflowSetting = () => {
  const overflowAttributeCount = getOverflowCounter() - 1

  setOverflowCounter(overflowAttributeCount)

  if (overflowAttributeCount === 0) {
    const topPosition = document.body.getAttribute('topPosition')

    document.body.classList.remove('lock-scrollbar')
    document.body.style.top = ''
    topPosition !== null && window.scrollTo(0, Number(topPosition))
    document.body.removeAttribute('topPosition')
  }
}
</script>

<style scoped>
:global(.lock-scrollbar) {
  @apply overflow-hidden overflow-y-scroll fixed left-0 bottom-0 right-0;
}

/* Overlay */
.overlay-default-enter-from,
.overlay-default-leave-to {
  @apply opacity-0;
}

.overlay-default-enter-active {
  @apply transition ease-out duration-300;
}

.overlay-default-leave-active {
  @apply transition ease-in duration-300;
}

.overlay-default-enter-to,
.overlay-default-leave-from {
  @apply opacity-100;
}

/* Content */
.content-default-enter-from,
.content-default-leave-to {
  @apply transform opacity-0 scale-95;
}

.content-default-enter-active {
  @apply transition ease-out duration-300;
}

.content-default-leave-active {
  @apply transition ease-in duration-200;
}

.content-default-enter-to,
.content-default-leave-from {
  @apply transform opacity-100 scale-100;
}
</style>
