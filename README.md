# luxe-site-config

Vercel serverless function that exposes Student Luxe site config from Monday.com as a JSON API.

## Endpoint

`GET https://your-vercel-url.vercel.app/api/config`

Returns:
```json
{
  "google_rating": "4.9",
  "google_maps": "https://maps.app.goo.gl/...",
  "phone": "+442030070017",
  "whatsapp": "447700000000",
  "jotform_url": "https://form.jotform.com/..."
}
```

## Setup

### 1. Monday board columns
On board 18392931240, make sure you have columns with these IDs:
- `google_rating`
- `google_maps`
- `phone`
- `whatsapp`
- `jotform_url`

To find your actual column IDs: open Monday → Board → click any column header → the ID is shown in the URL or via the API explorer.

### 2. Vercel environment variable
In your Vercel project settings → Environment Variables, add:
```
MONDAY_API_KEY = your_api_key_here
```
Never commit the API key to the repo.

### 3. Deploy
Push this repo to GitHub. Connect to Vercel. It deploys automatically on every commit.

### 4. Update the Squarespace card code
In the card HTML, the fetch URL is:
```
https://your-vercel-url.vercel.app/api/config
```
Replace with your actual Vercel deployment URL.

## Updating values
Edit the relevant column values directly in Monday on board 18392931240.
The API response is cached for 5 minutes (Cache-Control: s-maxage=300).
