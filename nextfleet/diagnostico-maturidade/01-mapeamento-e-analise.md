# Nextfleet · Diagnóstico de Maturidade da Gestão de Frota

**Fase:** mapeamento e análise (sem construção ainda)
**Data:** 2026-11-06
**Insumo:** 16 telas do diagnóstico "Maturidade da gestão de frota" da Cobli (concorrente), navegado via WhatsApp Business → Safari mobile.

---

## 1. O que o diagnóstico da Cobli faz (mapeamento fiel ao observado)

### 1.1 Estrutura geral

| Etapa | Nome | Nº de perguntas | Tempo informado | Visto nas telas |
|---|---|---|---|---|
| 01 | Conhecendo a sua empresa | 8 | não visto | Q3, Q6, Q7, Q8 |
| 02 | Manutenção | 4 | ~2 min | abertura, Q1, Q3, Q4 |
| 03 | Multas e sinistros | 3 | ~2 min | abertura, Q2 |
| 04 | Eficiência | 7 | ~3 min | abertura, Q1, Q2, Q4, Q5, Q6 |

Total: **22 perguntas**, ~8 a 9 minutos. Nenhuma tela de captura de contato nem de resultado foi enviada, então não dá para afirmar onde ficam o cadastro e o score.

### 1.2 Padrões de UX e mecânica

- Tela de abertura por etapa: ilustração temática, título "Etapa 0X", texto de propósito ("Queremos entender em que fase sua empresa está..."), tempo estimado em negrito e CTA "Vamos lá!".
- Indicador de progresso macro (01 · 02 · 03 · 04) na abertura e contador micro ("03/08") dentro da etapa.
- Toda pergunta é de **seleção única**, com cartões grandes e radio button. Avanço automático ao selecionar (não há botão "próxima" visível).
- Botão "voltar" sempre presente no topo.
- Conteúdo educativo embutido: link "Saiba mais sobre o que é uma Política de frotas" na Q8 da etapa 1.
- Linguagem: segunda pessoa, direta, sem jargão. Opções "Não sei" / "Não tenho esses dados" aparecem com frequência (bom para medir maturidade, porque a ausência de dado já é uma resposta).
- Distribuição por WhatsApp, abrindo o navegador do celular. Mobile-first.

### 1.3 Perguntas e opções capturadas

**Etapa 01 · Conhecendo a sua empresa**

| # | Pergunta | Opções |
|---|---|---|
| 3 | Qual é a estrutura atual de gestão da sua frota? | Um único gestor responsável · Setor específico de gestão de frotas · Mais de um setor responsável · Integrada em outro setor (administrativo, financeiro etc.) · Ninguém responsável |
| 6 | Você sente falta de alguma ferramenta para ter mais controle e visibilidade da sua operação? | Sim · Não |
| 7 | Qual é o maior gasto da sua frota? | Combustível · Sinistros · Multas · Motor ocioso · Manutenção · Outro(s) (cortado na tela) |
| 8 | A sua frota tem um conjunto de regras ou políticas que deve seguir? | Sim · Não (+ link educativo) |

Q1, Q2, Q4 e Q5 não foram enviadas. Pela posição e pelo título da etapa, provavelmente cobrem segmento, tamanho da frota, forma de controle atual e/ou cargo do respondente. **Isso é inferência, não observação.**

**Etapa 02 · Manutenção**

| # | Pergunta | Opções |
|---|---|---|
| 1 | A sua empresa é a responsável pela manutenção dos veículos da frota? | Sim · Não |
| 3 | A sua empresa faz mais manutenções corretivas ou preventivas? | Preventiva · Corretiva · Não sei |
| 4 | Por qual motivo você tem feito mais manutenções corretivas? | Esqueci de realizar na data/km · Não tinha orçamento · Não sei quando preciso realizar as preditivas |

Q2 não enviada (provavelmente "como você controla a manutenção hoje").

**Etapa 03 · Multas e sinistros**

