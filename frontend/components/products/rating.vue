<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img :src="picture || 'https://via.placeholder.com/200'" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title class="d-flex justify-space-between">
        <span>{{ title }}</span>
        <v-rating
          :value="rating"
          color="yellow darken-3"
          background-color="grey darken-1"
          empty-icon="$ratingFull"
          half-increments
          readonly
          small
          dense
        />
      </v-list-item-title>
      <v-list-item-subtitle>
        <slot />
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  name: 'Rating',
  props: ['picture', 'title', 'rating']
}
</script>

<style scoped></style>
