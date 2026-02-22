import fs from 'fs'
import path from 'path'
import HomeClient from './HomeClient'

export default function Page() {
  // Read client logos from public/clients/ at build time
  const clientsDir = path.join(process.cwd(), 'public', 'clients')
  let clientLogos = []

  try {
    const files = fs.readdirSync(clientsDir)
    clientLogos = files
      .filter(f => /^worked-with-.*\.(png|jpg|jpeg|svg|webp)$/i.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/worked-with-(\d+)/)?.[1] || '0')
        const numB = parseInt(b.match(/worked-with-(\d+)/)?.[1] || '0')
        return numA - numB
      })
  } catch {
    clientLogos = []
  }

  return <HomeClient clientLogos={clientLogos} />
}