| # | Pergunta | Opções |
|---|---|---|
| 2 | Você sabe quantas multas a sua frota levou e quantos sinistros sofreu no último ano? | Sim, sei exatamente · Controle parcial das multas · Não faço o controle, é de outro departamento · Não tenho esses dados |

Q1 e Q3 não enviadas.

**Etapa 04 · Eficiência**

| # | Pergunta | Opções |
|---|---|---|
| 1 | A sua empresa realiza algum controle sobre o consumo de combustível? | Sim, controle sobre consumo e gastos · Controle básico do consumo · Nenhum controle |
| 2 | Você sabe qual foi o seu custo com combustível no último mês? | Sim, sei exatamente · Não sei, é de outro departamento · Não tenho acesso a esses dados |
| 4 | Vocês costumam fornecer feedbacks imediatos sobre erros cometidos pelos motoristas? | Sempre · Às vezes · Preferimos posteriormente · Não temos cultura de feedback |
| 5 | Você sabe se os motoristas costumam deixar o motor ligado enquanto estão parados? | Sim, gostam de ficar ligado · Sim, mas não sei por que · Às vezes, ocasiões isoladas · Nunca reparei |
| 6 | Os motoristas podem utilizar o veículo para uso particular fora do horário? | Não, ficam na empresa · Às vezes precisam emprestados · Sim, levam para casa |

Q3 e Q7 não enviadas.

### 1.4 Ramificação observada no concorrente

Há evidência de **pelo menos uma rota condicional**: a Q4 da etapa 2 ("Por qual motivo você tem feito mais manutenções corretivas?") só faz sentido para quem respondeu "Corretiva" na Q3. É provável, mas não confirmado, que:

- "Não" na Q1 de manutenção pule o restante da etapa.
- "Outro(s)" na pergunta de maior gasto abra campo livre.

Fora isso, o fluxo parece majoritariamente linear.

---

## 2. Análise crítica do diagnóstico da Cobli

### 2.1 O que funciona bem (vale manter)

- **Curto e segmentado por domínio.** Quatro etapas com tempo declarado reduzem abandono.
- **Opções "Não sei / não tenho dados".** Transformam ignorância em sinal de maturidade sem constranger o lead.
- **Perguntas de comportamento, não de opinião.** "Você sabe quanto gastou?" mede mais que "você acha que controla bem?".
- **Educação no fluxo.** O link de política de frotas planta a dor enquanto pergunta.
- **Mobile e WhatsApp.** Combina com o canal onde o gestor de frota de PME realmente está.

### 2.2 Lacunas e fragilidades (oportunidade para a Nextfleet)

1. **Não caracteriza a frota.** Não há (no que foi visto) tipo de veículo, quantidade, propriedade (própria, locada, agregados), regime dos motoristas nem abrangência geográfica. Sem isso o comercial não sabe nem se o lead está no ICP, e as perguntas seguintes não podem se adaptar.
2. **Viés de telemetria.** Motor ocioso, feedback imediato ao motorista e uso particular são dores que o rastreador da Cobli resolve. Faltam dores de **gestão de gastos** (abastecimento, oficinas, pneus, documentação, centro de custo, conciliação de notas), que é justamente o território da Nextfleet.
3. **Perguntas Sim/Não com baixo sinal.** "Sente falta de ferramenta?" (Q6) e "tem política?" (Q8) quase não discriminam maturidade e não ajudam o vendedor. Precisam de gradação ou de desdobramento.
4. **Opções que misturam dimensões.** Na pergunta de maior gasto, "Motor ocioso" é causa, não categoria de custo. Isso enviesa a resposta para o produto do concorrente e confunde o lead.
5. **Pouca ramificação.** Um fluxo quase linear faz um lead com frota locada responder sobre manutenção preventiva e um lead sem controle nenhum responder sobre custo exato.
6. **Quase nada para o comercial.** Não aparecem perguntas de momento de compra: ferramenta atual, por que está olhando agora, prazo, quem decide, orçamento. O resultado serve ao lead, mas entrega pouco ao SDR.
7. **Sem cobertura de compliance e documentação.** CNH, licenciamento, indicação de condutor em multas, ANTT, tacógrafo e seguro são dores recorrentes e geram urgência, especialmente em frotas pesadas.
8. **Manutenção rasa.** Falta pneus (segundo maior custo em pesados), checklist diário, oficina própria vs terceira, tempo de veículo parado, disponibilidade da frota.
9. **Nenhum indicador financeiro de gestão.** Custo por km, custo por veículo, orçamento vs realizado. É a pergunta que mais separa frota gerenciada de frota "apagando incêndio" e é o coração da proposta da Nextfleet.

