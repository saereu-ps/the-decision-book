export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, isRude } = req.body;
    
    // Get the API key from Vercel's Environment Variables
    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing Google TTS API Key' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Missing text in request body' });
    }

    // Configure the Google Cloud TTS Payload
    const payload = {
        input: { text: text },
        voice: { 
            languageCode: 'th-TH', 
            name: 'th-TH-Neural2-C' // Premium realistic Thai voice (female)
        },
        audioConfig: {
            audioEncoding: 'MP3',
            // Lower pitch and speaking rate slightly for Rude Mode
            pitch: isRude ? -3.0 : 0.0,
            speakingRate: isRude ? 0.9 : 1.0
        }
    };

    try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) {
            console.error("Google TTS API Error:", data.error.message);
            return res.status(400).json({ error: data.error.message });
        }

        // Return the base64 audio string to the frontend
        res.status(200).json({ audioContent: data.audioContent });
    } catch (error) {
        console.error("Failed to fetch Google TTS:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
