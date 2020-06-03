<template>
  <div>
    <v-app-bar hide-on-scroll class="pr-5">
      <v-app-bar-nav-icon @click.stop="drawer_open = !drawer_open"/>
      <v-toolbar-title>
        <nuxt-link class="white--text" to="/">{{site.name}}</nuxt-link>
      </v-toolbar-title>

      <v-spacer/>

      <v-slide-x-reverse-transition>
        <v-text-field
          v-if="search"
          label="Search"
          class="mt-7 mr-2 d-none d-sm-block"
          dense
          outlined
        />
      </v-slide-x-reverse-transition>

      <v-btn @click.stop="search = !search" icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn to="/" icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/cart" icon>
        <v-badge content="50" bottom>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </v-app-bar>

    <v-expand-transition>
      <v-text-field
        v-if="search"
        label="Search"
        class="pt-5 pr-5 pl-5 d-sm-none"
        dense
        outlined
      />
    </v-expand-transition>

    <v-navigation-drawer absolute temporary v-model="drawer_open">
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://via.placeholder.com/150"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{user.name}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider/>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.id" v-bind:to="item.href">
          <v-list-item-icon>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    props: ['site'],
    name: "navbar",
    data() {
      return {
        drawer_open: false,
        search: false,
        items: [
          {title: 'Home', icon: 'home', href: '/'},
          {title: 'All Products', icon: 'shopping', href: '/products'},
        ]
      }
    }
  }
</script>

<style scoped>

</style>
