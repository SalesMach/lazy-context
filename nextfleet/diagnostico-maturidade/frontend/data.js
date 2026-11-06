/* =====================================================================
   NEXTfleet · Diagnóstico de Maturidade da Gestão de Frota
   Banco de perguntas, regras de rota (ramificação), pontuação e textos.
   Protótipo para validação de fluxo. Sem backend.
   ===================================================================== */

// Helpers de rota — leem o objeto de respostas `a`
const R = {
  has: (a, id, v) => Array.isArray(a[id]) ? a[id].includes(v) : a[id] === v,
  anyOf: (a, id, vs) => vs.some(v => R.has(a, id, v)),
  heavy:   a => R.anyOf(a, 'composicao', ['pesados', 'carretas', 'onibus']),
  machines:a => R.has(a, 'composicao', 'maquinas'),
  motos:   a => R.has(a, 'composicao', 'motos'),
  rented:  a => R.anyOf(a, 'propriedade', ['locada']),
  small:   a => a.tamanho === '1_5',
  noOne:   a => a.estrutura === 'ninguem',
  usesSystem: a => R.anyOf(a, 'controle_atual', ['sistema', 'telemetria']),
  usesTelemetry: a => a.controle_atual === 'telemetria',
  manual:  a => R.anyOf(a, 'controle_atual', ['papel', 'planilha']),
  clt:     a => R.anyOf(a, 'vinculo', ['clt', 'misto']),
  fin:     a => a.cargo === 'financeiro',
  ops:     a => a.cargo === 'operacoes',
};

// Etapas (telas de abertura). O tempo é recalculado com base nas perguntas visíveis.
const STEPS = [
  { id: 'perfil',       num: '01', title: 'Perfil da frota',
    desc: 'Queremos conhecer a sua operação para que as próximas perguntas façam sentido para o seu tipo de frota.',
    icon: 'truck' },
  { id: 'gestao',       num: '02', title: 'Gestão e controle',
    desc: 'Como a frota é administrada hoje: quem cuida, com que ferramenta e quais números são acompanhados.',
    icon: 'dashboard' },
  { id: 'combustivel',  num: '03', title: 'Combustível',
    desc: 'Normalmente o maior gasto da frota. Queremos entender o nível de controle sobre consumo e abastecimento.',
    icon: 'fuel' },
  { id: 'manutencao',   num: '04', title: 'Manutenção',
    desc: 'Preventiva ou corretiva, pneus, checklist e disponibilidade dos veículos.',
    icon: 'wrench' },
  { id: 'compliance',   num: '05', title: 'Multas, sinistros e documentação',
    desc: 'Infrações, indicação de condutor, vencimentos e seguro: onde o custo escondido costuma aparecer.',
    icon: 'shield' },
  { id: 'motoristas',   num: '06', title: 'Condutores',
    desc: 'Uso dos veículos, comportamento ao volante e cultura de feedback.',
    icon: 'driver' },
  { id: 'momento',      num: '07', title: 'Prioridades',
    desc: 'Para fechar, o que mais pesa hoje e o que você gostaria de resolver primeiro.',
    icon: 'target' },
];

// Pilares pontuados e pesos (perfil e prioridades não pontuam)
const PILLARS = [
  { id: 'gestao',      name: 'Gestão e controle',  weight: 0.25 },
  { id: 'combustivel', name: 'Combustível',         weight: 0.25 },
  { id: 'manutencao',  name: 'Manutenção',          weight: 0.20 },
  { id: 'compliance',  name: 'Multas e documentos', weight: 0.20 },
  { id: 'motoristas',  name: 'Condutores',          weight: 0.10 },
];

const LEVELS = [
  { min: 0,  name: 'Reativa',     text: 'A frota é administrada no dia a dia, resolvendo problemas conforme aparecem. Os custos existem, mas não são medidos, então não dá para saber onde está o desperdício.' },
  { min: 26, name: 'Organizada',  text: 'Já existem controles básicos, geralmente em planilhas ou sistemas separados. A informação está espalhada e consolidar dados toma tempo da equipe.' },
  { min: 51, name: 'Controlada',  text: 'A operação tem controle sobre os principais custos e processos, mas ainda há lacunas entre áreas e oportunidades claras de redução de gastos.' },
  { min: 76, name: 'Estratégica', text: 'A frota é gerida com dados integrados e indicadores. O próximo passo é automatizar o que ainda é manual e usar os dados para decisões de longo prazo.' },
];

// Faixas por pilar
const BANDS = [
  { min: 0,  cls: 'bad',  name: 'Frágil' },
  { min: 34, cls: 'warn', name: 'Em evolução' },
  { min: 67, cls: 'ok',   name: 'Consolidado' },
];

/* ---------------------------------------------------------------------
   PERGUNTAS
   type: single | multi | text
   pillar: pilar pontuado (ausente = não pontua)
   options: { v, label, pts }  pts de 0 a 3
   showIf: função(a) => boolean (ausente = sempre)
   short: true  => escondida na rota curta (frota de 1 a 5 veículos)
   route: nome da rota que a pergunta representa (para a ficha do lead)
   --------------------------------------------------------------------- */
