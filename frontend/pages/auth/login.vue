<template>
  <v-row class="px-5">
    <v-col cols="12" xs="12" sm="6" md="4" lg="3" xl="3" class="px-0 mx-auto">
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
              outlined
              required
            />
            <v-text-field
              v-model="login.password"
              label="Password"
              :rules="rules.password"
              :type="hide ? 'password' : 'text'"
              :append-icon="hide ? 'mdi-eye-off' : 'mdi-eye'"
              outlined
              required
              @click:append="hide = !hide"
            />
            <div class="text-right mb-5">
              <a>Forgot Password?</a>
            </div>
            <div>
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                outlined
                block
                @click="submit"
              >
                Login
              </v-btn>
            </div>
            <div class="mt-5">
              You don't have an account?
              <nuxt-link to="/auth/register">Sign Up!</nuxt-link>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware: 'guest',
  data() {
    return {
      valid: true,
      loading: false,
      hide: true,
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
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return this.sendSnackbar({
          text: 'Invalid data provided',
          color: 'red'
        })
      }

      this.$auth
        .loginWith('local', {
          data: this.login
        })
        .then(() => {
          this.$axios.setToken(this.$auth.user.token)
          this.sendSnackbar({
            text: 'Logged in successfully',
            color: 'success'
          })
        })
        .catch((error) => {
          this.sendSnackbar({
            text: error.response.data.error,
            color: 'error'
          })
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>
