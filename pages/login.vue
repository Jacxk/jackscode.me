<template>
  <v-row class="px-5">
    <v-col cols="12" xs="12" sm="6" class="px-0">
      <v-card elevation="3" outlined>
        <v-card-title>
          <h1 class="display-1">Login</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="login.email"
              :rules="rules.email"
              label="Email"
              prepend-icon="mdi-account-circle"
              outlined
              required
            />
            <v-text-field
              v-model="login.password"
              :rules="rules.password"
              label="Password"
              :type="hide ? 'password' : 'text'"
              prepend-icon="mdi-lock"
              :append-icon="hide ? 'mdi-eye-off' : 'mdi-eye'"
              outlined
              required
              @click:append="hide = !hide"
            />
            <a>Forgot Password?</a>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" outlined @click="submit">
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" xs="12" sm="6" class="px-0">
      <v-card elevation="3" height="100%" outlined>
        <v-card-text>
          <v-card-title>
            <h3>Why login?</h3>
          </v-card-title>
          <ul v-for="(item, i) in why_login" :key="i">
            <li>{{ item }}</li>
          </ul>
        </v-card-text>
      </v-card>
    </v-col>
    {{ books }}
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  async asyncData({ $axios }) {
    return { books: await $axios.$get('/api/auth/books') }
  },
  data() {
    return {
      why_login: [
        'Get access to update notification',
        'Ability to leave feedback',
        'Talk to the developer'
      ],
      valid: true,
      hide: true,
      times: 0,
      login: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          (input) => !!input || 'E-mail is required',
          (input) => /.+@.+\..+/.test(input) || 'E-mail must be valid'
        ],
        password: [
          (input) => !!input || 'Password is required',
          (input) =>
            input.length > 5 || 'Password must be at least 6 characters'
        ]
      }
    }
  },
  methods: {
    ...mapActions(['sendSnackbar']),
    submit() {
      this.times++
      if (!this.$refs.form.validate()) {
        this.sendSnackbar({ text: 'Invalid data provided', color: 'red' })
        return
      }

      this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .then(() => {
          this.sendSnackbar({
            text: 'Logged in successfully',
            color: 'success'
          })
        })
        .catch(console.error)
    }
  }
}
</script>