const QUESTIONS = [
  // ---------- 01 PERFIL (qualificação, sem pontuação) ----------
  { id: 'segmento', step: 'perfil', text: 'Qual é o segmento da sua empresa?', type: 'single',
    options: [
      { v: 'transporte',   label: 'Transporte e logística' },
      { v: 'distribuicao', label: 'Distribuição e varejo' },
      { v: 'servicos',     label: 'Serviços de campo (técnicos, instalação, manutenção)' },
      { v: 'construcao',   label: 'Construção, agro ou mineração' },
      { v: 'infra',        label: 'Telecom, energia ou saneamento' },
      { v: 'saude',        label: 'Saúde e farmacêutico' },
      { v: 'locadora',     label: 'Locadora de veículos' },
      { v: 'outro',        label: 'Outro' },
    ] },
  { id: 'tamanho', step: 'perfil', text: 'Quantos veículos compõem a sua frota?', type: 'single',
    options: [
      { v: '1_5',    label: 'De 1 a 5' },
      { v: '6_20',   label: 'De 6 a 20' },
      { v: '21_50',  label: 'De 21 a 50' },
      { v: '51_150', label: 'De 51 a 150' },
      { v: '151_500',label: 'De 151 a 500' },
      { v: '500',    label: 'Mais de 500' },
    ] },
  { id: 'composicao', step: 'perfil', text: 'Por quais tipos de veículos a frota é composta?', hint: 'Selecione todos que se aplicam', type: 'multi',
    options: [
      { v: 'leves',    label: 'Carros e veículos leves' },
      { v: 'vans',     label: 'Utilitários e vans' },
      { v: 'vuc',      label: 'VUC e caminhões leves' },
      { v: 'pesados',  label: 'Caminhões médios e pesados' },
      { v: 'carretas', label: 'Carretas e cavalos mecânicos' },
      { v: 'motos',    label: 'Motos' },
      { v: 'onibus',   label: 'Ônibus e micro-ônibus' },
      { v: 'maquinas', label: 'Máquinas e equipamentos' },
    ] },
  { id: 'propriedade', step: 'perfil', text: 'Os veículos são próprios ou de terceiros?', type: 'single',
    options: [
      { v: 'propria',   label: 'Toda a frota é própria' },
      { v: 'maioria',   label: 'A maior parte é própria' },
      { v: 'locada',    label: 'A maior parte é locada ou em leasing' },
      { v: 'agregados', label: 'Trabalhamos com agregados ou terceiros' },
      { v: 'mista',     label: 'Mista, sem predominância' },
    ] },
  { id: 'vinculo', step: 'perfil', text: 'Qual é o vínculo dos condutores com a empresa?', type: 'single', short: true,
    options: [
      { v: 'clt',       label: 'Funcionários (CLT)' },
      { v: 'agregados', label: 'Agregados ou autônomos' },
      { v: 'misto',     label: 'Misto' },
    ] },
  { id: 'abrangencia', step: 'perfil', text: 'Qual é a abrangência da operação?', type: 'single', short: true,
    options: [
      { v: 'urbana',   label: 'Urbana, dentro de uma cidade ou região metropolitana' },
      { v: 'regional', label: 'Regional, dentro de um ou poucos estados' },
      { v: 'nacional', label: 'Nacional' },
    ] },
  { id: 'cargo', step: 'perfil', text: 'Qual é o seu papel na empresa?', type: 'single',
    options: [
      { v: 'dono',       label: 'Dono, sócio ou diretor' },
      { v: 'gestor',     label: 'Gestor de frota' },
      { v: 'financeiro', label: 'Financeiro ou administrativo' },
      { v: 'operacoes',  label: 'Operações ou logística' },
      { v: 'outro',      label: 'Outro' },
    ] },

  // ---------- 02 GESTÃO E CONTROLE ----------
  { id: 'estrutura', step: 'gestao', pillar: 'gestao', text: 'Qual é a estrutura atual de gestão da sua frota?', type: 'single',
    options: [
      { v: 'unico',     label: 'Temos um único gestor responsável pela frota', pts: 2 },
      { v: 'setor',     label: 'Temos um setor específico para gestão de frotas', pts: 3 },
      { v: 'varios',    label: 'Mais de um setor é responsável pela frota', pts: 1 },
      { v: 'integrada', label: 'A gestão está dentro de outro setor (administrativo, financeiro etc.)', pts: 1 },
      { v: 'ninguem',   label: 'Hoje não temos ninguém responsável pela frota', pts: 0 },
    ] },
  { id: 'controle_atual', step: 'gestao', pillar: 'gestao', text: 'Como a frota é controlada hoje?', type: 'single',
    options: [
      { v: 'papel',      label: 'No papel ou praticamente sem controle', pts: 0 },
      { v: 'planilha',   label: 'Em planilhas', pts: 1 },
      { v: 'erp',        label: 'No ERP da empresa, sem módulo de frota', pts: 2 },
      { v: 'sistema',    label: 'Em um sistema específico de gestão de frota', pts: 3 },
      { v: 'telemetria', label: 'Só pelo rastreador ou telemetria', pts: 2 },
    ] },
  { id: 'sistema_falta', step: 'gestao', route: 'Troca de sistema', text: 'O que mais falta no sistema que você usa hoje?', type: 'single',
    showIf: a => R.usesSystem(a),
    options: [
      { v: 'financeiro',  label: 'Integração com o financeiro e centro de custo' },
      { v: 'fornecedores',label: 'Abastecimento, oficinas e multas no mesmo lugar' },
      { v: 'relatorios',  label: 'Relatórios e indicadores confiáveis' },
      { v: 'custo',       label: 'Custa caro para o que entrega' },
      { v: 'nada',        label: 'Nada, estou satisfeito' },
    ] },
  { id: 'tempo_consolidando', step: 'gestao', route: 'Primeiro sistema', text: 'Quanto tempo por mês a equipe gasta consolidando dados da frota?', type: 'single',
    showIf: a => R.manual(a),
    options: [
      { v: 'menos1', label: 'Menos de um dia' },
      { v: '1a3',    label: 'De um a três dias' },
      { v: 'mais3',  label: 'Mais de três dias' },
      { v: 'nao',    label: 'Não consolidamos' },
    ] },
  { id: 'indicadores', step: 'gestao', pillar: 'gestao', text: 'Quais indicadores da frota você acompanha hoje?', hint: 'Selecione todos que se aplicam', type: 'multi', short: true,
    showIf: a => !R.noOne(a),
    options: [
      { v: 'custo_km',      label: 'Custo por quilômetro' },
      { v: 'custo_veiculo', label: 'Custo por veículo' },
      { v: 'consumo',       label: 'Consumo médio de combustível' },
      { v: 'disponibilidade',label: 'Disponibilidade da frota' },
      { v: 'multas_cond',   label: 'Multas por condutor' },
      { v: 'nenhum',        label: 'Nenhum', exclusive: true },
    ],
    // pontuação por quantidade de indicadores
    score: vals => { const n = vals.filter(v => v !== 'nenhum').length; return n === 0 ? 0 : n <= 2 ? 1 : n === 3 ? 2 : 3; } },
  { id: 'politica', step: 'gestao', pillar: 'gestao', text: 'A frota tem uma política de uso (regras para condutores e veículos)?', type: 'single',
    learn: 'Política de frota é o conjunto de regras sobre uso, abastecimento, manutenção e responsabilidades por multas e danos.',
    options: [
      { v: 'nao',         label: 'Não existe', pts: 0 },
      { v: 'informal',    label: 'Existe, mas é informal', pts: 1 },
      { v: 'escrita',     label: 'Existe por escrito', pts: 2 },
      { v: 'fiscalizada', label: 'Existe por escrito e é fiscalizada', pts: 3 },
    ] },
  { id: 'fechamento', step: 'gestao', pillar: 'gestao', text: 'Com que frequência os custos da frota são fechados?', type: 'single', short: true,
    showIf: a => !R.noOne(a) && !R.ops(a),
    options: [
      { v: 'mensal',     label: 'Todo mês', pts: 3 },
      { v: 'trimestral', label: 'A cada trimestre', pts: 2 },
      { v: 'pedem',      label: 'Só quando alguém pede', pts: 1 },
      { v: 'nao',        label: 'Não fechamos', pts: 0 },
    ] },

  // ---------- 03 COMBUSTÍVEL ----------
  { id: 'comb_controle', step: 'combustivel', pillar: 'combustivel', text: 'A sua empresa realiza algum controle sobre o consumo de combustível?', type: 'single',
    options: [
      { v: 'completo', label: 'Sim, controlamos consumo e gastos', pts: 3 },
      { v: 'basico',   label: 'Temos um controle básico do consumo', pts: 1 },
      { v: 'nenhum',   label: 'Não temos nenhum controle', pts: 0 },
    ] },
  { id: 'comb_forma', step: 'combustivel', text: 'Como os veículos são abastecidos?', type: 'single',
    options: [
      { v: 'cartao',    label: 'Cartão combustível' },
      { v: 'conveniado',label: 'Posto conveniado' },
      { v: 'interno',   label: 'Abastecimento interno (tanque próprio)' },
      { v: 'reembolso', label: 'Reembolso de notas' },
      { v: 'misto',     label: 'Misto' },
    ] },
  { id: 'comb_kml', step: 'combustivel', pillar: 'combustivel', text: 'Você sabe o consumo médio (km/l) de cada veículo?', type: 'single', short: true,
    showIf: a => a.comb_controle !== 'nenhum',
    options: [
      { v: 'veiculo', label: 'Sim, por veículo', pts: 3 },
      { v: 'geral',   label: 'Só a média geral da frota', pts: 1 },
      { v: 'nao',     label: 'Não', pts: 0 },
    ] },
  { id: 'comb_desvio', step: 'combustivel', pillar: 'combustivel', text: 'Já identificou abastecimento suspeito ou desvio de combustível?', type: 'single', short: true,
    showIf: a => a.comb_controle !== 'nenhum',
    options: [
      { v: 'frequente', label: 'Sim, com frequência', pts: 2 },
      { v: 'raro',      label: 'Raramente, e conseguimos identificar', pts: 3 },
      { v: 'nunca',     label: 'Nunca olhei para isso', pts: 1 },
      { v: 'impossivel',label: 'Não teria como saber', pts: 0 },
    ] },
  { id: 'comb_custo', step: 'combustivel', pillar: 'combustivel', text: 'Você sabe qual foi o seu custo com combustível no último mês?', type: 'single',
    showIf: a => a.comb_controle !== 'nenhum',
    options: [
      { v: 'exato',  label: 'Sim, sei exatamente', pts: 3 },
      { v: 'outro',  label: 'Não sei, é responsabilidade de outro departamento', pts: 1 },
      { v: 'nao',    label: 'Não tenho acesso a esses dados', pts: 0 },
    ] },
  { id: 'comb_percepcao', step: 'combustivel', pillar: 'combustivel', route: 'Sem controle de combustível', text: 'Você acha que a frota gasta mais combustível do que deveria?', type: 'single',
    showIf: a => a.comb_controle === 'nenhum',
    options: [
      { v: 'certeza',  label: 'Com certeza', pts: 0 },
      { v: 'provavel', label: 'Provavelmente', pts: 0 },
      { v: 'nao',      label: 'Acho que não', pts: 1 },
      { v: 'naosei',   label: 'Não tenho como saber', pts: 0 },
    ] },
  { id: 'comb_ocioso', step: 'combustivel', pillar: 'combustivel', route: 'Frota pesada / telemetria', text: 'Os condutores costumam deixar o motor ligado enquanto o veículo está parado?', type: 'single', short: true,
    showIf: a => (R.heavy(a) || R.usesTelemetry(a)) && !R.motos(a),
    options: [
      { v: 'sim',      label: 'Sim, é um hábito comum', pts: 0 },
      { v: 'naosei',   label: 'Sim, mas não sei por quê', pts: 1 },
      { v: 'isolado',  label: 'Às vezes, em ocasiões isoladas', pts: 3 },
      { v: 'nunca_vi', label: 'Nunca reparei nesse comportamento', pts: 1 },
    ] },

  // ---------- 04 MANUTENÇÃO ----------
  { id: 'man_locadora', step: 'manutencao', pillar: 'manutencao', route: 'Frota locada', text: 'Como é a gestão do contrato com a locadora?', type: 'single',
    showIf: a => R.rented(a),
    options: [
      { v: 'sla',    label: 'Acompanho SLA de reposição e cobranças extras', pts: 3 },
      { v: 'fatura', label: 'Só confiro e pago a fatura', pts: 1 },
      { v: 'nao',    label: 'Não acompanho', pts: 0 },
    ] },
  { id: 'man_resp', step: 'manutencao', text: 'A sua empresa é a responsável pela manutenção dos veículos?', type: 'single',
    showIf: a => !R.rented(a),
    options: [
      { v: 'sim', label: 'Sim' },
      { v: 'nao', label: 'Não' },
    ] },
  { id: 'man_tipo', step: 'manutencao', pillar: 'manutencao', text: 'A sua empresa faz mais manutenções corretivas ou preventivas?', type: 'single',
    showIf: a => a.man_resp === 'sim',
    options: [
      { v: 'preventiva', label: 'Preventiva', pts: 3 },
      { v: 'corretiva',  label: 'Corretiva', pts: 1 },
      { v: 'naosei',     label: 'Não sei', pts: 0 },
    ] },
  { id: 'man_motivo', step: 'manutencao', route: 'Manutenção corretiva', text: 'Por qual motivo você tem feito mais manutenções corretivas?', type: 'single',
    showIf: a => a.man_tipo === 'corretiva',
    options: [
      { v: 'esqueci',    label: 'Passou da data ou da quilometragem sem perceber' },
      { v: 'orcamento',  label: 'Não tinha orçamento' },
      { v: 'naosei',     label: 'Não sei quando preciso fazer as preventivas' },
      { v: 'fornecedor', label: 'Dependemos da oficina avisar' },
    ] },
  { id: 'man_planos', step: 'manutencao', pillar: 'manutencao', route: 'Manutenção preventiva', text: 'Como você controla os planos de manutenção preventiva?', type: 'single', short: true,
    showIf: a => a.man_tipo === 'preventiva',
    options: [
      { v: 'memoria',  label: 'De memória', pts: 1 },
      { v: 'planilha', label: 'Em planilha', pts: 2 },
      { v: 'sistema',  label: 'Com alertas automáticos do sistema', pts: 3 },
      { v: 'oficina',  label: 'A oficina avisa', pts: 1 },
    ] },
  { id: 'man_oficina', step: 'manutencao', pillar: 'manutencao', text: 'Onde a manutenção é feita?', type: 'single', short: true,
    showIf: a => a.man_resp === 'sim',
    options: [
      { v: 'propria',     label: 'Oficina própria', pts: 2 },
      { v: 'terceirizada',label: 'Oficinas terceirizadas fixas, com orçamento aprovado', pts: 3 },
      { v: 'ondeder',     label: 'Onde der, conforme a necessidade', pts: 0 },
    ] },
  { id: 'man_pneus', step: 'manutencao', pillar: 'manutencao', route: 'Frota pesada', text: 'Como é o controle de pneus?', type: 'single', short: true,
    showIf: a => R.heavy(a) && a.man_resp === 'sim',
    options: [
      { v: 'vida',   label: 'Por vida do pneu, com recapagem e rodízio controlados', pts: 3 },
      { v: 'troca',  label: 'Só registramos a troca', pts: 1 },
      { v: 'nenhum', label: 'Nenhum controle', pts: 0 },
    ] },
  { id: 'man_horimetro', step: 'manutencao', pillar: 'manutencao', route: 'Máquinas e equipamentos', text: 'As horas de uso das máquinas são controladas?', type: 'single',
    showIf: a => R.machines(a),
    options: [
      { v: 'horimetro', label: 'Sim, por horímetro', pts: 3 },
      { v: 'estimado',  label: 'Por estimativa', pts: 1 },
      { v: 'nao',       label: 'Não', pts: 0 },
    ] },
  { id: 'man_checklist', step: 'manutencao', pillar: 'manutencao', text: 'Os condutores fazem checklist do veículo antes de sair?', type: 'single',
    options: [
      { v: 'digital', label: 'Sim, pelo celular ou sistema', pts: 3 },
      { v: 'papel',   label: 'Sim, em papel', pts: 2 },
      { v: 'nao',     label: 'Não', pts: 0 },
    ] },
  { id: 'man_parado', step: 'manutencao', pillar: 'manutencao', text: 'Você sabe quantos dias por mês os veículos ficam parados em manutenção?', type: 'single', short: true,
    showIf: a => a.man_resp === 'sim' || R.rented(a),
    options: [
      { v: 'sim',    label: 'Sim, acompanho por veículo', pts: 3 },
      { v: 'estimo', label: 'Tenho uma estimativa', pts: 1 },
      { v: 'nao',    label: 'Não', pts: 0 },
    ] },

  // ---------- 05 MULTAS, SINISTROS E DOCUMENTAÇÃO ----------
  { id: 'multas_conhec', step: 'compliance', pillar: 'compliance', text: 'Você sabe quantas multas a frota levou e quantos sinistros sofreu no último ano?', type: 'single',
    options: [
      { v: 'exato',   label: 'Sim, sei exatamente', pts: 3 },
      { v: 'parcial', label: 'Tenho um controle parcial', pts: 2 },
      { v: 'outro',   label: 'Não controlo, é responsabilidade de outro departamento', pts: 1 },
      { v: 'nao',     label: 'Não tenho esses dados', pts: 0 },
    ] },
  { id: 'multas_depto', step: 'compliance', route: 'Multas em outro departamento', text: 'O custo das multas é cobrado da operação ou do condutor?', type: 'single',
    showIf: a => a.multas_conhec === 'outro',
    options: [
      { v: 'condutor', label: 'É repassado ao condutor' },
      { v: 'rateio',   label: 'É rateado por centro de custo' },
      { v: 'empresa',  label: 'A empresa absorve' },
      { v: 'naosei',   label: 'Não sei' },
    ] },
  { id: 'multas_indicacao', step: 'compliance', pillar: 'compliance', text: 'A indicação do condutor infrator é feita dentro do prazo?', type: 'single', short: true,
    options: [
      { v: 'sempre',  label: 'Sempre', pts: 3 },
      { v: 'asvezes', label: 'Às vezes perdemos o prazo', pts: 1 },
      { v: 'absorve', label: 'A empresa absorve a multa e os pontos', pts: 0 },
      { v: 'naosei',  label: 'Não sei', pts: 0 },
    ] },
  { id: 'docs_venc', step: 'compliance', pillar: 'compliance', text: 'Como são controlados os vencimentos de CNH, licenciamento e demais documentos?', type: 'single',
    options: [
      { v: 'sistema',  label: 'Em sistema, com alertas', pts: 3 },
      { v: 'planilha', label: 'Em planilha', pts: 2 },
      { v: 'ninguem',  label: 'Ninguém controla', pts: 0 },
      { v: 'naosei',   label: 'Não sei', pts: 0 },
    ] },
  { id: 'jornada', step: 'compliance', pillar: 'compliance', route: 'Frota pesada', text: 'A jornada dos motoristas é controlada (lei do motorista, tacógrafo)?', type: 'single', short: true,
    showIf: a => R.heavy(a) && R.clt(a),
    options: [
      { v: 'sim',     label: 'Sim, com registro e relatórios', pts: 3 },
      { v: 'parcial', label: 'Parcialmente', pts: 1 },
      { v: 'nao',     label: 'Não', pts: 0 },
    ] },
  { id: 'sinistros', step: 'compliance', pillar: 'compliance', text: 'Quantos sinistros a frota teve no último ano?', type: 'single', short: true,
    options: [
      { v: 'zero',   label: 'Nenhum', pts: 3 },
      { v: '1a3',    label: 'De 1 a 3', pts: 2 },
      { v: '4a10',   label: 'De 4 a 10', pts: 1 },
      { v: 'mais10', label: 'Mais de 10', pts: 0 },
      { v: 'naosei', label: 'Não sei', pts: 0 },
    ] },
  { id: 'seguro', step: 'compliance', pillar: 'compliance', text: 'Como é o seguro da frota?', type: 'single', short: true,
    options: [
      { v: 'toda',       label: 'Toda a frota é segurada', pts: 3 },
      { v: 'parcial',    label: 'Parte da frota', pts: 2 },
      { v: 'autogestao', label: 'Autogestão (fundo próprio)', pts: 2 },
      { v: 'naosei',     label: 'Não sei', pts: 0 },
    ] },

  // ---------- 06 CONDUTORES ----------
  { id: 'cond_feedback', step: 'motoristas', pillar: 'motoristas', text: 'Vocês costumam dar feedback imediato sobre erros cometidos pelos condutores?', type: 'single',
    showIf: a => !R.fin(a),
    options: [
      { v: 'sempre',   label: 'Sim, sempre', pts: 3 },
      { v: 'asvezes',  label: 'Às vezes, depende da situação', pts: 2 },
      { v: 'depois',   label: 'Preferimos dar o feedback depois', pts: 1 },
      { v: 'nao',      label: 'Não temos cultura de feedback', pts: 0 },
    ] },
  { id: 'cond_comportamento', step: 'motoristas', pillar: 'motoristas', text: 'Como você acompanha o comportamento dos condutores ao volante?', type: 'single', short: true,
    showIf: a => !R.fin(a),
    options: [
      { v: 'telemetria', label: 'Por telemetria (velocidade, frenagem, aceleração)', pts: 3 },
      { v: 'reclamacao', label: 'Só quando chega reclamação ou multa', pts: 1 },
      { v: 'nao',        label: 'Não acompanho', pts: 0 },
    ] },
  { id: 'uso_particular', step: 'motoristas', pillar: 'motoristas', text: 'Os condutores podem usar o veículo fora do horário de trabalho?', type: 'single',
    options: [
      { v: 'nao',      label: 'Não, os veículos ficam na empresa', pts: 3 },
      { v: 'asvezes',  label: 'Às vezes, quando precisam', pts: 1 },
      { v: 'casa',     label: 'Sim, levam o veículo para casa', pts: 1 },
    ] },
  { id: 'uso_regra', step: 'motoristas', pillar: 'motoristas', route: 'Uso particular', text: 'Existe regra e controle para esse uso fora do horário?', type: 'single', short: true,
    showIf: a => a.uso_particular && a.uso_particular !== 'nao',
    options: [
      { v: 'controle', label: 'Regra escrita e controle de horário ou quilometragem', pts: 3 },
      { v: 'regra',    label: 'Regra, mas sem controle', pts: 1 },
      { v: 'nada',     label: 'Nem regra nem controle', pts: 0 },
    ] },
  { id: 'quem_usa', step: 'motoristas', pillar: 'motoristas', text: 'Você sabe qual condutor está com cada veículo, a qualquer momento?', type: 'single',
    options: [
      { v: 'sistema', label: 'Sim, pelo sistema ou app', pts: 3 },
      { v: 'manual',  label: 'Sim, por controle manual', pts: 2 },
      { v: 'nao',     label: 'Não', pts: 0 },
    ] },
  { id: 'motos_epi', step: 'motoristas', pillar: 'motoristas', route: 'Motos', text: 'Há controle de EPI e de sinistros com as motos?', type: 'single',
    showIf: a => R.motos(a),
    options: [
      { v: 'sim',     label: 'Sim, com registro', pts: 3 },
      { v: 'parcial', label: 'Parcialmente', pts: 1 },
      { v: 'nao',     label: 'Não', pts: 0 },
    ] },

  // ---------- 07 PRIORIDADES (comercial, sem pontuação) ----------
  { id: 'maior_gasto', step: 'momento', text: 'Qual é o maior gasto da sua frota hoje?', type: 'single',
    options: [
      { v: 'combustivel', label: 'Combustível' },
      { v: 'manutencao',  label: 'Manutenção' },
      { v: 'pneus',       label: 'Pneus' },
      { v: 'multas',      label: 'Multas' },
      { v: 'sinistros',   label: 'Sinistros e seguro' },
      { v: 'pedagio',     label: 'Pedágio e diárias' },
      { v: 'locacao',     label: 'Locação ou depreciação' },
      { v: 'naosei',      label: 'Não sei' },
    ] },
  { id: 'maior_dor', step: 'momento', text: 'O que mais incomoda na gestão da frota hoje?', type: 'single',
    options: [
      { v: 'naosei_gasto', label: 'Não sei quanto a frota realmente custa' },
      { v: 'gasto_onde',   label: 'Gasto demais e não sei onde' },
      { v: 'prazos',       label: 'Perco prazos de multas e documentos' },
      { v: 'corretiva',    label: 'Muita manutenção corretiva e veículo parado' },
      { v: 'condutores',   label: 'Falta controle sobre os condutores' },
      { v: 'sistema',      label: 'O sistema atual não atende' },
      { v: 'tempo',        label: 'Tempo demais em tarefas manuais' },
      { v: 'nenhuma',      label: 'Nada em especial' },
    ] },
  { id: 'motivo_agora', step: 'momento', text: 'O que fez você olhar para isso agora?', type: 'single', short: true,
    options: [
      { v: 'custo',        label: 'Pressão para reduzir custos' },
      { v: 'crescimento',  label: 'A frota está crescendo' },
      { v: 'auditoria',    label: 'Auditoria, fiscalização ou exigência de cliente' },
      { v: 'troca',        label: 'Quero trocar o sistema atual' },
      { v: 'curiosidade',  label: 'Curiosidade' },
    ] },
  { id: 'prazo', step: 'momento', text: 'Quando você pretende resolver isso?', type: 'single',
    options: [
      { v: 'avaliando', label: 'Já estou avaliando soluções' },
      { v: '3m',        label: 'Nos próximos 3 meses' },
      { v: '6_12m',     label: 'Em 6 a 12 meses' },
      { v: 'semprazo',  label: 'Sem prazo definido' },
    ] },
  { id: 'decisor', step: 'momento', text: 'Quem decide a contratação de uma solução de gestão de frota?', type: 'single', short: true,
    options: [
      { v: 'eu',        label: 'Eu' },
      { v: 'diretoria', label: 'Eu, junto com a diretoria' },
      { v: 'outro',     label: 'Outro departamento' },
    ] },
  { id: 'sistema_nome', step: 'momento', route: 'Troca de sistema', text: 'Qual sistema ou rastreador você usa hoje?', hint: 'Opcional', type: 'text', optional: true,
    showIf: a => R.usesSystem(a) },
];

