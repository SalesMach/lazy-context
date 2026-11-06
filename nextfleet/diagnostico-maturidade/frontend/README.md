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
| `data.js` | Etapas, banco de perguntas (incluindo os 3 campos numéricos opcionais), regras de rota (`showIf`, `short`), pontuação por pilar, níveis, achados, módulos NEXTfleet, personas de teste, constantes do motor de impacto, curva de mercado por porte, índices de tecnologia e processo e a lista de fontes com nível de confiança. |
| `report.js` | Motor do relatório v2: cálculo de perdas por pilar (faixa conservadora a provável), benchmark de mercado, índices de tecnologia e processo, riscos de compliance, comparativo de indicadores, plano 30/60/90 e gráficos SVG (gauge, cascata, radar, quadrante, timeline). |
| `app.js` | Motor do fluxo: sequência dinâmica, navegação, pontuação, orquestração do relatório, ficha do lead e painel de validação. |
| `assets/logo-nextfleet.png` | Logo oficial, baixado do site. |

## Relatório v2

Seções, em ordem: capa executiva (score contra média do porte e referência, perda anual, horas manuais, riscos críticos), cascata de perdas, radar triplo, quadrante tecnologia × processo, riscos de compliance com base legal, comparativo de indicadores, achados com valor em reais, plano de 90 dias ligado aos módulos, pilares por onde começar, CTA, "Como calculamos" (fontes e níveis de confiança) e ficha do lead.

As constantes e fórmulas estão em `data.js` (`IMPACT`, `VEHICLE`, `MARKET_CURVE`, `SOURCES`) e `report.js` (`impact`). O estudo que as fundamenta está em `../02-fontes-e-benchmarks.md`.

## Painel de validação

O botão **Validação** permite preencher com personas e ir direto ao resultado, ver rotas ativas, perguntas fora da rota e pular para qualquer tela.

## Fora do escopo deste protótipo

Captura de contato, envio para CRM, geração de PDF e persistência. Os botões de CTA mostram apenas um aviso.