---

## 3. Proposta de estrutura para o diagnóstico da Nextfleet

### 3.1 Dois objetivos, dois tipos de pergunta

| Tipo | Serve a quem | Pontua no score? | Exemplos |
|---|---|---|---|
| **Perfil / qualificação** | Comercial (ICP, rota) | Não | Segmento, tamanho e composição da frota, propriedade, cargo |
| **Maturidade** | Lead (resultado) e comercial (dores) | Sim | Como controla combustível, manutenção, multas, custos |
| **Momento de compra** | Comercial | Não (gera prioridade) | Ferramenta atual, motivo de busca, prazo, decisor |

### 3.2 Módulos propostos

**M0 · Perfil da frota (qualificação, 6 a 8 perguntas, define as rotas)**

| Pergunta | Opções sugeridas | Por que importa |
|---|---|---|
| Segmento da empresa | Transporte/logística · Distribuição/varejo · Serviços de campo (técnicos, manutenção) · Construção/agro/mineração · Saúde/educação/público · Locadora · Outro | Vocabulário e dores mudam por segmento |
| Tamanho da frota | 1–5 · 6–20 · 21–50 · 51–150 · 151–500 · 500+ | ICP, rota curta vs completa, prioridade comercial |
| **Composição da frota (múltipla escolha)** | Carros/leves · Utilitários/vans · VUC/caminhões leves · Caminhões médios e pesados · Carretas/cavalos · Motos · Ônibus/micro-ônibus · Máquinas e equipamentos (horímetro) | A lacuna apontada pelo cliente. Abre rotas específicas (pneus, tacógrafo, horímetro, entregas por moto) |
| Propriedade dos veículos | Toda própria · Maioria própria · Maioria locada/leasing · Agregados/terceiros · Mista | Locada pula manutenção profunda e pergunta sobre contrato/SLA |
| Quantos motoristas e vínculo | Faixas de quantidade + CLT · Agregados/autônomos · Misto | Jornada, multas (indicação de condutor), rotatividade |
| Abrangência da operação | Urbana · Regional · Nacional | Pedágio, diárias, abastecimento em rede |
| Cargo do respondente | Dono/diretor · Gestor de frota · Financeiro/administrativo · Operações/logística · Outro | Quem decide e como falar com ele |
| Número de bases/filiais | 1 · 2–5 · 6+ | Centro de custo, consolidação de dados |

**M1 · Gestão e governança (4 a 5 perguntas)**

- Estrutura de gestão (manter a da Cobli, é boa).
- Como a frota é controlada hoje: papel/nada · planilhas · ERP genérico · sistema específico de frota · telemetria/rastreador · mais de um desses. **Pergunta-chave para a rota de "troca" vs "primeiro sistema".**
- Quais indicadores são acompanhados (múltipla): custo por km · custo por veículo · consumo médio · disponibilidade · multas por motorista · nenhum.
- Política de frota: não existe · existe informal · existe por escrito · existe e é fiscalizada.
- Frequência de fechamento dos custos da frota: mensal · trimestral · só quando alguém pede · não fechamos.

**M2 · Combustível e abastecimento (4 a 6 perguntas)**

