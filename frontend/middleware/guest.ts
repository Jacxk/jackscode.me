// @ts-ignore
export default function({ $auth, redirect }) {
  if ($auth.loggedIn) {
    redirect('/')
  }
}
