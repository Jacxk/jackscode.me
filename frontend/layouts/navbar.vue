<template>
  <div>
    <v-app-bar class="pr-5" fixed clipped-left app flat>
      <v-app-bar-nav-icon @click.stop="drawer_open = !drawer_open" />
      <v-toolbar-title>
        <nuxt-link to="/" class="text-decoration-none white--text">
          {{ site.name }}
        </nuxt-link>
      </v-toolbar-title>

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
          @input="makeSearch"
        />
      </v-slide-x-reverse-transition>

      <v-btn icon @click="search = true">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <div class="hidden-xs-only">
        <v-btn to="/" icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn to="/cart" icon>
          <v-badge v-if="hasItemsInCart" :content="inCart" bottom overlap>
            <v-icon>mdi-cart</v-icon>
          </v-badge>
          <v-icon v-else>mdi-cart</v-icon>
        </v-btn>
      </div>

      <v-menu offset-y auto transition="slide-y-transition" min-width="320px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="checkNotifications">
            <v-badge
              v-if="notifications.amount > 0"
              :content="String(notifications.amount)"
              bottom
              overlap
            >
              <v-icon>mdi-bell-ring</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell</v-icon>
          </v-btn>
        </template>
        <v-list>
          <div v-if="hasNotifications">
            <v-list-item
              v-for="(notification, i) in sortDescending(notifications.data)"
              :key="i"
              :to="`/products/${notification.product._id}`"
            >
              <v-list-item-avatar>
                <v-img :src="notification.product.picture" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ notification.product.name }} has been updated!
                </v-list-item-title>
                <Timeago :datetime="notification.created_at" auto-update />
              </v-list-item-content>
            </v-list-item>
          </div>
          <v-list-item v-else class="mx-5">
            No notifications...
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="hidden-xs-only">
        <v-menu offset-y transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-2" icon v-bind="attrs" v-on="on">
              <v-icon v-if="!loggedIn">mdi-account</v-icon>
              <v-avatar v-else>
                <v-img src="https://via.placeholder.com/150" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in loggedIn
                ? items.logged
                : items.not_logged"
              :key="index"
              dense
              :to="item.href"
            >
              <v-list-item-icon>
                <v-icon>mdi-{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-divider v-if="loggedIn" class="my-1" />
            <v-list-item>
              <v-btn
                v-if="loggedIn"
                color="error"
                block
                outlined
                @click="$auth.logout()"
              >
                Sign out
              </v-btn>
              <div v-else>
                <v-btn
                  class="mx-1"
                  color="success"
                  to="/auth/login"
                  outlined
                  block
                >
                  Login
                </v-btn>
                <v-btn
                  class="mx-1"
                  color="warning"
                  to="/auth/register"
                  outlined
                  block
                >
                  Register
                </v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
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
          @input="makeSearch"
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
import { mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  props: ['site'],
  data() {
    return {
      drawer_open: false,
      search: false,
      notifications: {
        data: [],
        amount: this.$auth.loggedIn ? this.$auth.user.notifications : 0
      },
      items: {
        drawer: [
          { title: 'Home', icon: 'home', href: '/' },
          { title: 'All Products', icon: 'shopping', href: '/products' },
          { title: 'My account', icon: 'account', href: '/users/@me' },
          { title: 'My Cart', icon: 'cart', href: '/cart' }
        ],
        logged: [{ title: 'Account', icon: 'account', href: '/users/@me' }],
        not_logged: []
      },
      toggleTheme: () => {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      }
    }
  },
  computed: {
    ...mapGetters(['sortDescending']),
    loggedIn() {
      return this.$auth.loggedIn
    },
    dark() {
      return this.$vuetify.theme.dark
    },
    cart() {
      return this.$store.state.cart
    },
    inCart() {
      return String(this.cart.length)
    },
    hasItemsInCart() {
      return this.cart.length > 0
    },
    hasNotifications() {
      if (!this.$auth.loggedIn) return false
      return this.notifications.data.length > 0
    }
  },
  methods: {
    makeSearch(text) {
      // TODO: implement search
    },
    async checkNotifications() {
      if (!this.$auth.loggedIn) return
      try {
        this.notifications.data = await this.$axios.$get(
          `/api/users/${this.$auth.user._id}/notifications`
        )
        this.notifications.amount = 0
      } catch {}
    }
  }
}
</script>
