<template>
  <v-row class="px-5">
    <v-col cols="12" xs="12" sm="8" md="7" lg="6" xl="6" class="mx-auto">
      <v-card elevation="3" outlined>
        <v-card-title>
          <h1 class="display-1">Register</h1>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="register.username"
              :rules="rules.username"
              label="Username"
              outlined
              required
              @input="removeSpace"
            />
            <v-text-field
              v-model="register.email"
              :rules="rules.email"
              label="Email"
              outlined
              required
            />
            <v-text-field
              v-model="register.password"
              :rules="rules.password"
              label="Password"
              :type="hide ? 'password' : 'text'"
              :append-icon="hide ? 'mdi-eye-off' : 'mdi-eye'"
              outlined
              required
              @click:append="hide = !hide"
            />
            <v-text-field
              v-model="register.repeatPassword"
              :rules="rules.repeatPassword"
              label="Repeat Password"
              :type="hide ? 'password' : 'text'"
              :append-icon="hide ? 'mdi-eye-off' : 'mdi-eye'"
              outlined
              required
              @click:append="hide = !hide"
            />

            <v-spacer />
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="primary"
              outlined
              @click="submit"
            >
              Register
            </v-btn>
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
      loading: false,
      valid: true,
      hide: true,
      register: {
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      rules: {
        username: [
          (input) => !!input || 'Username is required',
          (input) => input.length <= 20 || 'Name too long'
        ],
        email: [
          (input) => !!input || 'E-mail is required',
          (input) => /.+@.+\..+/.test(input) || 'E-mail must be valid'
        ],
        password: [
          (input) => !!input || 'Password is required',
          (input) =>
            input.length > 5 || 'Password must be at least 6 characters'
        ],
        repeatPassword: [
          (input) => !!input || 'Repeat password required',
          (input) =>
            input.length > 5 || 'Password must be at least 6 characters',
          (input) =>
            input === this.register.password || 'Passwords do not match'
        ]
      }
    }
  },
  methods: {
    ...mapActions(['sendSnackbar']),
    async submit() {
      this.loading = true
      if (!this.$refs.form.validate()) {
        this.loading = false
        return this.sendSnackbar({
          text: 'Invalid data provided',
          color: 'red'
        })
      }

      try {
        await this.$axios.$post('/api/auth/register', {
          username: this.register.username,
          email: this.register.email,
          password: this.register.password
        })
      } catch (error) {
        this.loading = false
        return this.sendSnackbar({
          text: error.response.data.error,
          color: 'error'
        })
      }

      this.$auth
        .loginWith('local', {
          data: {
            email: this.register.email,
            password: this.register.password
          }
        })
        .then(() => {
          this.sendSnackbar({
            text: 'Registered successfully',
            color: 'success'
          })
        })
        .catch((error) => {
          this.sendSnackbar({
            text: error.response.data.error,
            color: 'error'
          })
        })
      this.loading = false
    },
    removeSpace(input) {
      this.register.username = input.replace(/ /, '-')
    }
  }
}
</script>
