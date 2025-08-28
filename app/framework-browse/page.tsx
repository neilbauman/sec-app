// app/framework-browse/page.tsx
import { createClient } from '@/lib/supabaseServer';

export default async function FrameworkBrowsePage() {
  const supabase = createClient();

  // Fetch pillars + nested themes/subthemes/standards/indicators
  const { data: pillars } = await supabase
    .from('pillars')
    .select(`
      id, code, name, statement, description, sort_order,
      themes (
        id, code, name, statement, description, sort_order,
        subthemes (
          id, code, name, statement, description, sort_order,
          standards (
            id, code, name, statement, description, sort_order,
            indicators (
              id, code, name, description, sort_order
            )
          )
        )
      )
    `)
    .order('sort_order');

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>SSC Framework Browser</h1>
      <p style={{ opacity: 0.8 }}>Read-only view of the current framework.</p>

      {pillars?.map((pillar) => (
        <section
          key={pillar.id}
          style={{
            marginTop: 24,
            padding: 16,
            border: '1px solid #ddd',
            borderRadius: 8,
          }}
        >
          <h2>
            {pillar.code}: {pillar.name}
          </h2>
          {pillar.statement && <p><strong>Statement:</strong> {pillar.statement}</p>}
          {pillar.description && <p>{pillar.description}</p>}

          {pillar.themes?.map((theme) => (
            <div key={theme.id} style={{ marginTop: 16, paddingLeft: 16 }}>
              <h3>
                {theme.code}: {theme.name}
              </h3>
              {theme.statement && <p><strong>Statement:</strong> {theme.statement}</p>}
              {theme.subthemes?.map((st) => (
                <div key={st.id} style={{ marginTop: 12, paddingLeft: 16 }}>
                  <h4>
                    {st.code}: {st.name}
                  </h4>
                  {st.statement && <p><strong>Statement:</strong> {st.statement}</p>}
                  {st.standards?.map((std) => (
                    <div key={std.id} style={{ marginTop: 8, paddingLeft: 16 }}>
                      <h5>
                        {std.code}: {std.name}
                      </h5>
                      {std.statement && <p><strong>Statement:</strong> {std.statement}</p>}
                      {std.indicators?.map((ind) => (
                        <p key={ind.id} style={{ marginLeft: 16 }}>
                          <strong>{ind.code}</strong>: {ind.name} – {ind.description}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