/* ---------------------------------------------------------------------
   Módulos NEXTfleet usados nas recomendações (nomes reais do site)
   --------------------------------------------------------------------- */
const MODULES = {
  gestao:      [{ name: 'Medição e Gastos', text: 'Centraliza fornecedores e custos por veículo e centro de custo, com dashboard de fácil leitura.' },
                { name: 'Integração via API', text: 'Conecta ERP, cartões e parceiros para acabar com a consolidação manual.' }],
  combustivel: [{ name: 'Abastecimento', text: 'Automação de créditos, bloqueio de cartões e consumo por veículo.' },
                { name: 'Abastecimento Protegido', text: 'Identifica abastecimentos fora do padrão antes de virarem desvio.' }],
  manutencao:  [{ name: 'Manutenção', text: 'Agendamento e aprovação de consertos, revisões e avarias.' },
                { name: 'Guardião Preventivo', text: 'Alertas por quilometragem, tempo ou horímetro para sair do corretivo.' },
                { name: 'Checklist', text: 'Inspeção pelo app do condutor com evidências.' }],
  compliance:  [{ name: 'Multa', text: 'Fluxo de identificação, indicação do condutor e cobrança dentro do prazo.' },
                { name: 'CNH Inteligente', text: 'Documentos e vencimentos dos condutores com alerta.' }],
  motoristas:  [{ name: 'Condutor', text: 'Cadastro, histórico de infrações e vínculo condutor-veículo.' },
                { name: 'Gamer da Frota', text: 'Ranking e feedback por indicadores de condução.' },
                { name: 'Telemetria', text: 'Utilização, localização e rotina de quem usa o veículo.' }],
};

