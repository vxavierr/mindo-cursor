import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, action } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_AI_API');

    console.log('Recebida requisição:', { action, textLength: text?.length });

    if (!googleApiKey) {
      console.error('GOOGLE_AI_API key not found in environment');
      return new Response(
        JSON.stringify({ error: 'Google AI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!text || !action) {
      console.error('Missing text or action in request');
      return new Response(
        JSON.stringify({ error: 'Text and action are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let prompt = '';
    
    switch (action) {
      case 'improve':
        prompt = `Melhore este texto mantendo o significado original, mas tornando-o mais claro, coeso e bem estruturado. Retorne APENAS o texto melhorado, sem explicações, opções ou formatação extra:

${text}`;
        break;
        
      case 'generate_tags':
        prompt = `Gere até 5 tags relevantes e concisas para este aprendizado em português. Retorne APENAS as tags separadas por vírgula, sem numeração, explicações ou formatação extra:

${text}`;
        break;
        
      case 'generate_title':
        prompt = `Gere um título conciso e descritivo para este aprendizado em português. Máximo 40 caracteres. Retorne APENAS o título, sem aspas, explicações ou formatação extra:

${text}`;
        break;
        
      default:
        console.error('Invalid action:', action);
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: improve, generate_tags, or generate_title' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    console.log('Enviando para Gemini API, action:', action);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Resposta da Gemini API:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Gemini API' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const result = data.candidates[0].content.parts[0].text.trim();
    console.log('Resultado processado:', result);

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enhance-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
