import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Portfolio CMS</h1>
      <p>
        Admin panel: <Link href="/admin">/admin</Link>
      </p>
    </main>
  )
}
