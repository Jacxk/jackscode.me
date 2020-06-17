<template>
  <div>
    <v-app-bar class="pr-5" fixed clipped-left app flat>
      <v-app-bar-nav-icon @click.stop="drawer_open = !drawer_open" />
      <v-toolbar-title>{{ site.name }}</v-toolbar-title>

      <v-spacer />
      <v-spacer />

      <v-slide-x-reverse-transition>
        <v-text-field
          v-if="search"
          label="Search"
          class="mt-7 mr-2 d-none d-sm-block"
          dense
          solo
          autofocus
          @blur="search = false"
        />
      </v-slide-x-reverse-transition>

      <v-btn icon @click="search = true">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn to="/" icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn to="/cart" icon>
        <v-badge :content="inCart" bottom>
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
      <v-menu
        offset-y
        :close-on-content-click="false"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ml-2" v-bind="attrs" icon v-on="on">
            <v-icon v-if="!loggedIn">mdi-account</v-icon>
            <v-avatar v-else>
              <v-img src="https://via.placeholder.com/150" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in loggedIn ? items.logged : items.not_logged"
            :key="index"
            dense
            @click=""
          >
            <v-list-item-icon>
              <v-icon>mdi-{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-divider class="my-1" />
          <v-list-item>
            <v-btn v-if="loggedIn" color="error" to="/signout" block outlined>
              Sign out
            </v-btn>
            <div v-else>
              <v-btn class="mx-1" color="success" to="/login" outlined>
                Login
              </v-btn>
              <v-btn class="mx-1" color="warning" to="/register" outlined>
                Register
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-expand-transition>
      <v-card
        v-if="search"
        style="position: fixed; top: 50px; right: 0; left: 0; z-index: 1"
      >
        <v-text-field
          label="Search"
          class="pt-5 pr-5 pl-5 d-sm-none"
          dense
          autofocus
          outlined
          @blur="search = false"
        />
      </v-card>
    </v-expand-transition>

    <v-navigation-drawer v-model="drawer_open" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="item in items.drawer"
          :key="item.id"
          :to="item.href"
        >
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
        <v-divider />
        <v-list-item>
          <v-spacer />
          <v-tooltip :open-delay="200" top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="toggleTheme" v-on="on">
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
  data() {
    return {
      drawer_open: false,
      search: false,
      items: {
        drawer: [
          { title: 'Home', icon: 'home', href: '/' },
          { title: 'All Products', icon: 'shopping', href: '/products' },
          { title: 'My Cart', icon: 'cart', href: '/cart' }
        ],
        logged: [
          { title: 'Account', icon: 'account', href: '/users/@me' },
          {
            title: 'My Orders',
            icon: 'storefront-outline',
            href: '/account/orders'
          }
        ],
        not_logged: []
      },
      toggleTheme: () => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      }
    }
  },
  computed: {
    loggedIn() {
      return false // this.$auth.loggedIn
    },
    dark() {
      return this.$vuetify.theme.dark
    },
    inCart() {
      return String(this.$store.state.cart.length)
    }
  }
}
</script>

<style scoped></style>