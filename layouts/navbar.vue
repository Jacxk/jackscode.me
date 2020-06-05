<template>
  <div>
    <v-app-bar class="pr-5" hide-on-scroll fixed app>
      <v-app-bar-nav-icon @click.stop="drawer_open = !drawer_open"/>
      <v-toolbar-title>{{ site.name }}</v-toolbar-title>

      <v-spacer/>

      <v-slide-x-reverse-transition>
        <v-text-field
          v-if="search"
          label="Search"
          class="mt-7 mr-2 d-none d-sm-block"
          dense
          solo
        />
      </v-slide-x-reverse-transition>

      <v-btn icon @click.stop="search = !search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn to="/" icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/cart" icon>
        <v-badge :content="'' + (this.$store.state.cart || []).length" bottom>
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
        solo
      />
    </v-expand-transition>

    <v-navigation-drawer v-model="drawer_open" :clipped="false" fixed app>
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
        <v-list-item v-for="item in items" :key="item.id" :to="item.href">
          <v-list-item-icon>
            <v-icon>mdi-{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list
        style="position: absolute; bottom: 0; right: 0; left: 0"
        color="darken-4"
      >
        <v-divider/>
        <v-list-item>
          <v-spacer/>
          <v-tooltip :open-delay="200" top>
            <template v-slot:activator="{ on }">
              <v-btn @click="toggleTheme" v-on="on" icon>
                <v-icon v-if="!dark">mdi-moon-waxing-crescent</v-icon>
                <v-icon v-else>mdi-white-balance-sunny</v-icon>
              </v-btn>
            </template>
            <span v-if="!dark">Turn Lights Off</span>
            <span v-else>Turn Lights On</span>
          </v-tooltip>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
  export default {
    name: 'Navbar',
    props: ['site'],
    data(vm) {
      return {
        drawer_open: true,
        search: false,
        dark: vm.$vuetify.theme.dark,
        items: [
          {title: 'Home', icon: 'home', href: '/'},
          {title: 'All Products', icon: 'shopping', href: '/products'},
          {title: 'My Cart', icon: 'cart', href: '/cart'}
        ],
        toggleTheme: () => {
          vm.$vuetify.theme.dark = !vm.$vuetify.theme.dark
          this.dark = !this.dark
        }
      }
    }
  }
</script>

<style scoped></style>
