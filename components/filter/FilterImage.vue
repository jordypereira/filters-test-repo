<template>
  <img v-if="imgSrc" :src="imgSrc" />
</template>

<script lang="ts" setup>
interface Props {
  lengthType: string
}

const props = defineProps<Props>()

let imgSrc = ref('')

function getSilhouetteImage(length: string) {
  switch (length) {
    case 'product-length-group-liner':
      imgSrc.value = '/icons/liner.svg'
      break

    case 'product-length-group-no-show':
      imgSrc.value = '/icons/no-show.svg'
      break

    case 'product-length-group-low':
      imgSrc.value = '/icons/low.svg'
      break

    case 'product-length-group-1-4-crew':
      imgSrc.value = '/icons/1-4-crew.svg'
      break

    case 'product-length-group-ankle':
      imgSrc.value = '/icons/ankle.svg'
      break

    case 'product-length-group-1-2-crew':
      imgSrc.value = '/icons/1-2-crew.svg'
      break

    case 'product-length-group-3-4-crew':
      imgSrc.value = '/icons/3-4-crew.svg'
      break

    case 'product-length-group-crew':
      imgSrc.value = '/icons/crew.svg'
      break

    case 'product-length-group-cozy':
      imgSrc.value = '/icons/cozy.svg'
      break

    case 'product-length-group-mid':
      imgSrc.value = '/icons/mid-high.svg'
      break

    case 'product-length-group-high':
      imgSrc.value = '/icons/knee-high.svg'
      break

    default:
      imgSrc.value = ''
      break
  }
  return imgSrc.value
}
getSilhouetteImage(props.lengthType)
</script>

<style lang="scss" scoped>
img {
  max-width: 5rem;
  max-height: 5rem;
  width: 100%;
  margin: 0.5rem 3rem;
}
</style>
