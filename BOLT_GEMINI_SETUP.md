# How to Activate Your AI Features (Disease Predictor & Mental Health)

The AI features need a **Google Gemini API Key** to work. Current status: "Invalid API Key".
Follow these steps to fix it.

## 1. Get Your Free Key
1. Visit: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google.
3. Click "Create API key".
4. Copy the key (starts with `AIza...`).

## 2. Add Key to Configuration
1. Open the file `BOLT_ENV_TEMPLATE.txt` located in this folder.
2. Find the line:
   `GEMINI_API_KEY=`
3. Paste your key after the equals sign:
   `GEMINI_API_KEY=AIzaSyD...`
4. Save the file.
5. Rename `BOLT_ENV_TEMPLATE.txt` to `.env` and move it into the `server/` folder (overwrite the existing `.env`).

## 3. Restart the Server
1. Go to the terminal running the backend (`server/`).
2. Press `Ctrl + C` to stop.
3. Run `npm run dev` again.
