# Diagnóstico de Maturidade da Gestão de Frota · NEXTfleet (protótipo de frontend)

Protótipo estático, sem backend e sem build, para validar o fluxo visual, as rotas condicionais e o relatório.

## Como abrir

Abra `index.html` direto no navegador ou sirva a pasta:

```bash
cd nextfleet/diagnostico-maturidade/frontend
python3 -m http.server 8080
```

## Arquivos

| Arquivo | O que contém |
|---|---|
| `index.html` | Casca da aplicação (mobile-first). |
| `styles.css` | Tokens de marca extraídos de nextfleet.com.br (navy `#011831`, azul `#007aff`, Montserrat, botões em pílula) e todos os estilos. |
| `data.js` | Etapas, banco de perguntas, regras de rota (`showIf`, `short`), pontuação por pilar, níveis, achados personalizados, módulos NEXTfleet usados nas recomendações e personas de teste. |
| `app.js` | Motor do fluxo: sequência dinâmica, navegação, pontuação, página de resultado, ficha do lead e painel de validação. |
| `assets/logo-nextfleet.png` | Logo oficial, baixado do site. |

## Painel de validação

O botão **Validação** (canto inferior direito) permite:

- preencher o questionário com uma persona e ir direto ao resultado;
- ver quais rotas estão ativas e quais perguntas ficaram fora da rota (riscadas);
- pular para qualquer pergunta visível, para o início ou para o resultado.

## O que muda de uma rota para outra

As regras estão em `data.js` (`showIf` em cada pergunta e a flag `short` para a rota curta de 1 a 5 veículos). O resumo das rotas está em `../01-mapeamento-e-analise.md`, seção 3.3.

## Fora do escopo deste protótipo

Captura de contato, envio para CRM, geração de PDF e persistência. Os botões de CTA mostram apenas um aviso.
