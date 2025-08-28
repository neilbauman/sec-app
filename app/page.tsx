// Simple table view of the framework
import { supabaseClient } from '@/lib/supabaseClient';

export default async function Page() {
  // Read is allowed for everyone by our RLS policy
  const { data, error } = await supabaseClient
    .from('ssc_rows')
    .select('*')
    .order('dimension_order', { ascending: true })
    .order('indicator_order', { ascending: true })
    .order('question_order', { ascending: true })
    .order('choice_order', { ascending: true });

  if (error) return <pre>Failed to load: {error.message}</pre>;

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1>SSC Framework</h1>
      <p>
        <a href="/upload">Admin: upload Excel</a> | <a href="/api/import?download=1">Download Excel</a>
      </p>
      <table border={1} cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>version</th><th>dimension</th><th>indicator</th><th>question</th><th>choice</th><th>severity</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <tr key={row.id}>
              <td>{row.version}</td>
              <td>{row.dimension_code} — {row.dimension_name}</td>
              <td>{row.indicator_code} — {row.indicator_name}</td>
              <td>{row.question_code}: {row.question_text}</td>
              <td>{row.choice_value}: {row.choice_label}</td>
              <td>{row.choice_severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
