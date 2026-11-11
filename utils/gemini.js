// Cliente simples da API do Gemini (camada gratuita do Google AI Studio).
// Modelos em ordem de preferência: se um não existir na conta (404) ou estiver
// sobrecarregado (503), tenta o próximo.
const MODELOS = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
const ENDERECO = 'https://generativelanguage.googleapis.com/v1beta/models';

export const LINK_CHAVE = 'https://aistudio.google.com/apikey';

// A chave pode vir do .env.local (EXPO_PUBLIC_GEMINI_API_KEY) ou ser colada no app.
export const chaveDoAmbiente = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

export class LimiteAtingido extends Error {}
export class SemChave extends Error {}
export class ChaveInvalida extends Error {}
export class SemConexao extends Error {}

// A conversa precisa começar com a pessoa e alternar os papéis; junta mensagens seguidas.
const montarConteudo = (mensagens) => {
  const conteudo = [];
  mensagens.forEach(({ papel, texto }) => {
    const role = papel === 'pessoa' ? 'user' : 'model';
    if (conteudo.length === 0 && role === 'model') {
      return;
    }
    const ultima = conteudo[conteudo.length - 1];
    if (ultima && ultima.role === role) {
      ultima.parts[0].text += `\n${texto}`;
    } else {
      conteudo.push({ role, parts: [{ text: texto }] });
    }
  });
  return conteudo;
};

export async function perguntarGemini({ chave, instrucoes, mensagens }) {
  if (!chave) {
    throw new SemChave();
  }

  for (const modelo of MODELOS) {
    let resposta;
    try {
      resposta = await fetch(`${ENDERECO}/${modelo}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': chave },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instrucoes }] },
          contents: montarConteudo(mensagens),
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
    } catch {
      throw new SemConexao();
    }

    if (resposta.status === 404 || resposta.status === 503) {
      continue;
    }
    const dados = await resposta.json().catch(() => ({}));
    const mensagemErro = dados?.error?.message ?? '';

    if (resposta.status === 429 || dados?.error?.status === 'RESOURCE_EXHAUSTED') {
      throw new LimiteAtingido(mensagemErro);
    }
    if (resposta.status === 403 || /api key/i.test(mensagemErro)) {
      throw new ChaveInvalida(mensagemErro);
    }
    if (!resposta.ok) {
      throw new Error(mensagemErro || `Erro ${resposta.status}`);
    }

    const texto = (dados?.candidates?.[0]?.content?.parts ?? [])
      .map((parte) => parte.text ?? '')
      .join('');
    if (!texto) {
      throw new Error('O Revi ficou sem palavras. Tenta perguntar de outro jeito.');
    }
    return texto;
  }
  throw new Error('Nenhum modelo do Gemini disponível para esta chave.');
}

// Lê o JSON da resposta; se vier com texto em volta, pega só o objeto.
export const lerJson = (texto) => {
  try {
    return JSON.parse(texto);
  } catch {
    const trecho = texto.match(/\{[\s\S]*\}/);
    if (!trecho) {
      return null;
    }
    try {
      return JSON.parse(trecho[0]);
    } catch {
      return null;
    }
  }
};
