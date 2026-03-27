export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  const itemId = req.query.itemId || '11611616231';

  try {
    const query = `
      query {
        items(ids: [${itemId}]) {
          name
          column_values {
            id
            text
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
    const items = data?.data?.items;

    if (!items || items.length === 0) {
      return res.status(404).json({ error: 'Item not found', itemId });
    }

    const cols = {};
    items[0].column_values.forEach(col => {
      try {
        const parsed = JSON.parse(col.text);
        cols[col.id] = parsed?.url || parsed || col.text;
      } catch(e) {
        cols[col.id] = col.text;
      }
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