/* ---------------------------------------------------------------------
   Achados personalizados: regras que viram frases a partir das respostas
   prio: maior = aparece primeiro. kind: 'risk' | 'good'
   --------------------------------------------------------------------- */
const FINDINGS = [
  { prio: 100, kind: 'risk', when: a => a.maior_gasto === 'combustivel' && a.comb_controle === 'nenhum',
    text: () => 'Combustível é o seu maior gasto e hoje não existe controle de consumo. É o primeiro lugar onde o dinheiro escapa sem ninguém ver.' },
  { prio: 95, kind: 'risk', when: a => a.comb_desvio === 'impossivel',
    text: () => 'Um desvio de combustível passaria despercebido. Sem consumo por veículo, não há como comparar o abastecido com o rodado.' },
  { prio: 92, kind: 'risk', when: a => a.man_tipo === 'corretiva',
    text: a => ({ esqueci: 'A frota opera no corretivo porque as revisões passam da data sem aviso. Isso custa mais caro e tira veículos da rua.',
                  orcamento: 'A frota opera no corretivo por falta de orçamento, mas o corretivo costuma custar de duas a três vezes a preventiva.',
                  naosei: 'A frota opera no corretivo porque não há um plano de preventivas por veículo.',
                  fornecedor: 'A frota opera no corretivo e depende da oficina avisar. O controle do plano está fora da empresa.' })[a.man_motivo] || 'A frota opera mais no corretivo do que no preventivo.' },
  { prio: 90, kind: 'risk', when: a => a.multas_indicacao === 'absorve',
    text: () => 'A empresa está absorvendo multas e pontos que deveriam ser indicados ao condutor. Além do custo, isso gera risco de suspensão de veículos.' },
  { prio: 88, kind: 'risk', when: a => ['ninguem', 'naosei'].includes(a.docs_venc),
    text: () => 'Ninguém acompanha os vencimentos de CNH e licenciamento. Um condutor com CNH vencida em um sinistro vira problema jurídico e de seguro.' },
  { prio: 85, kind: 'risk', when: a => ['nao', 'pedem'].includes(a.fechamento),
    text: () => 'Os custos da frota não são fechados mensalmente, então não há como saber se a operação está melhorando ou piorando.' },
  { prio: 82, kind: 'risk', when: a => a.tempo_consolidando === 'mais3',
    text: () => 'A equipe gasta mais de três dias por mês consolidando dados em planilha. Esse tempo deveria estar na gestão, não na digitação.' },
  { prio: 80, kind: 'risk', when: a => a.uso_particular !== 'nao' && a.uso_regra === 'nada',
    text: () => 'Os veículos saem fora do horário sem regra nem controle. Combustível, desgaste e multas desse uso entram na conta da empresa.' },
  { prio: 78, kind: 'risk', when: a => a.man_pneus === 'nenhum',
    text: () => 'Em frotas pesadas, pneus são o segundo maior custo, e hoje não há controle de vida ou recapagem.' },
  { prio: 76, kind: 'risk', when: a => a.jornada === 'nao',
    text: () => 'A jornada dos motoristas não é controlada. Além do passivo trabalhista, é um fator de risco em sinistros.' },
  { prio: 74, kind: 'risk', when: a => a.multas_conhec === 'nao',
    text: () => 'Não há dados de multas e sinistros do último ano. Sem histórico, não dá para agir sobre os condutores que mais custam.' },
  { prio: 72, kind: 'risk', when: a => a.man_locadora === 'nao',
    text: () => 'O contrato com a locadora não é acompanhado. Cobranças extras e SLA de reposição costumam esconder custos relevantes.' },
  { prio: 70, kind: 'risk', when: a => a.quem_usa === 'nao',
    text: () => 'Não há vínculo claro entre condutor e veículo. Isso dificulta indicar multas e responsabilizar por danos.' },
  { prio: 68, kind: 'risk', when: a => a.comb_ocioso === 'sim',
    text: () => 'Motor ligado parado é hábito comum na frota. Em veículos pesados, isso pode representar parte relevante do consumo.' },
  { prio: 66, kind: 'risk', when: a => a.man_checklist === 'nao',
    text: () => 'Não há checklist de saída. Avarias e itens de segurança só são descobertos quando já viraram problema.' },
  { prio: 64, kind: 'risk', when: a => a.estrutura === 'ninguem',
    text: () => 'Hoje ninguém é responsável pela frota. Definir um dono do processo é o primeiro passo antes de qualquer ferramenta.' },
  { prio: 60, kind: 'risk', when: a => a.sistema_falta === 'fornecedores',
    text: () => 'O sistema atual não reúne abastecimento, oficinas e multas no mesmo lugar, então a visão de custo continua fragmentada.' },
  { prio: 58, kind: 'risk', when: a => a.sistema_falta === 'financeiro',
    text: () => 'O sistema atual não conversa com o financeiro. O custo da frota não chega ao centro de custo sem retrabalho.' },
  // Pontos fortes
  { prio: 50, kind: 'good', when: a => a.comb_controle === 'completo' && a.comb_kml === 'veiculo',
    text: () => 'Combustível está sob controle, com consumo por veículo. Esse é o pilar mais maduro da operação.' },
  { prio: 48, kind: 'good', when: a => a.man_tipo === 'preventiva' && a.man_planos === 'sistema',
    text: () => 'A manutenção é preventiva e controlada por alertas. Poucas frotas chegam a esse nível.' },
  { prio: 46, kind: 'good', when: a => a.politica === 'fiscalizada',
    text: () => 'A política de frota existe por escrito e é fiscalizada, o que facilita qualquer automação.' },
  { prio: 44, kind: 'good', when: a => a.multas_indicacao === 'sempre' && a.multas_conhec === 'exato',
    text: () => 'Multas são conhecidas e indicadas no prazo. O processo de compliance está bem encaminhado.' },
];