- Nível de controle (manter a gradação da Cobli).
- Como abastece: cartão combustível · posto conveniado · abastecimento interno · reembolso de nota · misto.
- Sabe o consumo médio (km/l) por veículo? Sim por veículo · sim só a média geral · não.
- Já identificou desvio ou abastecimento suspeito? Sim, com frequência · raramente · nunca olhei · não teria como saber.
- Custo do último mês (manter).
- Motor ocioso (manter, mas só para rota com rastreamento ou pesados).

**M3 · Manutenção, pneus e disponibilidade (4 a 7 perguntas)**

- Responsável pela manutenção (manter; "Não" pula para pergunta de SLA com locadora).
- Corretiva vs preventiva (manter) → se corretiva, motivo (manter).
- Se preventiva: como controla os planos? Memória · planilha · alerta do sistema · oficina avisa.
- Oficina: própria · terceirizada fixa · onde der.
- Controle de pneus (rota pesados/ônibus): por vida/recapagem · só troca · nenhum.
- Checklist de saída/inspeção diária: sim digital · sim papel · não.
- Sabe quantos dias por mês os veículos ficam parados? Sim · estimo · não.

**M4 · Multas, sinistros, documentação e seguro (3 a 6 perguntas)**

- Conhecimento de multas/sinistros (manter).
- Indicação de condutor dentro do prazo: sempre · às vezes perdemos o prazo · a empresa absorve · não sei.
- Controle de vencimentos (CNH, licenciamento, ANTT, tacógrafo): sistema com alerta · planilha · ninguém controla · não sei.
- Sinistros no último ano: nenhum · 1–3 · 4–10 · 10+ · não sei.
- Seguro da frota: toda segurada · parcial · autogestão · não sei.

**M5 · Motoristas e segurança (2 a 4 perguntas, condicionais)**

- Feedback ao motorista (manter).
- Acompanha comportamento (velocidade, frenagem)? Sim por telemetria · só por reclamação · não.
- Uso particular (manter).
- Controle de jornada (rota pesados/CLT): sim · parcial · não.

**M6 · Dores e momento de compra (4 a 6 perguntas, só para o comercial)**

- Maior gasto da frota (manter, mas com categorias limpas: Combustível · Manutenção · Pneus · Multas · Sinistros/seguro · Pedágio/diárias · Depreciação/locação · Não sei).
- Maior dor hoje: não sei quanto gasto · gasto demais sem saber onde · perco prazo/documentos · muita manutenção corretiva · falta controle dos motoristas · sistema atual não atende.
- O que motivou olhar isso agora: pressão de custo · crescimento da frota · auditoria/fiscalização · troca de sistema · curiosidade.
- Quando pretende resolver: já estou avaliando · próximos 3 meses · 6 a 12 meses · sem prazo.
- Quem decide a contratação: eu · eu com diretoria · outro departamento.
- Se já usa sistema: qual e o que não atende (campo livre curto).

### 3.3 Rotas condicionais (regras de ramificação)

| Gatilho | Efeito |
|---|---|
| Frota 1–5 veículos | Versão curta (M0 + 1 pergunta por pilar + M6). Rota de autoatendimento/inbound leve. |
| Composição inclui caminhões pesados, carretas ou ônibus | Ativa pneus, tacógrafo/ANTT, jornada, pedágio. Vocabulário de "km rodado" e "disponibilidade". |
| Composição inclui máquinas/equipamentos | Substitui km por horímetro nas perguntas de manutenção e combustível. |
| Composição inclui motos | Ativa sinistralidade, EPI, entregas por motorista; desativa motor ocioso. |
| Propriedade majoritariamente locada | Pula M3 profundo; pergunta sobre gestão de contrato, SLA de reposição e cobranças extras da locadora. |
| "Ninguém responsável pela frota" | Pula perguntas de indicadores e fechamento; rota "fundamentos" com tom educativo. |
| Controle atual = "sistema específico" ou "telemetria" | Rota de **troca**: qual sistema, há quanto tempo, o que não atende, integra com financeiro? |
| Controle atual = papel/planilha | Rota de **primeiro sistema**: ênfase em tempo gasto consolidando dados e erro humano. |
| Manutenção responsável = Não | Pula M3; vai para pergunta de SLA/locadora. |
| Manutenção = Corretiva | Pergunta de motivo. |
| Manutenção = Preventiva | Pergunta de como controla os planos. |
| Combustível = "Nenhum controle" | Pula custo exato e km/l; pergunta percepção ("acha que gasta mais do que deveria?"). |
| Multas = "outro departamento" | Pergunta sobre fluxo entre departamentos e se a frota é cobrada pelo custo. |
| Uso particular = Sim | Pergunta se há regra escrita e controle de horário/quilometragem. |
| Cargo = Financeiro | Reforça M1 (fechamento, centro de custo, conciliação) e reduz M5. |
| Cargo = Operações | Reforça M3 e M5, reduz M1. |
| Prazo = "já estou avaliando" ou "3 meses" | Marca lead quente; resultado oferece contato direto em vez de só material. |

