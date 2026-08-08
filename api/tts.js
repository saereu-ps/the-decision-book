export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text, isRude } = req.body;
    
    // Get the API key from Vercel's Environment Variables
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing ELEVENLABS_API_KEY' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Missing text in request body' });
    }

    // Default Voice ID (Rachel). You can change this to any Voice ID from your ElevenLabs dashboard.
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; 

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2', // Multilingual v2 supports Thai very well
                voice_settings: {
                    // For Rude Mode, increase stability so the voice sounds more deadpan/sarcastic
                    stability: isRude ? 0.8 : 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("ElevenLabs API Error:", errorData);
            return res.status(response.status).json({ error: errorData.detail?.message || 'ElevenLabs API Error' });
        }

        // ElevenLabs returns raw audio binary (buffer)
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Convert binary to base64 so frontend can easily play it
        const base64Audio = buffer.toString('base64');

        res.status(200).json({ audioContent: base64Audio });
    } catch (error) {
        console.error("Failed to fetch ElevenLabs TTS:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