const LABELS = {
  tamanho: { '1_5': '1 a 5 veículos', '6_20': '6 a 20 veículos', '21_50': '21 a 50 veículos', '51_150': '51 a 150 veículos', '151_500': '151 a 500 veículos', '500': 'Mais de 500 veículos' },
};

// Personas para validação rápida (preenchem o questionário inteiro)
const PERSONAS = {
  'PME leve, planilha': {
    segmento: 'servicos', tamanho: '6_20', composicao: ['leves', 'vans'], propriedade: 'propria', vinculo: 'clt', abrangencia: 'urbana', cargo: 'dono',
    estrutura: 'integrada', controle_atual: 'planilha', tempo_consolidando: 'mais3', indicadores: ['nenhum'], politica: 'informal', fechamento: 'pedem',
    comb_controle: 'basico', comb_forma: 'reembolso', comb_kml: 'nao', comb_desvio: 'impossivel', comb_custo: 'outro',
    man_resp: 'sim', man_tipo: 'corretiva', man_motivo: 'esqueci', man_oficina: 'ondeder', man_checklist: 'nao', man_parado: 'nao',
    multas_conhec: 'parcial', multas_indicacao: 'asvezes', docs_venc: 'ninguem', sinistros: '1a3', seguro: 'parcial',
    cond_feedback: 'asvezes', cond_comportamento: 'reclamacao', uso_particular: 'casa', uso_regra: 'nada', quem_usa: 'manual',
    maior_gasto: 'combustivel', maior_dor: 'gasto_onde', motivo_agora: 'custo', prazo: '3m', decisor: 'eu',
  },
  'Transportadora pesada, reativa': {
    segmento: 'transporte', tamanho: '51_150', composicao: ['pesados', 'carretas', 'vuc'], propriedade: 'maioria', vinculo: 'misto', abrangencia: 'nacional', cargo: 'gestor',
    estrutura: 'unico', controle_atual: 'telemetria', sistema_falta: 'fornecedores', indicadores: ['consumo'], politica: 'escrita', fechamento: 'trimestral',
    comb_controle: 'basico', comb_forma: 'cartao', comb_kml: 'geral', comb_desvio: 'nunca', comb_custo: 'exato', comb_ocioso: 'sim',
    man_resp: 'sim', man_tipo: 'corretiva', man_motivo: 'fornecedor', man_oficina: 'propria', man_pneus: 'troca', man_checklist: 'papel', man_parado: 'estimo',
    multas_conhec: 'exato', multas_indicacao: 'asvezes', docs_venc: 'planilha', jornada: 'parcial', sinistros: '4a10', seguro: 'autogestao',
    cond_feedback: 'depois', cond_comportamento: 'telemetria', uso_particular: 'nao', quem_usa: 'sistema',
    maior_gasto: 'combustivel', maior_dor: 'corretiva', motivo_agora: 'custo', prazo: 'avaliando', decisor: 'diretoria', sistema_nome: 'Rastreador + planilhas',
  },
  'Serviços de campo, frota locada': {
    segmento: 'infra', tamanho: '151_500', composicao: ['leves', 'vans', 'vuc'], propriedade: 'locada', vinculo: 'clt', abrangencia: 'regional', cargo: 'financeiro',
    estrutura: 'setor', controle_atual: 'erp', indicadores: ['custo_veiculo', 'multas_cond'], politica: 'escrita', fechamento: 'mensal',
    comb_controle: 'completo', comb_forma: 'cartao', comb_kml: 'geral', comb_desvio: 'raro', comb_custo: 'exato',
    man_locadora: 'fatura', man_checklist: 'digital', man_parado: 'nao',
    multas_conhec: 'outro', multas_depto: 'empresa', multas_indicacao: 'asvezes', docs_venc: 'planilha', sinistros: '4a10', seguro: 'toda',
    uso_particular: 'casa', uso_regra: 'regra', quem_usa: 'manual',
    maior_gasto: 'locacao', maior_dor: 'prazos', motivo_agora: 'auditoria', prazo: '6_12m', decisor: 'diretoria',
  },
  'Frota madura com sistema': {
    segmento: 'distribuicao', tamanho: '21_50', composicao: ['vuc', 'vans'], propriedade: 'propria', vinculo: 'clt', abrangencia: 'regional', cargo: 'gestor',
    estrutura: 'setor', controle_atual: 'sistema', sistema_falta: 'financeiro', indicadores: ['custo_km', 'custo_veiculo', 'consumo', 'disponibilidade'], politica: 'fiscalizada', fechamento: 'mensal',
    comb_controle: 'completo', comb_forma: 'conveniado', comb_kml: 'veiculo', comb_desvio: 'raro', comb_custo: 'exato',
    man_resp: 'sim', man_tipo: 'preventiva', man_planos: 'sistema', man_oficina: 'terceirizada', man_checklist: 'digital', man_parado: 'sim',
    multas_conhec: 'exato', multas_indicacao: 'sempre', docs_venc: 'sistema', sinistros: '1a3', seguro: 'toda',
    cond_feedback: 'sempre', cond_comportamento: 'telemetria', uso_particular: 'nao', quem_usa: 'sistema',
    maior_gasto: 'manutencao', maior_dor: 'sistema', motivo_agora: 'troca', prazo: 'avaliando', decisor: 'eu', sistema_nome: 'Sistema de frota concorrente',
  },
  'Micro frota (rota curta)': {
    segmento: 'outro', tamanho: '1_5', composicao: ['leves'], propriedade: 'propria', cargo: 'dono',
    estrutura: 'unico', controle_atual: 'papel', tempo_consolidando: 'nao', politica: 'nao',
    comb_controle: 'nenhum', comb_forma: 'reembolso', comb_percepcao: 'certeza',
    man_resp: 'sim', man_tipo: 'naosei', man_checklist: 'nao',
    multas_conhec: 'nao', docs_venc: 'naosei',
    cond_feedback: 'nao', uso_particular: 'casa', quem_usa: 'nao',
    maior_gasto: 'naosei', maior_dor: 'naosei_gasto', prazo: 'semprazo',
  },
};
