# How to Fix "Google Maps API Key Not Set"

The "warning" you see means the Emergency Locator is showing fake (mock) hospitals because it can't connect to Google Maps without a key.
I cannot provide this key for you, but you can get one from Google.

## Steps to Fix

1. **Get an API Key**
   - Go to the [Google Maps Platform Console](https://console.cloud.google.com/google/maps-apis/credentials).
   - Create a project and enable the **Places API** and **Maps JavaScript API**.
   - Create credentials (API Key).
   - Copy the key (starts with `AIza...`).

2. **Add it to the Project**
   - Open the file `server/.env` (or use the template I provided earlier).
   - Find: `GOOGLE_MAPS_API_KEY=`
   - Paste your key: `GOOGLE_MAPS_API_KEY=AIzaSyD...`
   - Save the file.

3. **Restart Server**
   - Stop the backend (`Ctrl+C`).
   - Run `npm run dev`.
