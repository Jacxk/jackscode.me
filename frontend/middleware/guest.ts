export default function({ $auth, redirect }: any) {
  if ($auth.loggedIn) {
    redirect('/')
  }
}
