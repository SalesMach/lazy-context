# Nextfleet · Fontes, benchmarks e modelo de impacto para o relatório

**Fase:** estudo e mapeamento (antes de reconstruir o relatório)
**Data:** 2026-11-06
**Objetivo:** levantar dados de mercado que permitam ao relatório do diagnóstico mostrar perdas, custos, tempo, risco e a posição do lead em relação à média do mercado, cobrindo todos os cenários de frota.

---

## 1. Como ler este documento

Cada dado recebe um **nível de confiança**, que define como ele pode aparecer no relatório:

| Nível | O que é | Como usar no relatório |
|---|---|---|
| **A** | Órgão oficial, lei, associação setorial ou índice público (ANP, NTC, CNT, ABLA, Senatran, CTB, Detran) | Citar como fato, com fonte e data |
| **B** | Pesquisa com amostra declarada ou trabalho acadêmico (Arval Barometer, Verizon Connect, UTFPR, Ipea, Abramet) | Citar como pesquisa, nomeando a fonte e a amostra |
| **C** | Estimativa de fornecedor ou blog setorial, sem metodologia pública | Usar só como faixa conservadora, rotulada "estimativa de mercado", nunca como fato |
| **Gap** | Não existe fonte confiável | Pedir o número ao lead (campo opcional) ou calcular a partir dos dados dele; não inventar |

Regra de ouro: **todo número do relatório sai de uma fonte A ou B, de uma faixa C explicitamente rotulada, ou de um dado que o próprio lead informou.** O cálculo e a origem devem ficar visíveis no rodapé do relatório ("Como calculamos").

---

## 2. Mapa de fontes por tema

### 2.1 Combustível e abastecimento

