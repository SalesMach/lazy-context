/* NEXTfleet · Diagnóstico — motor de impacto, benchmark de mercado e gráficos do relatório (v2) */
const Report = (function () {
  'use strict';

  const fmtBRL = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  const fmtK = n => n >= 1e6 ? 'R$ ' + (n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi' : n >= 1000 ? 'R$ ' + Math.round(n / 1000).toLocaleString('pt-BR') + ' mil' : fmtBRL(n);
  const range = (lo, hi) => fmtK(lo) + ' a ' + fmtK(hi);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const num = v => { const n = parseFloat(String(v || '').replace(/\./g, '').replace(',', '.')); return isFinite(n) && n > 0 ? n : null; };

  // ---------- composição da frota em números ----------
  function fleet(a) {
    const total = FLEET_SIZE_REP[a.tamanho] || 10;
    const types = (Array.isArray(a.composicao) && a.composicao.length ? a.composicao : ['leves']).filter(t => VEHICLE[t]);
    const per = total / types.length;
    const km = num(a.km_mes);
    return { total, types, counts: Object.fromEntries(types.map(t => [t, per])), km, heavy: types.filter(t => ['pesados', 'carretas', 'onibus', 'vuc'].includes(t)), light: types.filter(t => ['leves', 'vans', 'motos'].includes(t)) };
  }

  // ---------- motor de impacto ----------
  function impact(a) {
    const f = fleet(a);
    const items = []; // { pillar, key, label, lo, hi, src[], note }
    const add = (pillar, key, label, lo, hi, src, note) => { if (hi > 0) items.push({ pillar, key, label, lo: Math.round(lo), hi: Math.round(hi), src, note }); };

    // custo anual estimado de combustível
    let fuelYear = 0;
    f.types.forEach(t => {
      const v = VEHICLE[t], n = f.counts[t];
      if (v.hours) fuelYear += n * v.hours * v.lph * FUEL[v.fuel] * 12;
      else fuelYear += n * (f.km || v.km) / v.kml * FUEL[v.fuel] * 12;
    });
    const fuelInformed = num(a.gasto_comb);
    if (fuelInformed) fuelYear = fuelInformed * 12;

    // custo anual estimado de manutenção
    let maintYear = 0;
    f.types.forEach(t => { maintYear += f.counts[t] * VEHICLE[t].manut * 12; });
    const maintInformed = num(a.gasto_manut);
    if (maintInformed) maintYear = maintInformed * 12;

    // --- combustível ---
    const lossF = a.comb_controle === 'nenhum' ? IMPACT.fuelLossNoControl : a.comb_controle === 'basico' ? IMPACT.fuelLossBasic : IMPACT.fuelLossComplete;
    add('combustivel', 'fuel_control', 'Combustível sem controle por veículo', fuelYear * lossF[0], fuelYear * lossF[1], ['GEOTAB', 'ANP', fuelInformed ? null : 'DEFAULT'].filter(Boolean),
      a.comb_controle === 'nenhum' ? 'Sem registro por veículo, desvios e abastecimentos fora do padrão passam despercebidos.' : a.comb_controle === 'basico' ? 'Controle básico identifica o gasto, mas não o consumo anormal de cada veículo.' : 'Margem residual de desvio mesmo com controle.');
    if (a.comb_ocioso === 'sim' || a.comb_ocioso === 'naosei') {
      let lo = 0, hi = 0;
      f.types.forEach(t => { const n = f.counts[t]; const heavy = ['pesados', 'carretas', 'onibus', 'vuc'].includes(t); const l = heavy ? IMPACT.idleLph.heavy : IMPACT.idleLph.light; const price = FUEL[VEHICLE[t].fuel]; if (VEHICLE[t].hours) return; lo += n * IMPACT.idleHoursPerDay * l[0] * price * IMPACT.idleDays; hi += n * IMPACT.idleHoursPerDay * l[1] * price * IMPACT.idleDays; });
      const k = a.comb_ocioso === 'sim' ? 1 : 0.5;
      add('combustivel', 'idle', 'Motor ligado parado (1 h/dia)', lo * k, hi * k, ['GEOTAB', 'UTFPR'], 'Estimativa com 1 hora de marcha lenta por veículo por dia útil.');
    }

    // --- manutenção ---
    if (a.man_tipo === 'corretiva') add('manutencao', 'corrective', 'Sobrecusto da manutenção corretiva', maintYear * IMPACT.correctiveOvercost[0], maintYear * IMPACT.correctiveOvercost[1], ['DOE', maintInformed ? null : 'DEFAULT'].filter(Boolean), 'Reparo de emergência custa mais em peças, mão de obra e urgência do que a preventiva planejada.');
    else if (a.man_tipo === 'naosei') add('manutencao', 'corrective', 'Manutenção sem plano definido', maintYear * IMPACT.unknownMaintOver[0], maintYear * IMPACT.unknownMaintOver[1], ['DOE', 'DEFAULT'], 'Sem saber a proporção, assumimos uma operação parcialmente corretiva.');
    if (a.man_resp === 'sim' || R.rented(a)) {
      const days = IMPACT.downDays[a.man_tipo] || (a.man_parado === 'sim' ? IMPACT.downDays.sim : IMPACT.downDays.naosei);
      let lo = 0, hi = 0;
      f.types.forEach(t => { lo += f.counts[t] * days * VEHICLE[t].costDay[0]; hi += f.counts[t] * days * VEHICLE[t].costDay[1]; });
      add('manutencao', 'downtime', 'Veículos parados (' + days + ' dias/ano por veículo)', lo, hi, ['NTC', 'DEFAULT'], 'Custo fixo que continua correndo com o veículo parado: depreciação, capital, salário, seguro.');
    }
    if (['troca', 'nenhum'].includes(a.man_pneus)) {
      let tires = 0; f.types.forEach(t => { tires += f.counts[t] * VEHICLE[t].tires; });
      add('manutencao', 'tires', 'Pneus sem gestão de vida e recapagem', tires * IMPACT.tiresSaving[0], tires * IMPACT.tiresSaving[1], ['TIRES', 'DEFAULT'], 'Rodízio, calibragem e recapagem controlada estendem a vida útil em 25% a 50%.');
    }
    if (['fatura', 'nao'].includes(a.man_locadora)) {
      const rent = f.total * IMPACT.rentalMonthly * 12;
      add('manutencao', 'rental', 'Cobranças extras e SLA da locadora não acompanhados', rent * IMPACT.rentalLeak[0], rent * IMPACT.rentalLeak[1], ['DEFAULT'], 'Avarias cobradas sem contestação, veículos reserva atrasados e km excedente.');
    }

    // --- multas e documentos ---
    const finesBase = f.total * IMPACT.finesPerVehicle * IMPACT.fineAvg;
    if (['asvezes', 'absorve', 'naosei'].includes(a.multas_indicacao) || a.multas_conhec === 'nao') {
      const k = a.multas_indicacao === 'absorve' ? [0.3, 0.4] : [0.1, 0.2];
      add('compliance', 'nic', 'Multas em dobro por não indicar o condutor (NIC)', finesBase * k[0], finesBase * k[1], ['CTB', 'MULTAS'], 'A multa NIC equivale ao dobro da infração original para pessoa jurídica.');
    }
    if (a.cond_comportamento === 'nao' || a.cond_comportamento === 'reclamacao') {
      const k = a.cond_comportamento === 'nao' ? IMPACT.indirectFine : [0.5, 1];
      add('compliance', 'fines_indirect', 'Custo indireto das infrações (combustível, desgaste, risco)', finesBase * k[0], finesBase * k[1], ['MULTAS'], 'Excesso de velocidade e frenagens bruscas custam mais em consumo e desgaste do que a multa em si.');
    }
    if (['ninguem', 'naosei'].includes(a.docs_venc)) {
      let dayCost = 0; f.types.forEach(t => { dayCost += (f.counts[t] / f.total) * VEHICLE[t].costDay[1]; });
      add('compliance', 'docs', 'Veículos retidos por documentação vencida', f.total * IMPACT.docsProb[0] * (IMPACT.docsCost + dayCost), f.total * IMPACT.docsProb[1] * (IMPACT.docsCost + dayCost), ['CTB', 'DETRAN'], 'Multa gravíssima, remoção, diárias de pátio e um dia de veículo parado por ocorrência.');
    }

    // --- sinistros ---
    const claims = { zero: 0, '1a3': 2, '4a10': 7, mais10: 12 }[a.sinistros];
    const nClaims = claims !== undefined ? claims : (a.sinistros === 'naosei' || !a.sinistros ? f.total * IMPACT.claimsPerVehicle : 0);
    if (nClaims > 0) {
      const heavyShare = f.heavy.length / f.types.length;
      const lo = nClaims * (IMPACT.claimCost.light[0] * (1 - heavyShare) + IMPACT.claimCost.heavy[0] * heavyShare);
      const hi = nClaims * (IMPACT.claimCost.light[1] * (1 - heavyShare) + IMPACT.claimCost.heavy[1] * heavyShare);
      add('motoristas', 'claims', 'Parcela evitável dos sinistros (22%)', lo * IMPACT.claimsAvoidable, hi * IMPACT.claimsAvoidable, ['CNT', 'VERIZON'], 'Frotas com acompanhamento de condução reduzem o custo de acidentes em 22%.');
    }

    // --- uso particular ---
    if (a.uso_particular && a.uso_particular !== 'nao' && ['nada', 'regra'].includes(a.uso_regra || 'nada')) {
      const k = a.uso_regra === 'regra' ? 0.5 : 1;
      let lo = 0, hi = 0;
      f.types.forEach(t => { const v = VEHICLE[t]; if (v.hours) return; const kmY = f.counts[t] * (f.km || v.km) * 12; lo += kmY * IMPACT.privateUseShare[0] * v.cpk[0]; hi += kmY * IMPACT.privateUseShare[1] * v.cpk[1]; });
      add('motoristas', 'private', 'Uso particular sem regra ou sem controle', lo * k, hi * k, ['DEFAULT'], 'Entre 5% e 10% da quilometragem fora do expediente, ao custo por km do veículo.');
    }

    // --- tempo ---
    let hours = 0;
    if (a.tempo_consolidando) hours = IMPACT.adminHours[a.tempo_consolidando] || 0;
    else if (['planilha', 'erp', 'papel'].includes(a.controle_atual)) hours = 60;
    else if (a.controle_atual === 'telemetria') hours = 40;
    if (hours) add('gestao', 'admin', 'Horas gastas consolidando dados (' + hours + ' h/ano)', hours * IMPACT.adminHourCost * 0.7, hours * IMPACT.adminHourCost * 1.3, ['EDENRED'], 'Tempo de gestor em digitação e conferência, não em decisão.');

    const total = items.reduce((s, i) => ({ lo: s.lo + i.lo, hi: s.hi + i.hi }), { lo: 0, hi: 0 });
    const byPillar = {};
    PILLARS.forEach(p => { const its = items.filter(i => i.pillar === p.id); byPillar[p.id] = { lo: its.reduce((s, i) => s + i.lo, 0), hi: its.reduce((s, i) => s + i.hi, 0), items: its }; });
    return { items, total, byPillar, fuelYear, maintYear, hours, fleet: f, informed: { fuel: !!fuelInformed, maint: !!maintInformed, km: !!f.km }, finesBase, nClaims };
  }

  // ---------- índices de tecnologia e processo ----------
  function indexOf(a, table) {
    let sum = 0, n = 0;
    Object.keys(table).forEach(q => { const v = a[q]; if (v === undefined) return; const pts = table[q][v]; if (typeof pts !== 'number') return; sum += pts; n++; });
    return n ? Math.round(sum / (3 * n) * 100) : null;
  }
  function indices(a) {
    const tech = indexOf(a, TECH_INDEX), proc = indexOf(a, PROCESS_INDEX);
    let quadrant = 'Reativa';
    if (tech !== null && proc !== null) quadrant = tech >= 50 && proc >= 50 ? 'Tecnologia com processo' : tech >= 50 ? 'Tecnologia sem processo' : proc >= 50 ? 'Processo sem tecnologia' : 'Sem tecnologia e sem processo';
    return { tech, proc, quadrant };
  }

  // ---------- benchmark de mercado ----------
  function market(a) {
    const base = Object.assign({}, MARKET_CURVE[a.tamanho] || MARKET_CURVE['21_50']);
    MARKET_ADJ.forEach(r => { if (r.when(a)) Object.keys(r.adj).forEach(k => { base[k] = Math.max(5, Math.min(90, base[k] + r.adj[k])); }); });
    const top = {}; Object.keys(base).forEach(k => { top[k] = Math.min(85, base[k] + TOP25_GAP); });
    const avg = Math.round(PILLARS.reduce((s, p) => s + base[p.id] * p.weight, 0));
    const topAvg = Math.round(PILLARS.reduce((s, p) => s + top[p.id] * p.weight, 0));
    return { pillars: base, top, global: avg, topGlobal: topAvg, sizeLabel: FLEET_SIZE_LABEL[a.tamanho] || 'seu porte' };
  }

  // ---------- riscos (semáforo) ----------
  function risks(a) {
    const out = [];
    const push = (level, title, text, base) => out.push({ level, title, text, base });
    if (['ninguem', 'naosei'].includes(a.docs_venc)) push('red', 'Documentação vencida', 'Ninguém acompanha CNH e licenciamento. Veículo retido e multa gravíssima a cada abordagem.', 'CTB art. 230; Detran-SP 2026');
    else if (a.docs_venc === 'planilha') push('yellow', 'Documentação em planilha', 'Controle existe, mas depende de alguém olhar a planilha no dia certo.', 'CTB art. 230');
    else push('green', 'Documentação', 'Vencimentos com alerta automático.', '');
    if (a.multas_indicacao === 'absorve') push('red', 'Multas em dobro (NIC)', 'A empresa absorve multas e pontos. Cada infração não indicada vira duas.', 'Lei 14.229/2021, art. 257 CTB');
    else if (['asvezes', 'naosei'].includes(a.multas_indicacao) || a.multas_conhec === 'nao') push('yellow', 'Indicação de condutor', 'Prazos perdidos ocasionalmente geram NIC e pontos para a empresa.', 'Lei 14.229/2021');
    else if (a.multas_indicacao) push('green', 'Indicação de condutor', 'Feita dentro do prazo.', '');
    if (R.heavy(a) && R.clt(a)) {
      if (a.jornada === 'nao') push('red', 'Jornada do motorista', 'Sem controle de jornada: passivo trabalhista e risco em sinistros.', 'Lei 13.103/2015, CLT art. 235-C; STF ADI 5322');
      else if (a.jornada === 'parcial') push('yellow', 'Jornada do motorista', 'Controle parcial. Tempo de espera conta como tempo à disposição.', 'STF ADI 5322');
      else if (a.jornada) push('green', 'Jornada do motorista', 'Registro e relatórios em dia.', '');
    }
    if (R.motos(a)) push(a.motos_epi === 'sim' ? 'yellow' : 'red', 'Sinistralidade com motos', 'Acidentes de trabalho com entregadores cresceram 35% em dois anos. Motociclistas são quase 60% dos sinistros.', 'Ministério da Saúde / MPT; Abramet');
    if (['4a10', 'mais10'].includes(a.sinistros)) push('red', 'Frequência de sinistros', 'Mais de 4 sinistros no ano elevam o prêmio do seguro e o risco de ação civil.', 'CNT 2025');
    if (a.uso_particular && a.uso_particular !== 'nao' && (a.uso_regra || 'nada') === 'nada') push('red', 'Uso particular sem regra', 'Sem política assinada, acidentes e multas fora do expediente recaem sobre a empresa.', 'Política de frota');
    else if (a.uso_particular && a.uso_particular !== 'nao') push('yellow', 'Uso particular', 'Há regra, mas pouco ou nenhum controle de horário e quilometragem.', 'Política de frota');
    if (a.seguro === 'naosei') push('yellow', 'Seguro', 'Não se sabe a cobertura da frota. Um sinistro grave pode não estar coberto.', '');
    if (a.comb_controle === 'nenhum') push('red', 'Combustível', 'Nenhum controle: desvio e fraude não seriam detectados.', 'Geotab; WEX 2024');
    if (a.estrutura === 'ninguem') push('red', 'Responsável pela frota', 'Sem dono do processo, nenhuma das ações acima tem quem execute.', '');
    const order = { red: 0, yellow: 1, green: 2 };
    return out.sort((x, y) => order[x.level] - order[y.level]);
  }

  // ---------- comparativo de indicadores ----------
  function indicators(a, imp) {
    const f = imp.fleet; const rows = [];
    // custo por km
    let kmYear = 0; f.types.forEach(t => { const v = VEHICLE[t]; if (!v.hours) kmYear += f.counts[t] * (f.km || v.km) * 12; });
    if (kmYear > 0) {
      const cpk = (imp.fuelYear + imp.maintYear) / kmYear;
      let refLo = 0, refHi = 0; f.types.forEach(t => { const v = VEHICLE[t]; if (v.hours) return; refLo += (f.counts[t] / f.total) * v.cpk[0] * 0.55; refHi += (f.counts[t] / f.total) * v.cpk[1] * 0.55; });
      const suspicious = cpk < refLo * 0.5 || cpk > refHi * 2.5;
      rows.push({ name: 'Combustível + manutenção por km', you: 'R$ ' + cpk.toFixed(2) + (suspicious ? ' (verifique os valores informados)' : ''), ref: 'R$ ' + refLo.toFixed(2) + ' a ' + refHi.toFixed(2), status: suspicious ? 'warn' : cpk > refHi ? 'bad' : cpk < refLo ? 'ok' : 'warn', informed: imp.informed.fuel || imp.informed.maint, note: 'Parcela variável do custo por km (sem depreciação e salário).' });
    }
    rows.push({ name: 'Multas por veículo por ano', you: a.multas_conhec === 'exato' ? 'controlado (valor não informado)' : '~' + IMPACT.finesPerVehicle + ' (média de mercado)', ref: '1 a 2', status: a.multas_conhec === 'exato' && a.multas_indicacao === 'sempre' ? 'ok' : 'warn', note: 'Frotas com telemetria e feedback ficam abaixo de 2.' });
    const days = IMPACT.downDays[a.man_tipo] || IMPACT.downDays.naosei;
    rows.push({ name: 'Dias parados por veículo por ano', you: a.man_parado === 'sim' ? 'acompanhado' : '~' + days + ' (estimado)', ref: '3 a 5', status: days > 6 ? 'bad' : days > 5 ? 'warn' : 'ok', note: 'Disponibilidade de referência: 95% ou mais.' });
    rows.push({ name: 'Horas por ano em consolidação manual', you: imp.hours ? imp.hours + ' h' : 'baixo', ref: 'menos de 20 h', status: imp.hours >= 100 ? 'bad' : imp.hours > 20 ? 'warn' : 'ok', note: 'Com integração de fornecedores, o fechamento é automático.' });
    rows.push({ name: 'Consumo conhecido por veículo', you: a.comb_kml === 'veiculo' ? 'sim' : a.comb_kml === 'geral' ? 'só média geral' : 'não', ref: 'sim, por veículo e condutor', status: a.comb_kml === 'veiculo' ? 'ok' : a.comb_kml === 'geral' ? 'warn' : 'bad', note: 'Base para detectar desvio e condução ineficiente.' });
    return rows;
  }

  // ---------- plano 30/60/90 ----------
  function plan(a, s, imp) {
    const steps = { 30: [], 60: [], 90: [] };
    const weak = [s.weak, s.secondWeak].filter(Boolean).map(p => p.id);
    const push = (d, pillar, text, mod) => steps[d].push({ pillar, text, mod });
    if (a.estrutura === 'ninguem') push(30, 'gestao', 'Nomear um responsável pela frota e definir o fechamento mensal de custos.', 'Medição e Gastos');
    if (['ninguem', 'naosei', 'planilha'].includes(a.docs_venc)) push(30, 'compliance', 'Cadastrar todos os condutores e veículos com vencimentos e alertas.', 'CNH Inteligente');
    if (a.comb_controle !== 'completo') push(30, 'combustivel', 'Registrar cada abastecimento por veículo e condutor (cartão ou app).', 'Abastecimento');
    if (a.multas_indicacao !== 'sempre') push(30, 'compliance', 'Instituir o fluxo de indicação de condutor com prazo e responsável.', 'Multa');
    if (a.man_checklist === 'nao') push(60, 'manutencao', 'Checklist de saída pelo app do condutor, com foto e assinatura.', 'Checklist');
    if (['corretiva', 'naosei'].includes(a.man_tipo)) push(60, 'manutencao', 'Criar planos de preventiva por km ou horímetro, com alerta automático.', 'Guardião Preventivo');
    if (a.comb_kml !== 'veiculo') push(60, 'combustivel', 'Acompanhar consumo por veículo e alertar abastecimentos fora do padrão.', 'Abastecimento Protegido');
    if (['fatura', 'nao'].includes(a.man_locadora)) push(60, 'manutencao', 'Conferir faturas da locadora contra SLA, avarias e km contratado.', 'Medição e Gastos');
    if (a.cond_comportamento !== 'telemetria') push(90, 'motoristas', 'Acompanhar comportamento ao volante e dar feedback com ranking.', 'Gamer da Frota');
    if (a.uso_particular && a.uso_particular !== 'nao') push(90, 'motoristas', 'Formalizar a política de uso particular e controlar horário e km.', 'Telemetria');
    if (!R.anyOf(a, 'indicadores', ['custo_km'])) push(90, 'gestao', 'Fechar o custo por km e por veículo todo mês e comparar com a meta.', 'Medição e Gastos');
    if (R.heavy(a) && ['troca', 'nenhum'].includes(a.man_pneus)) push(90, 'manutencao', 'Controlar vida dos pneus, rodízio e recapagem.', 'Manutenção');
    if (R.usesSystem(a) && a.sistema_falta && a.sistema_falta !== 'nada') push(60, 'gestao', 'Integrar o sistema atual (ou substituí-lo) para reunir abastecimento, oficinas e multas no mesmo lugar.', 'Integração via API');
    Object.keys(steps).forEach(d => { steps[d] = steps[d].slice(0, 3); });
    return steps;
  }

  // ---------- SVG ----------
  const NAVY = '#011831', BLUE = '#007aff', LINE = '#e3e6fc', MUTED = '#8a93a3', OK = '#1fa97a', WARN = '#f39c12', BAD = '#ed1c24';

  function gauge(score, mktAvg, mktTop, label) {
    const cx = 150, cy = 150, r = 120;
    const ang = v => Math.PI + (v / 100) * Math.PI;
    const pt = (v, rad) => [cx + rad * Math.cos(ang(v)), cy + rad * Math.sin(ang(v))];
    const arc = (v0, v1, rad, w, color) => { const [x0, y0] = pt(v0, rad), [x1, y1] = pt(v1, rad); return `<path d="M${x0} ${y0} A${rad} ${rad} 0 ${v1 - v0 > 50 ? 1 : 0} 1 ${x1} ${y1}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; };
    const tick = (v, color, txt) => { const [x0, y0] = pt(v, r - 22), [x1, y1] = pt(v, r + 20); const [tx, ty] = pt(v, r + 34); return `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="3"/><text x="${tx}" y="${ty}" font-size="11" font-weight="700" fill="${color}" text-anchor="middle">${txt}</text>`; };
    return `<svg viewBox="0 0 300 190" class="gauge" role="img" aria-label="${esc(label)}">
      ${arc(0, 100, r, 18, LINE)}
      ${score > 0 ? arc(0, Math.max(score, 2), r, 18, BLUE) : ''}
      ${tick(mktAvg, MUTED, 'média ' + mktAvg)}
      ${tick(mktTop, OK, 'referência ' + mktTop)}
      <text x="${cx}" y="${cy - 18}" font-size="44" font-weight="700" fill="${NAVY}" text-anchor="middle">${score}</text>
      <text x="${cx}" y="${cy + 4}" font-size="12" fill="${MUTED}" text-anchor="middle">de 100 pontos</text>
      <text x="30" y="${cy + 24}" font-size="10" fill="${MUTED}" text-anchor="middle">0</text>
      <text x="270" y="${cy + 24}" font-size="10" fill="${MUTED}" text-anchor="middle">100</text>
    </svg>`;
  }

  function waterfall(imp) {
    const items = imp.items.slice().sort((x, y) => y.hi - x.hi).slice(0, 7);
    const max = Math.max(1, imp.total.hi);
    const W = 320, labelW = 150, barW = W - labelW - 10, rowH = 34;
    let y = 0, cum = 0, rows = '';
    items.forEach(i => {
      const x0 = labelW + (cum / max) * barW, w1 = (i.lo / max) * barW, w2 = ((i.hi - i.lo) / max) * barW;
      rows += `<text x="0" y="${y + 14}" font-size="10.5" fill="${NAVY}" font-weight="600">${esc(short(i.label, 34))}</text>
        <text x="0" y="${y + 27}" font-size="9.5" fill="${MUTED}">${esc(range(i.lo, i.hi))}</text>
        <rect x="${x0}" y="${y + 6}" width="${Math.max(w1, 1)}" height="18" rx="4" fill="${BLUE}"/>
        <rect x="${x0 + w1}" y="${y + 6}" width="${Math.max(w2, 0)}" height="18" rx="4" fill="${BLUE}" opacity=".35"/>`;
      cum += i.hi; y += rowH;
    });
    rows += `<line x1="${labelW}" y1="0" x2="${labelW}" y2="${y}" stroke="${LINE}"/>
      <text x="0" y="${y + 18}" font-size="12" font-weight="700" fill="${NAVY}">Total estimado</text>
      <rect x="${labelW}" y="${y + 6}" width="${barW * (imp.total.lo / max)}" height="18" rx="4" fill="${NAVY}"/>
      <rect x="${labelW + barW * (imp.total.lo / max)}" y="${y + 6}" width="${barW * ((imp.total.hi - imp.total.lo) / max)}" height="18" rx="4" fill="${NAVY}" opacity=".35"/>
      <text x="${labelW}" y="${y + 40}" font-size="11" fill="${NAVY}" font-weight="700">${esc(range(imp.total.lo, imp.total.hi))} por ano</text>`;
    return `<svg viewBox="0 0 ${W} ${y + 48}" class="chart" role="img" aria-label="Perdas estimadas por item">${rows}</svg>`;
  }
  function short(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function radar(s, mkt) {
    const cx = 160, cy = 150, r = 105, n = PILLARS.length;
    const ang = i => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pt = (i, v) => [cx + r * (v / 100) * Math.cos(ang(i)), cy + r * (v / 100) * Math.sin(ang(i))];
    const poly = (vals, color, fill) => `<polygon points="${vals.map((v, i) => pt(i, v).join(',')).join(' ')}" fill="${fill}" stroke="${color}" stroke-width="2"/>`;
    const grid = [25, 50, 75, 100].map(g => `<polygon points="${PILLARS.map((_, i) => pt(i, g).join(',')).join(' ')}" fill="none" stroke="${LINE}"/>`).join('');
    const axes = PILLARS.map((p, i) => { const [x, y] = pt(i, 100); const [lx, ly] = pt(i, 128); return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${LINE}"/><text x="${lx}" y="${ly}" font-size="10" font-weight="600" fill="${NAVY}" text-anchor="middle">${esc(p.name.replace(' e ', ' e '))}</text>`; }).join('');
    const you = PILLARS.map(p => { const x = s.pillars.find(q => q.id === p.id); return x && x.score !== null ? x.score : 0; });
    const avg = PILLARS.map(p => mkt.pillars[p.id]);
    const top = PILLARS.map(p => mkt.top[p.id]);
    return `<svg viewBox="0 0 320 300" class="chart" role="img" aria-label="Radar por pilar">${grid}${axes}
      ${poly(top, OK, 'rgba(31,169,122,.08)')}${poly(avg, MUTED, 'rgba(138,147,163,.10)')}${poly(you, BLUE, 'rgba(0,122,255,.22)')}
      ${you.map((v, i) => { const [x, y] = pt(i, v); return `<circle cx="${x}" cy="${y}" r="4" fill="${BLUE}"/>`; }).join('')}
    </svg>
    <div class="legend"><span style="color:${BLUE}">&#9632; Sua frota</span><span style="color:${MUTED}">&#9632; Média do porte</span><span style="color:${OK}">&#9632; Referência (top 25%)</span></div>`;
  }

  function quadrant(idx) {
    const W = 320, H = 260, pad = 36;
    const x = pad + ((idx.tech ?? 0) / 100) * (W - 2 * pad), y = H - pad - ((idx.proc ?? 0) / 100) * (H - 2 * pad);
    const mid = (W) / 2, midY = H / 2;
    const q = (x0, y0, l1, l2, anchor) => `<text x="${x0}" y="${y0}" font-size="9.5" fill="${MUTED}" font-weight="600" text-anchor="${anchor}">${l1}<tspan x="${x0}" dy="11">${l2}</tspan></text>`;
    return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Quadrante tecnologia e processo">
      <rect x="${pad}" y="${pad}" width="${W - 2 * pad}" height="${H - 2 * pad}" fill="#f7f9fe" stroke="${LINE}"/>
      <line x1="${mid}" y1="${pad}" x2="${mid}" y2="${H - pad}" stroke="${LINE}" stroke-dasharray="4 4"/>
      <line x1="${pad}" y1="${midY}" x2="${W - pad}" y2="${midY}" stroke="${LINE}" stroke-dasharray="4 4"/>
      ${q(pad + 6, pad + 14, 'Processo', 'sem tecnologia', 'start')}${q(W - pad - 6, pad + 14, 'Tecnologia', 'com processo', 'end')}
      ${q(pad + 6, H - pad - 18, 'Sem tecnologia', 'e sem processo', 'start')}${q(W - pad - 6, H - pad - 18, 'Tecnologia', 'sem processo', 'end')}
      <text x="${W / 2}" y="${H - 8}" font-size="10" fill="${NAVY}" text-anchor="middle" font-weight="600">Índice de tecnologia → ${idx.tech ?? '-'}</text>
      <text x="12" y="${H / 2}" font-size="10" fill="${NAVY}" text-anchor="middle" font-weight="600" transform="rotate(-90 12 ${H / 2})">Índice de processo → ${idx.proc ?? '-'}</text>
      <circle cx="${x}" cy="${y}" r="9" fill="${BLUE}" stroke="#fff" stroke-width="3"/>
    </svg>`;
  }

  function timeline(p) {
    const col = (d, items, color) => `<div class="tl-col"><div class="tl-head" style="background:${color}">${d} dias</div>${items.map(i => `<div class="tl-item"><span class="tl-mod">${esc(i.mod)}</span>${esc(i.text)}</div>`).join('') || '<div class="tl-item" style="color:#8a93a3">Sem ações críticas nesta janela.</div>'}</div>`;
    return `<div class="timeline">${col(30, p[30], BAD)}${col(60, p[60], WARN)}${col(90, p[90], BLUE)}</div>`;
  }

  // ---------- render das seções ----------
  function render(a, s, lead) {
    const imp = impact(a), idx = indices(a), mkt = market(a), rk = risks(a), ind = indicators(a, imp), pl = plan(a, s, imp);
    const level = s.level, diff = s.global - mkt.global;
    const posTxt = diff >= 10 ? 'acima da média' : diff <= -10 ? 'abaixo da média' : 'na média';
    const usedSrc = new Set(); imp.items.forEach(i => i.src.forEach(x => usedSrc.add(x))); ['ARVAL', 'VERIZON'].forEach(x => usedSrc.add(x));
    const redCount = rk.filter(r => r.level === 'red').length;
    const workDays = Math.round(imp.hours / 8);

    const html = `
    <section class="card exec">
      <div class="gauge-wrap">${gauge(s.global, mkt.global, mkt.topGlobal, 'Score de maturidade')}</div>
      <div class="exec-text">
        <div class="label">Nível de maturidade</div>
        <div class="level">${esc(level.name)}</div>
        <p class="lead">Sua frota está <b>${posTxt}</b> das frotas de ${esc(mkt.sizeLabel)} (média estimada ${mkt.global}) e a <b>${Math.max(0, mkt.topGlobal - s.global)} pontos</b> das frotas de referência.</p>
        <p class="lead">${esc(level.text)}</p>
      </div>
      <div class="kpis">
        <div class="kpi bad"><b>${esc(range(imp.total.lo, imp.total.hi))}</b><span>perda estimada por ano se nada mudar</span></div>
        <div class="kpi warn"><b>${imp.hours ? imp.hours + ' h' : '—'}</b><span>por ano em trabalho manual${workDays ? ' (' + workDays + ' dias)' : ''}</span></div>
        <div class="kpi ${redCount ? 'bad' : 'ok'}"><b>${redCount}</b><span>risco${redCount === 1 ? '' : 's'} crítico${redCount === 1 ? '' : 's'} de compliance</span></div>
      </div>
    </section>

    <section class="card">
      <h3>Onde o dinheiro está escapando</h3>
      <p class="lead">Faixa conservadora a provável, calculada com ${imp.informed.fuel || imp.informed.maint || imp.informed.km ? 'os números que você informou e ' : ''}médias de mercado para ${imp.fleet.total} veículos (${imp.fleet.types.map(t => VEHICLE[t].label.toLowerCase()).join(', ')}).</p>
      ${imp.items.length ? waterfall(imp) : '<p class="lead">Não identificamos perdas relevantes com base nas suas respostas.</p>'}
      <p class="foot">Barra cheia: estimativa conservadora. Barra clara: até o valor provável. Gasto anual estimado: combustível ${fmtK(imp.fuelYear)}${imp.informed.fuel ? ' (informado)' : ''}, manutenção ${fmtK(imp.maintYear)}${imp.informed.maint ? ' (informado)' : ''}.</p>
    </section>

    <section class="card">
      <h3>Sua frota, a média do seu porte e a referência</h3>
      ${radar(s, mkt)}
      <div class="pillar-table">${PILLARS.map(p => { const x = s.pillars.find(q => q.id === p.id); const you = x && x.score !== null ? x.score : null; const m = mkt.pillars[p.id]; const d = you === null ? null : you - m; return `<div class="pt-row"><span>${esc(p.name)}</span><b>${you === null ? '—' : you}</b><span class="muted">média ${m}</span><span class="${d === null ? 'muted' : d >= 0 ? 'ok' : 'bad'}">${d === null ? '' : (d >= 0 ? '+' : '') + d}</span></div>`; }).join('')}</div>
    </section>

    <section class="card">
      <h3>Tecnologia e processo</h3>
      <p class="lead">No Brasil, 49% das empresas já têm veículos conectados, mas só 25% usam os dados (Arval 2025). Ter ferramenta não é ter gestão.</p>
      ${quadrant(idx)}
      <p class="lead"><b>Sua posição: ${esc(idx.quadrant)}.</b> ${quadrantText(idx)}</p>
    </section>

    <section class="card">
      <h3>Riscos de compliance</h3>
      <div class="risks">${rk.map(r => `<div class="risk ${r.level}"><i></i><div><b>${esc(r.title)}</b><p>${esc(r.text)}</p>${r.base ? `<small>${esc(r.base)}</small>` : ''}</div></div>`).join('')}</div>
    </section>

    <section class="card">
      <h3>Indicadores: sua frota e a referência</h3>
      <table class="cmp"><thead><tr><th>Indicador</th><th>Sua frota</th><th>Referência</th></tr></thead><tbody>
      ${ind.map(r => `<tr><td>${esc(r.name)}<small>${esc(r.note)}</small></td><td class="${r.status}">${esc(r.you)}</td><td>${esc(r.ref)}</td></tr>`).join('')}
      </tbody></table>
    </section>`;

    return { html, imp, idx, mkt, rk, ind, pl, usedSrc: [...usedSrc], fmtK, range, timeline: timeline(pl) };
  }

  function quadrantText(idx) {
    return {
      'Tecnologia com processo': 'A frota tem ferramenta e rotina. O ganho agora vem de integrar fornecedores e automatizar o fechamento.',
      'Tecnologia sem processo': 'Há rastreador ou sistema, mas falta rotina de uso: fechamento, indicadores e cobrança. É o caso mais comum no Brasil.',
      'Processo sem tecnologia': 'A disciplina existe, mas depende de pessoas e planilhas. Um sistema libera horas e elimina erro de digitação.',
      'Sem tecnologia e sem processo': 'Primeiro um responsável e um fechamento mensal simples; a ferramenta vem logo em seguida para sustentar a rotina.',
      'Reativa': '',
    }[idx.quadrant] || '';
  }

  return { impact, indices, market, risks, indicators, plan, render, fmtK, range };
})();