Com as rotas, o lead responde entre **18 e 26 perguntas** de um banco de ~40, mantendo os 8 a 10 minutos da Cobli e ganhando relevância.

### 3.4 Modelo de pontuação (proposta inicial)

- Cada opção de pergunta de maturidade recebe 0 a 3 pontos (0 = não sabe/não faz; 3 = controlado e usado para decisão).
- Score por pilar (Governança, Combustível, Manutenção, Compliance, Motoristas) normalizado para 0 a 100, mais score global ponderado. Pesos sugeridos: Governança 25%, Combustível 25%, Manutenção 20%, Compliance 20%, Motoristas 10%. Ajustar com a Nextfleet conforme os módulos do produto.
- Quatro níveis: **Reativa** (0–25) · **Organizada** (26–50) · **Controlada** (51–75) · **Estratégica** (76–100). Nomes a validar com o cliente.
- Perguntas puladas por rota não entram no denominador do pilar.
- Para o comercial, além do score: **lead score** combinando tamanho da frota, composição, prazo, cargo e dor declarada.

### 3.5 Saídas

**Para o lead:** página de resultado com nível global, radar/barras por pilar, dois ou três achados em linguagem de dor ("Você não sabe quanto gasta com combustível por veículo, e combustível é seu maior custo") e um próximo passo por pilar. Captura de contato antes do resultado (gate) ou progressiva, a decidir.

**Para o comercial (ficha do lead):** perfil da frota, rota percorrida, score por pilar, respostas de M6 em destaque, sinais de urgência e sugestão de abordagem. Idealmente entra no CRM com os campos já estruturados.

---

## 4. Pontos a decidir com a Nextfleet antes de construir

1. **Módulos do produto.** Confirmar o que a plataforma cobre (abastecimento, manutenção, multas, documentação, telemetria própria ou integrada) para que cada pilar do diagnóstico termine em algo que o produto resolve.
2. **ICP.** Faixa de frota e segmentos prioritários definem a rota curta e o corte do lead score.
3. **Momento da captura de contato.** Início (menor conversão, lead mais quente), antes do resultado (padrão) ou progressivo.
4. **Canal.** WhatsApp como a Cobli, landing page, ou ambos. Define formato (uma pergunta por tela, mobile-first).
5. **Integração com CRM** e quem recebe o lead (SDR, closer, automação).
6. **Nomes dos níveis e tom** do resultado (consultivo vs provocativo).
7. **Perguntas não vistas da Cobli** (E1 Q1-2-4-5, E2 Q2, E3 Q1 e Q3, E4 Q3 e Q7). Se o cliente tiver o fluxo completo, vale fechar o mapeamento antes do desenho final.

---

## 5. Referências consultadas

- Descrição do app NEXTfleet (Plantech Tecnologia): foco em visibilidade unificada dos gastos com veículos e integração de dados dos participantes da operação. https://apps.apple.com/ca/app/nextfleet/id1474391804
- Não foi encontrada página pública do diagnóstico da Cobli; o mapeamento acima vem exclusivamente das telas enviadas.