| Dado | Valor | Nível | Fonte |
|---|---|---|---|
| Participação do diesel no custo do transporte rodoviário de cargas | 43,2% (2025) e 44,7% (1º sem. 2026); veículo 29,1%, motorista 19,5% | A | NTC&Logística, via [Mundo Logística](https://mundologistica.com.br/noticias/conta-do-transporte-rodoviario-de-cargas) e [Transporte Moderno](https://transportemoderno.com.br/2026/08/28/frete-rodoviario-opera-105-abaixo-do-custo-aponta-ntc/) |
| Preço médio nacional, semana 25 a 31/10/2026 | Diesel S10 R$ 7,31 a 7,34/l · Gasolina R$ 6,48 a 6,52/l · Diesel comum R$ 7,00/l | A | ANP, via [painel agregado](https://www.combustiveis-anp.com.br/) |
| Consumo em marcha lenta (motor ocioso) | Leves 1 a 2 l/h · Pesados 3 a 5 l/h · Média geral 1,5 a 3,5 l/h · EPA: pesados 3,8 l/h | B/C | [Geotab](https://www.geotab.com/pt-br/blog/impacto-tempo-ocioso-motor-eficiencia-frota/), [Golfleet](https://golfleet.com.br/ociosidade-da-frota) |
| Redução de consumo com controle de motor ocioso e telemetria | Até 10% no diesel total (Naevestad et al., 2023, citado em estudo UTFPR); 12 a 20% em relatos de fornecedores | B/C | [UTFPR, estudo de caso Cantelle](https://riut.utfpr.edu.br/jspui/bitstream/1/37878/1/gestaofrotasdieselutilizacao.pdf), [Revista Cobertura](https://www.revistacobertura.com.br/noticias/auto-servicos/telemetria-pode-reduzir-ate-20-do-consumo-de-diesel-e-gerar-economia-de-r-122-a-cada-100-litros-nas-frotas/) |
| Economia média de combustível reportada por frotas com rastreamento | 16% em 2025 (era 8% em 2021); amostra de 543 gestores, EUA | B | [Verizon Connect Fleet Technology Trends 2025](https://www.verizon.com/about/news/verizon-connect-report-fleet-tech) |
| Perda de combustível sem controle estruturado | "Até 10%" | C | [Geotab](https://www.geotab.com/pt-br/blog/controle-de-abastecimento-e-gestao-de-custos/) |
| Taxa de fraude em cartões combustível | 12% em 2024 (mercado norte-americano) | B (não brasileiro) | WEX, via Geotab |
| Empresas que já identificaram fraude no abastecimento | Mais de 20% | C | Pesquisa atribuída à Associação Brasileira de Gestão de Frotas, relatório original não localizado |
| Qualidade do combustível vendido | 28% de irregularidades em 3.210 amostras, 14 estados, 2025 | B | ICL, via [Canaltech](https://canaltech.com.br/carros/combustivel-adulterado-estudo-mostra-numeros-alarmantes-no-brasil/) |

### 2.2 Manutenção, pneus e disponibilidade

| Dado | Valor | Nível | Fonte |
|---|---|---|---|
| Custo fixo mensal de caminhão (base NTC/FIPE, set/2025) | Caminhão 3/4: R$ 17.618 · Truck 3 eixos: R$ 17.355, para 240 h/mês | A | NTC/FIPE, via [IPTC "Custo da hora parada"](https://www.iptcsp.com.br/wp-content/uploads/2025/10/Custo-da-Hora-Parada.pdf) |
| Custo da hora parada de caminhão | R$ 90 a 92 por hora (custo fixo ÷ horas trabalhadas, corrigido por despesas administrativas) | A | Mesma fonte |
| Corretiva vs preventiva | Corretiva custa 3 a 5x mais (fornecedores); "+30%" atribuído ao US DOE; "+65%" em base de 200 frotas de um fornecedor | C | [Fleetmax](https://fleetmax.eu/pt/blog/gestao-manutencao-frota), [Geotab](https://www.geotab.com/pt-br/blog/manutencao-preventiva-vs-corretiva-gestao-de-frotas/), [Infleet](https://infleet.com.br/blog/custos-elevados-com-a-manutencao-da-frota-saiba-como-reduzir/) |
| Ganho de disponibilidade com programa de preventiva | Até 15% (máquinas pesadas) | B | [TCC, repositório Cogna](https://repositorio.pgsscogna.com.br/bitstream/123456789/49159/1/HUDSON+GAMA+LEITE+DA+SILVA.pdf) |
| Metas de referência | Disponibilidade ≥ 95% · Cumprimento do plano preventivo ≥ 90% · Disponibilidade = MTBF ÷ (MTBF + MTTR) | C (prática de manutenção industrial) | [Abecom](https://www.abecom.com.br/indicadores-de-manutencao-kpis/) |
| Participação dos pneus no custo de caminhão | 5 a 8% (custo variável) até 10 a 20% (fontes de gestão de pneus) | C | [Blog Caminhões e Carretas](https://blog.caminhoesecarretas.com.br/2026/06/custo-operacional-caminhao/), [Brazil Tires](https://braziltires.com.br/caminhao/) |
| Recapagem | R$ 300 a 600 por pneu vs R$ 1.000 a 2.500 novo; economia de 40 a 50% | C | [Prolog](https://prologapp.com/blog/recapagem-de-pneus/) |
| Gestão de pneus | Vida útil de 80 mil km para 100 a 120 mil km; até 25% de redução no custo por km | C | [Brazil Tires](https://braziltires.com.br/caminhao/) |
| Custo por km do pneu | Exemplos: R$ 0,014/km (premium com 2 recapagens) a R$ 0,036/km (entrada, sem recapagem) | C | [Pneus Express](https://pneusexpress.eco.br/como-calcular-o-custo-por-quilometro-do-pneu-recapado/) |

### 2.3 Multas, documentação e compliance

| Dado | Valor | Nível | Fonte |
|---|---|---|---|
| Multa por não indicação de condutor (NIC) | Dobro da multa original, para pessoa jurídica (Lei 14.229/2021, art. 257 CTB) | A | [Frota162](https://www.frota162.com.br/blog/multa-nic-o-que-e/) |
| Valores por gravidade (CTB) | Média R$ 130,16 · Grave R$ 195,23 · Gravíssima R$ 293,47 | A | CTB |
| Premissa de volume de multas em frotas | 4 multas por veículo por ano, valor médio R$ 170, NIC em ~20% das multas | C | [Portal Multas](https://portalmultas.com.br/) |
| Custo real de infração de velocidade (multa + combustível + desgaste) | 3 a 7x o valor nominal | C | [Infratrack](https://infratrack.com.br/blog/controle-velocidade-excessiva-frota-custo-real) |
| Licenciamento vencido | Infração gravíssima, R$ 293,47, 7 pontos, remoção do veículo | A | CTB, via [Ziffer](https://zifferassessoria.com.br/blog/multa-licenciamento-vencido-2026-sp) |
| Custo de remoção e pátio (SP, 2026) | Remoção R$ 422,62 · Diária R$ 42,26 · Liberação R$ 20,82 | A (varia por estado) | Detran-SP, via mesma fonte |
| Frota com licenciamento vencido | 23,7% dos veículos da região de Campinas (set/2026) | A (regional) | Detran-SP, via [Poupatempo Campinas](https://www.agendamentocampinas.org/um-em-cada-quatro-veiculos-em-campinas-esta-com-licenciamento-vencido/) |
| Jornada do motorista | 8 h/dia, 44 h/semana (art. 235-C CLT, Lei 13.103); STF ADI 5322: tempo de espera conta como tempo à disposição | A | [Projuris](https://www.projuris.com.br/blog/controle-de-jornada-de-trabalho-de-motoristas/) |
| Valor médio de condenação trabalhista por jornada | **Gap**: nenhuma estatística pública localizada (seria preciso consultar painéis do TST/CNJ) | Gap | — |

### 2.4 Sinistros, segurança e seguro

| Dado | Valor | Nível | Fonte |
|---|---|---|---|
| Custo médio por acidente em rodovias federais (2024, IPCA dez/2024) | Sem vítima R$ 41,4 mil · Com vítima R$ 170,5 mil · Com morte R$ 1,17 milhão | A | [CNT, Boletim março/2025](https://data.cnt.org.br/wp-content/uploads/2025/07/Boletim%20Unificado%20-%20Mar%C3%A7o%202025.pdf) |
| Custo total de acidentes em rodovias federais | R$ 16,8 bilhões em 2025; média anual R$ 15,6 bi (2016 a 2024) | A | [CNT](https://cnt.org.br/agencia-cnt/acidentes-em-rodovias-federais-geram-custo-de-r-168-bilhes-e-expem-desafios-de-comportamento-e-infraestrutura) |
| Custo social médio por ocorrência (todo o trânsito) | R$ 261.689 por ocorrência; R$ 664.821 com vítima fatal | B | [Ipea, TD 2565](https://www.ipea.gov.br/atlasviolencia/arquivos/artigos/7018-td2565.pdf) |
| Redução de custo com acidentes em frotas com tecnologia | 22% em 2025 (era 11% em 2021); 57% citam segurança como principal benefício | B | [Verizon Connect 2025](https://www.verizon.com/about/news/verizon-connect-report-fleet-tech) |
| Seguro de frota vs apólices individuais | 10 a 35% mais barato por veículo a partir de 10 veículos; histórico de sinistros altera o prêmio | C | [BR Seguro](https://www.brseguro.com/seguro-frota-leve), [Smartia](https://www.smartia.com.br/blog/seguro-de-frota/) |
| Motos: internações no SUS | 148.797 motociclistas internados até nov/2024, custo R$ 233 milhões; motociclistas são quase 60% dos sinistros | A/B | Ministério da Saúde e Abramet, via [Tribuna de Minas](https://tribunademinas.com.br/noticias/brasil-e-mundo/21-03-2025/internacoes-por-acidentes-de-moto-custaram-r-233-milhoes-em-2024.html) |
| Motos: acidentes de trabalho com entregadores | +34,9% entre 2023 e 2025 (8.582 para 11.579 notificações); 34.004 casos acumulados | A | Ministério da Saúde/MPT, via [Alma Preta](https://almapreta.com.br/sessao/cotidiano/acidentes-entregadores-cresce-brasil/) |
| Custo médio de sinistro por frota corporativa (leves) | **Gap**: nenhum dado público; seria preciso CNseg/SUSEP ou histórico do lead | Gap | — |

### 2.5 Gestão, processos e tempo administrativo

| Dado | Valor | Nível | Fonte |
|---|---|---|---|
| Veículos conectados vs uso dos dados (Brasil) | 49% das empresas têm veículos conectados, só 25% usam os dados | B | Arval Barômetro de Frota e Mobilidade 2025, via [Infleet](https://infleet.com.br/blog/programa-de-gestao-de-frotas-o-que-e/) |
| Transportadoras que fazem gestão de frota | 15 em cada 100; 50% não reconhecem ter sofrido perda ou desvio de combustível | B (pesquisa antiga, ~2022) | [Pé na Estrada](https://penaestrada.com.br/de-cada-100-empresas-de-transporte-apenas-15-fazem-gestao-de-frota-revela-pesquisa/) |
| Frotas comerciais conectadas na América Latina | Mais de 80% até 2026 (projeção) | B | Frost & Sullivan, via [GM Fleet](https://www.gmfleet.com.br/pt-br/inicio/blog---gm-fleet/tendencias-2025-para-a-gestao-de-frotas-.html) |
| Base instalada de gestão de frotas na América Latina | 16,6 milhões de unidades até 2029 | B | [Berg Insight, Fleet Management in Latin America 2025](https://media.berginsight.com/2025/07/11211958/bi-fmla1-ps.pdf) |
| Retorno do investimento em rastreamento | 47% têm ROI positivo em menos de 1 ano | B | Verizon Connect 2025 |
| Tempo consolidando planilhas | Frota de 50 veículos: ~3 h/semana, mais de 150 h/ano; acima de 2 h/semana em relatórios já justifica sistema; planilha deixa de dar conta acima de ~10 veículos | C | [Edenred Mobilidade](https://blog.edenredmobilidade.com.br/gestao-de-frotas/software-de-gestao-de-frotas/), [Braincargo](https://braincargo.com.br/blog/gestao-frota-planilha-sistema-integrado/) |
| Intenção de crescimento de frota | 33% preveem crescer (edição 2026, global; 28% no ano anterior) | B | [Arval Mobility Observatory 2026](https://www.arval.co.uk/amo-insight) |
| Defasagem entre custo e frete no TRC | 10,5% abaixo do custo no 1º sem. 2026 (era 15,3% em 2024) | A | NTC, via Transporte Moderno |

### 2.6 Cenários específicos

| Cenário | Dado | Valor | Nível | Fonte |
|---|---|---|---|---|
| **Frota locada** | Frota das locadoras · investimento médio por veículo · gestão e terceirização | 1.717.848 veículos (2025) · R$ 126.050 · 54% da frota em gestão/terceirização · faturamento R$ 61,7 bi | A | [ABLA Anuário 2026](https://virapagina.com.br/abla2026/), via [Brasilturis](https://brasilturis.com.br/2026/03/18/anuario-abla-2026-locadoras-faturam-61-7-bilhoes-em-2025/) e [Expo ABLA](https://expoabla.com/2026/04/06/locadoras-gastaram-r-793-bi-na-compra-de-veiculos-em-2025/) |
| **Leves corporativos** | Custo por km (hatch/sedã) | R$ 1,20 a 1,80/km; carro próprio R$ 0,75 a 1,20/km | C | [Payfy](https://payfy.io/blog/custo-do-km-rodado-para-carros-de-passeio), blogs de gestão |
| **Ônibus** | Composição do custo por km (Curitiba/URBS) | Pessoal ~44% · Combustível ~20% · Peças ~7,6% · Rodagem ~2,4% · Tarifa técnica R$ 7,68 (set/2025) | A (municipal) | [URBS](https://www.urbs.curitiba.pr.gov.br/transporte/tarifas-custos), [Anuário NTU 2024-2025](https://technibus.com.br/2025/08/11/anuario-ntu-2024-2025-revela-avanco-em-subsidios) |
| **Máquinas e equipamentos** | Controle por horímetro (UBM), disponibilidade ≥ 95%, +15% disponibilidade com preventiva | Ver 2.2 | B/C | Ver 2.2 |
| **Máquinas** | Custo da hora parada por tipo de equipamento | **Gap**: só há números de manufatura (R$ 5 a 50 mil/h), não aplicáveis | Gap | — |
| **Motos** | Sinistralidade e internações | Ver 2.4 | A/B | Ver 2.4 |
| **Uso particular** | Km fora do horário | Caso real: ~400 km/mês por gestor; fornecedores citam até 25% a mais de combustível sem monitoramento | C | [Maxifrota](https://maxifrota.com.br/blog/uso-particular-veiculo-da-empresa/), [Infratrack](https://infratrack.com.br/blog/gestao-frotas-leves) |
| **Mercado** | Frota brasileira · caminhões · concentração | 124 a 129 milhões de veículos · 2,2 a 3,2 milhões de caminhões (fontes divergem) · SP com 27,4% | A | Senatran, via [AutoData](https://www.autodata.com.br/noticias/2025/02/04/frota-brasileira-cresce-para-124-milhoes-de-veiculos-e-e-a-maior-da-historia/83652/) e [Sindicamp](https://sindicamp.org.br/frota-de-veiculos-no-brasil-sudeste-lidera-o-ranking-nacional-e-regiao-sul-ocupa-a-segunda-colocacao/) |

---

## 3. Lacunas e como tratá-las

| Lacuna | Tratamento proposto |
|---|---|
| Custo médio de sinistro em frota leve corporativa | Perguntar ao lead "quantos sinistros no último ano" (já existe) e usar o custo CNT sem vítima (R$ 41,4 mil) como teto e uma faixa conservadora de R$ 5 a 15 mil para colisão leve urbana, rotulada como estimativa. Buscar CNseg/SUSEP para a versão 2. |
| Valor médio de passivo trabalhista por jornada | Não estimar em reais. Mostrar como risco qualitativo (semáforo) com a base legal. |
| Custo da hora parada de máquinas | Pedir ao lead o custo/hora ou o valor de locação da máquina (campo opcional). |
| Percentual típico de km em uso particular | Pedir ao lead os km/mês por veículo e mostrar o custo de cada 10% de uso fora do horário. |
| Percentual de empresas em planilha por porte | Triangular (ver seção 4) e recalibrar com os próprios respondentes do diagnóstico. |
| Pesquisa Arval Brasil 2025 completa, Berg Insight LatAm, tabelas do DECOPE/NTC, anuário ABLA completo | Obter os PDFs originais antes da versão 2 do relatório; os valores aqui vêm de citações secundárias. |

---

## 4. Média de mercado: como construir o benchmark de tecnologia e processos

Não existe uma pesquisa brasileira pública com "score de maturidade por porte". A proposta é construir uma **curva de referência por triangulação**, declarada como estimativa Nextfleet, e substituí-la pela média real dos respondentes assim que houver volume.

### 4.1 Âncoras disponíveis

- 49% das empresas brasileiras têm veículos conectados, mas só 25% usam os dados (Arval 2025). Isso separa "ter tecnologia" de "ter processo".
- Só 15 em 100 transportadoras fazem gestão de frota estruturada (pesquisa setorial, ~2022).
- Planilha deixa de funcionar acima de ~10 veículos (fornecedores), o que indica que micro e pequenas frotas estão majoritariamente em planilha ou papel.
- 54% da frota das locadoras está em gestão e terceirização (ABLA), ou seja, frotas corporativas grandes já têm processo contratual, mas não necessariamente controle próprio.
- Frotas com tecnologia relatam 16% de economia de combustível e 22% de redução no custo de acidentes (Verizon 2025); 47% com retorno em menos de 1 ano.

### 4.2 Curva de referência proposta (score 0 a 100, estimativa inicial)

| Porte da frota | Gestão | Combustível | Manutenção | Compliance | Condutores | Global |
|---|---|---|---|---|---|---|
| 1 a 5 | 20 | 25 | 25 | 20 | 20 | 22 |
| 6 a 20 | 30 | 35 | 32 | 30 | 28 | 31 |
| 21 a 50 | 42 | 45 | 42 | 40 | 38 | 42 |
| 51 a 150 | 52 | 55 | 50 | 50 | 48 | 51 |
| 151 a 500 | 60 | 62 | 58 | 58 | 55 | 59 |
| Mais de 500 | 68 | 70 | 65 | 66 | 62 | 67 |

Ajustes por cenário: frota pesada +5 em Combustível e Compliance (telemetria e tacógrafo mais comuns); frota locada +8 em Manutenção (locadora cuida) e -5 em Gestão (custo opaco); motos -8 em Condutores e Compliance; máquinas -5 em todos (controle por horímetro é raro).

Como será exibido: "Sua frota: 38. Média estimada para frotas de 21 a 50 veículos: 42. Frotas de referência (top 25%): 65+." Com nota de rodapé: "Média estimada pela Nextfleet com base em Arval 2025, pesquisas setoriais e respostas acumuladas neste diagnóstico."

### 4.3 Recalibração com dados próprios

A partir de ~100 respondentes por faixa de porte, a média passa a ser a mediana real dos scores do diagnóstico, e o "top 25%" passa a ser o 3º quartil. O relatório ganha legitimidade sem depender de fontes externas.

### 4.4 Dois eixos: tecnologia e processo

Para refletir o achado da Arval (ter dado não é usar dado), o relatório deve mostrar dois índices separados, calculados a partir das mesmas perguntas:

- **Índice de tecnologia**: ferramenta de controle, telemetria, checklist digital, alertas de documentos, abastecimento com cartão.
- **Índice de processo**: responsável definido, política escrita, fechamento mensal, indicadores acompanhados, indicação de condutor no prazo, feedback ao condutor.

Quadrantes: "Sem tecnologia e sem processo" (reativa), "Tecnologia sem processo" (o caso dos 49% vs 25%), "Processo sem tecnologia" (planilha bem gerida), "Tecnologia com processo" (referência).

---

## 5. Motor de impacto financeiro: fórmulas por pilar

Cada estimativa gera uma **faixa (conservadora a provável)** e carrega o código da fonte. Inputs já existentes no diagnóstico: porte, composição, respostas por pilar. Inputs novos opcionais (3 campos numéricos, pulam se o lead não souber): **km/mês por veículo**, **gasto mensal com combustível**, **gasto mensal com manutenção**.

Constantes por tipo de veículo (defaults quando o lead não informa):

| Tipo | km/mês | Consumo | Combustível | Custo manutenção/mês |
|---|---|---|---|---|
| Leve | 2.500 | 11 km/l | Gasolina R$ 6,50 | R$ 350 |
| Utilitário/van | 3.000 | 9 km/l | Diesel R$ 7,30 | R$ 500 |
| VUC/caminhão leve | 4.000 | 7 km/l | Diesel | R$ 900 |
| Pesado/carreta | 8.000 | 2,5 km/l | Diesel | R$ 2.500 |
| Moto | 2.500 | 30 km/l | Gasolina | R$ 150 |
| Ônibus | 6.000 | 2,8 km/l | Diesel | R$ 2.000 |
| Máquina | 180 h/mês | 12 l/h | Diesel | R$ 3.000 |

Esses defaults são estimativas de engenharia (nível C) e devem ser validados com a Nextfleet, que tem dados reais de clientes. Isso, aliás, é o maior ativo: **a base de clientes da Nextfleet pode virar a fonte A do relatório** (custo médio por km por tipo de veículo, multas por veículo/ano, consumo médio), com anonimização.

### 5.1 Combustível

```
Gasto anual estimado  = Σ (veículos_tipo × km_mês ÷ consumo × preço) × 12   [ou gasto informado × 12]
Perda por descontrole = gasto × 5% a 10%        se comb_controle = nenhum      (C: Geotab "até 10%")
                      = gasto × 2% a 5%         se controle básico
Perda por ociosidade  = veículos × h_ociosas/dia × l/h × preço × 250 dias     se comb_ocioso = sim   (B/C: 1 a 2 l/h leves, 3 a 5 l/h pesados; assumir 1 h/dia)
Oportunidade com gestão = gasto × 10% a 16%     (B: UTFPR até 10%, Verizon 16%)
```

### 5.2 Manutenção e disponibilidade

```
Gasto anual estimado      = Σ veículos_tipo × custo_manut_mês × 12   [ou informado × 12]
Sobrecusto por corretiva  = gasto × 30% a 65%     se man_tipo = corretiva   (C: DOE +30%, fornecedor +65%)
Custo de veículo parado   = dias_parados/ano × custo_dia_parado
   custo_dia_parado pesado = R$ 90/h × 8 h ≈ R$ 720 (A: NTC/FIPE)
   custo_dia_parado leve   = depreciação + seguro + salário ≈ R$ 150 a 250 (C)
   dias_parados default    = 12/ano corretiva, 5/ano preventiva, se man_parado = não sei
Pneus (pesados)           = gasto_pneus × 20% a 25% de economia com gestão (C), onde gasto_pneus ≈ 8% do custo operacional
```

### 5.3 Multas e documentos

```
Multas/ano estimadas   = veículos × 4 × R$ 170               (C: Portal Multas)
Sobrecusto NIC         = multas × 20% × 2                     se multas_indicacao ∈ {às vezes, absorve}   (A: NIC em dobro; C: 20%)
Custo indireto         = multas × 2 (faixa 3 a 7x total)      se cond_comportamento = não            (C: Infratrack)
Risco documental       = veículos × 24% × (R$ 293 + R$ 423 + 3 × R$ 42 + 1 dia parado)   se docs_venc ∈ {ninguém, não sei}   (A: Detran-SP; A regional: 23,7%)
```

### 5.4 Sinistros e segurança

```
Sinistros/ano          = informado (faixa) ou 0,15 × veículos se não sabe (C)
Custo por sinistro     = R$ 5 a 15 mil leve urbano (C) · R$ 41,4 mil rodoviário sem vítima (A: CNT)
Redução com gestão     = 22% do custo de sinistros (B: Verizon)
Motos                  = exibir alerta de sinistralidade (A: +35% acidentes com entregadores) sem converter em R$
```

### 5.5 Tempo e processo

```
Horas/ano em consolidação = tempo_consolidando: menos1 → 50 h · 1a3 → 100 h · mais3 → 200 h   (C: Edenred 150 h para 50 veículos)
Custo do tempo            = horas × R$ 60/h (custo médio de gestor com encargos, C)
Horas de decisão sem dado = se fechamento ∈ {não, pedem}: alerta qualitativo
```

### 5.6 Uso particular

```
Km fora do horário = veículos × km_mês × 10% a 15%     se uso_particular ≠ não e uso_regra = nada   (C)
Custo              = km × custo/km do tipo (R$ 1,20 a 1,80 leve, C)
```

### 5.7 Consolidação

```
Perda anual estimada (faixa)   = Σ perdas por pilar
Custo de não fazer nada (12 m) = perda anual
Economia potencial com gestão  = Σ oportunidades (sem contar 2x o mesmo item)
Payback de referência          = "47% das frotas recuperam o investimento em menos de 1 ano" (B: Verizon)
```

Regra anti-exagero: nunca somar "perda" e "oportunidade" do mesmo item; mostrar sempre a faixa, nunca só o teto; marcar com "estimativa" tudo que vier de nível C ou de default.

---

## 6. Cobertura por cenário

| Cenário | Dados específicos disponíveis | O que o relatório mostra de diferente |
|---|---|---|
| Micro frota (1 a 5) | Custo por km leve, multas, licenciamento | Relatório curto, foco em combustível e documentos, linguagem de dono |
| PME leve/utilitário | Arval, custo por km, uso particular, tempo em planilha | Tempo administrativo e uso particular em destaque |
| Pesados e carretas | NTC (43 a 45% diesel, hora parada R$ 90), pneus, jornada, CNT sinistros | Hora parada, pneus, jornada e diesel; comparação com defasagem de frete |
| Motos | Abramet, MPT, SUS | Sinistralidade e EPI; sem estimativa de perda em R$ além de multas |
| Máquinas | Horímetro, disponibilidade, preventiva +15% | Disponibilidade e custo/hora informado pelo lead |
| Ônibus | URBS, NTU | Composição de custo (pessoal 44%, combustível 20%) |
| Frota locada | ABLA (54% terceirizada, R$ 126 mil por veículo) | Custo oculto do contrato, dias parados e cobranças extras |
| Agregados | NTC, jornada | Compliance e risco de vínculo; sem custo de manutenção |
| Grandes frotas (150+) | Berg Insight, Verizon, Arval (49/25) | Quadrante tecnologia × processo; integração de dados |

---

## 7. Estrutura proposta para o relatório (versão 2)

1. **Capa executiva**: nível global, score, posição vs média do porte e vs referência (barra com três marcadores).
2. **Mapa de perdas estimadas**: cascata (waterfall) com a perda anual por pilar, faixa mínima e máxima, e o total "custo de não fazer nada em 12 meses".
3. **Radar por pilar**: sua frota × média do porte × referência (top 25%).
4. **Quadrante tecnologia × processo** com a posição do lead e a explicação da Arval (49% têm dados, 25% usam).
5. **Impacto em tempo**: horas por ano em tarefas manuais e o equivalente em dias de trabalho.
6. **Painel de risco (semáforo)**: documentos, NIC, jornada, sinistralidade, uso particular, com a base legal de cada item.
7. **Comparativo "sua frota vs frota referência"**: tabela com 5 ou 6 indicadores (custo por km, consumo, multas por veículo, dias parados, disponibilidade), com o valor do lead quando informado, a média estimada e a referência.
8. **Achados personalizados** (já existe) agora com o valor em R$ de cada achado.
9. **Plano 30/60/90 dias** por pilar, ligado aos módulos Nextfleet, com a economia estimada de cada passo.
10. **Como calculamos**: lista das fontes e dos defaults usados, com o nível de confiança, e convite para informar os números reais e receber a versão precisa.
11. **CTA**: simulação com dados reais em 30 minutos.

Visualizações: gauge do score, waterfall de perdas, radar triplo, quadrante, barras comparativas, timeline 30/60/90. Tudo em SVG/HTML inline, na paleta da marca.

---

## 8. Decisões necessárias com a Nextfleet

1. **Abrir a base de clientes como fonte**: custo médio por km, multas por veículo/ano, consumo médio e dias parados por tipo de veículo, anonimizados. Isso transforma a maioria dos itens C em dados próprios (nível A) e vira diferencial competitivo.
2. **Validar os defaults por tipo de veículo** da seção 5 com a equipe técnica.
3. **Aprovar a curva de referência** da seção 4.2 como estimativa inicial, com o compromisso de recalibrar com os respondentes.
4. **Definir o tom das perdas**: faixa conservadora (recomendado) ou valor provável. Faixa protege a credibilidade; valor único vende mais, mas expõe.
5. **Confirmar os 3 campos numéricos opcionais** (km/mês, gasto com combustível, gasto com manutenção). Eles elevam muito a precisão e podem ficar fora da rota curta.
6. **Obter os PDFs originais** (Arval Brasil 2025, Berg Insight LatAm 2025, planilha DECOPE/NTC, Anuário ABLA 2026, Boletim CNT) para citar com página e data.
