import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useContainerSize = () => {
  const container = ref<HTMLDivElement | null>(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!container.value) return

    // Add observer to notice when container.value changes and save new width and height values
    observer = new ResizeObserver((entries) => {
      const [entry] = entries
      if (!entry) return

      const { width, height } = entry.contentRect

      containerWidth.value = width
      containerHeight.value = height
    })

    observer.observe(container.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    container,
    containerWidth,
    containerHeight,
  }
}