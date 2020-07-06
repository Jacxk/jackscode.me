<template>
  <v-card :to="to || ''" width="100%" flat>
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="picture || 'https://via.placeholder.com/200'" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="d-flex justify-space-between">
          <span>
            {{ title }}
          </span>
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
          <Timeago :datetime="date" auto-update />
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-divider />
  </v-card>
</template>

<script>
export default {
  name: 'Rating',
  props: ['picture', 'title', 'rating', 'to', 'date']
}
</script>

<style scoped></style>
