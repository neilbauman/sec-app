// app/auth/page.tsx
export const dynamic = 'force-dynamic'
export default function AuthIndex() {
  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Auth Tools</h1>
      <ul className="list-disc pl-6">
        <li><a className="underline" href="/auth/whoami">/auth/whoami</a></li>
        <li>
          <a className="underline" href="/auth/set-role?role=public">set role = public</a>
          {' · '}
          <a className="underline" href="/auth/set-role?role=country-admin">country-admin</a>
          {' · '}
          <a className="underline" href="/auth/set-role?role=super-admin">super-admin</a>
        </li>
      </ul>
    </main>
  )
}
