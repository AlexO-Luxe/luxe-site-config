export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const query = `
      query {
        boards(ids: [18392931240]) {
          items_page(limit: 10) {
            items {
              name
              column_values {
                id
                text
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.MONDAY_API_KEY
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    const items = data?.data?.boards?.[0]?.items_page?.items;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'No items found on board' });
    }

    // Build config from first item's column values
    // Column IDs below — update these to match your actual Monday column IDs
    const cols = {};
    items[0].column_values.forEach(col => {
      cols[col.id] = col.text;
    });

    const config = {
      google_rating:  cols['text_mm1v3ana']  || '4.9',
      google_maps:    cols['link_mm1v9qw1']  || '',
      phone:          cols['text_mm1vgwsa']  || '',
      whatsapp:       cols['text_mm1vjm9v']  || '',
      jotform_url:    cols['link_mm1v1egy']  || '',
    };

    res.status(200).json(config);

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config', detail: err.message });
  }
}
