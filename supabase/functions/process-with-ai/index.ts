
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_AI_API');

    if (!apiKey) {
      throw new Error('Google AI API key not configured');
    }

    let prompt = '';
    
    switch (action) {
      case 'improve_text':
        prompt = `Melhore a coesão e clareza do seguinte texto de aprendizado, mantendo a estrutura original e o significado. Seja conciso e objetivo:

"${content}"

Retorne apenas o texto melhorado, sem explicações adicionais.`;
        break;
        
      case 'generate_title_tags':
        prompt = `Baseado no seguinte conteúdo de aprendizado, gere:
1. Um título conciso (máximo 60 caracteres)
2. Tags relevantes (máximo 5 tags, separadas por vírgula)

Conteúdo: "${content}"

Formato de resposta:
TÍTULO: [título aqui]
TAGS: [tag1, tag2, tag3]`;
        break;
        
      case 'transcribe_audio':
        // Para transcrição de áudio, usaremos a mesma API mas com prompt específico
        prompt = `Transcreva e organize o seguinte conteúdo falado sobre um aprendizado, tornando-o claro e bem estruturado:

"${content}"

Retorne apenas o texto transcrito e organizado, sem explicações adicionais.`;
        break;
        
      default:
        throw new Error('Invalid action');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1000,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google AI API error: ${error}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (action === 'generate_title_tags') {
      // Parse the response to extract title and tags
      const lines = generatedText.split('\n');
      const titleLine = lines.find(line => line.startsWith('TÍTULO:'));
      const tagsLine = lines.find(line => line.startsWith('TAGS:'));
      
      const title = titleLine ? titleLine.replace('TÍTULO:', '').trim() : '';
      const tags = tagsLine ? 
        tagsLine.replace('TAGS:', '').trim().split(',').map(tag => tag.trim()).filter(Boolean) : 
        [];

      return new Response(JSON.stringify({ title, tags }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
