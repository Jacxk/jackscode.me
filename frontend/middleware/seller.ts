export default function({ $auth, redirect }: any) {
  if ($auth.user.role !== 'seller') {
    redirect('/products')
  }
}
