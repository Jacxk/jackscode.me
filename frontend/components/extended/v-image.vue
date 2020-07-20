<template>
  <v-img
    :src="source"
    :height="height"
    :width="width"
    :gradient="gradient"
    :contain="contain"
    aspect-ratio="1"
    @error="onError"
  >
    <slot />
  </v-img>
</template>

<script>
export default {
  name: 'VImage',
  props: ['src', 'height', 'width', 'gradient', 'contain'],
  data() {
    return {
      source: this.src
    }
  },
  methods: {
    onError() {
      this.source = 'https://via.placeholder.com/200'
    }
  }
}
</script>
