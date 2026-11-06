/* NEXTfleet · Diagnóstico de Maturidade — motor do fluxo (protótipo) */
(function () {
  'use strict';

  const ICONS = {
    truck: '<svg viewBox="0 0 24 24"><path d="M3 7h10v8H3zM13 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17v4M7 13l3-3 2 2 4-5"/></svg>',
    fuel: '<svg viewBox="0 0 24 24"><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M5 21h10M7 7h6v4H7zM15 10h2a1 1 0 0 1 1 1v5a1.5 1.5 0 0 0 3 0v-6l-2-2"/></svg>',
    wrench: '<svg viewBox="0 0 24 24"><path d="M14.5 4.5a4 4 0 0 0-4.6 5.4L3 16.8V21h4.2l6.9-6.9a4 4 0 0 0 5.4-4.6l-2.6 2.6-2.8-2.8z"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    driver: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><circle cx="12" cy="15.5" r="0.6"/></svg>',
    target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2"/></svg>',
  };

  const state = { answers: {}, pos: 0, showLead: false, devOpen: false };
  const $app = document.getElementById('app');
  const $toast = document.getElementById('toast');

  // ---------- visibilidade e sequência ----------
  function isVisible(q, a) {
    if (q.short && R.small(a)) return false;
    if (q.showIf && !q.showIf(a)) return false;
    return true;
  }
  function visibleQuestions(a) { return QUESTIONS.filter(q => isVisible(q, a)); }
  function buildSequence(a) {
    const seq = [{ kind: 'welcome', key: 'welcome' }];
    const vis = visibleQuestions(a);
    STEPS.forEach(step => {
      const qs = vis.filter(q => q.step === step.id);
      if (!qs.length) return;
      seq.push({ kind: 'intro', key: 'intro:' + step.id, step, count: qs.length });
      qs.forEach((q, i) => seq.push({ kind: 'question', key: 'q:' + q.id, q, step, idx: i + 1, total: qs.length }));
    });
    seq.push({ kind: 'result', key: 'result' });
    return seq;
  }
  function stepsVisible(a) {
    const vis = visibleQuestions(a);
    return STEPS.filter(s => vis.some(q => q.step === s.id));
  }

  // ---------- pontuação ----------
  function questionPoints(q, a) {
    const v = a[q.id];
    if (v === undefined || v === null || (Array.isArray(v) && !v.length)) return null;
    if (q.score) return q.score(Array.isArray(v) ? v : [v]);
    const opt = q.options.find(o => o.v === v);
    return opt && typeof opt.pts === 'number' ? opt.pts : null;
  }
  function computeScores(a) {
    const vis = visibleQuestions(a);
    const pillars = PILLARS.map(p => {
      const qs = vis.filter(q => q.pillar === p.id);
      let sum = 0, n = 0;
      qs.forEach(q => { const pts = questionPoints(q, a); if (pts !== null) { sum += pts; n++; } });
      const score = n ? Math.round((sum / (3 * n)) * 100) : null;
      return { ...p, score, answered: n, total: qs.length };
    });
    const withData = pillars.filter(p => p.score !== null);
    const wsum = withData.reduce((s, p) => s + p.weight, 0);
    const global = withData.length ? Math.round(withData.reduce((s, p) => s + p.score * (p.weight / wsum), 0)) : 0;
    const level = [...LEVELS].reverse().find(l => global >= l.min) || LEVELS[0];
    const sorted = withData.slice().sort((x, y) => y.score - x.score);
    return { pillars, global, level, strong: sorted[0] || null, weak: sorted[sorted.length - 1] || null, secondWeak: sorted.length > 1 ? sorted[sorted.length - 2] : null };
  }
  function band(score) { return [...BANDS].reverse().find(b => score >= b.min) || BANDS[0]; }

  // ---------- lead score ----------
  function leadScore(a, scores) {
    let pts = 0; const reasons = [];
    const size = { '1_5': 0, '6_20': 1, '21_50': 2, '51_150': 3, '151_500': 4, '500': 4 }[a.tamanho] ?? 0;
    pts += size; if (size >= 2) reasons.push('Frota de ' + (LABELS.tamanho[a.tamanho] || '').toLowerCase() + ' dentro do perfil');
    const prazo = { avaliando: 3, '3m': 2, '6_12m': 1, semprazo: 0 }[a.prazo] ?? 0;
    pts += prazo; if (prazo >= 2) reasons.push(a.prazo === 'avaliando' ? 'Já está avaliando soluções' : 'Quer resolver nos próximos 3 meses');
    const dec = { eu: 2, diretoria: 1, outro: 0 }[a.decisor] ?? 1;
    pts += dec; if (dec === 2) reasons.push('O respondente é o decisor');
    if (['dono', 'gestor'].includes(a.cargo)) { pts += 1; }
    if (R.heavy(a)) { pts += 1; reasons.push('Frota pesada: ticket e dor maiores'); }
    if (a.maior_dor && a.maior_dor !== 'nenhuma') { pts += 1; }
    if (scores.global < 50) { pts += 1; reasons.push('Maturidade baixa: muito espaço para redução de gastos'); }
    if (R.usesSystem(a) && a.sistema_falta && a.sistema_falta !== 'nada') { pts += 1; reasons.push('Insatisfeito com o sistema atual (rota de troca)'); }
    if (a.motivo_agora === 'auditoria') { pts += 1; reasons.push('Pressão externa (auditoria ou cliente)'); }
    const temp = pts >= 9 ? 'hot' : pts >= 6 ? 'warm' : 'cold';
    return { pts, temp, reasons, label: { hot: 'Lead quente', warm: 'Lead morno', cold: 'Lead frio' }[temp] };
  }

  function activeRoutes(a) {
    const r = new Set();
    if (R.small(a)) r.add('Rota curta (1 a 5 veículos)');
    if (R.heavy(a)) r.add('Frota pesada');
    if (R.machines(a)) r.add('Máquinas e equipamentos');
    if (R.motos(a)) r.add('Motos');
    if (R.rented(a)) r.add('Frota locada');
    if (R.noOne(a)) r.add('Sem responsável: fundamentos');
    if (R.usesSystem(a)) r.add('Troca de sistema');
    if (R.manual(a)) r.add('Primeiro sistema');
    if (a.comb_controle === 'nenhum') r.add('Sem controle de combustível');
    if (a.man_tipo === 'corretiva') r.add('Manutenção corretiva');
    if (a.man_tipo === 'preventiva') r.add('Manutenção preventiva');
    if (a.multas_conhec === 'outro') r.add('Multas em outro departamento');
    if (a.uso_particular && a.uso_particular !== 'nao') r.add('Uso particular');
    if (R.fin(a)) r.add('Visão financeira');
    if (R.ops(a)) r.add('Visão operacional');
    return [...r];
  }

  function labelOf(qid, v) {
    const q = QUESTIONS.find(x => x.id === qid); if (!q) return v;
    if (q.type === 'text') return v;
    const arr = Array.isArray(v) ? v : [v];
    return arr.map(x => (q.options.find(o => o.v === x) || {}).label || x).join(', ');
  }

  // ---------- render ----------
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  function render() {
    const a = state.answers;
    const seq = buildSequence(a);
    if (state.pos >= seq.length) state.pos = seq.length - 1;
    const cur = seq[state.pos];
    const vis = visibleQuestions(a);
    const answeredCount = vis.filter(q => a[q.id] !== undefined && !(Array.isArray(a[q.id]) && !a[q.id].length)).length;
    const pct = cur.kind === 'result' ? 100 : Math.round((answeredCount / vis.length) * 100);

    let top = '';
    if (cur.kind !== 'welcome') {
      const label = cur.kind === 'result' ? 'Resultado do diagnóstico' : cur.kind === 'intro' ? 'Maturidade da gestão de frota' : 'Etapa ' + cur.step.num + ': ' + cur.step.title;
      top = `<header class="topbar"><div class="left"><button class="back" aria-label="Voltar" ${state.pos === 0 ? 'disabled' : ''} data-act="back">&larr;</button><div class="step-label">${esc(label)}</div></div><img class="logo" src="assets/logo-nextfleet.png" alt="NEXTfleet"></header><div class="progress"><i style="width:${pct}%"></i></div>`;
    }
    let body = '';
    if (cur.kind === 'welcome') body = renderWelcome(seq);
    else if (cur.kind === 'intro') body = renderIntro(cur, a);
    else if (cur.kind === 'question') body = renderQuestion(cur, a);
    else body = renderResult(a);

    $app.innerHTML = top + body + renderDev(seq, a);
    window.scrollTo({ top: 0 });
    bind();
  }

  function renderWelcome(seq) {
    const n = seq.filter(s => s.kind === 'question').length;
    return `<main class="screen welcome">
      <img class="logo-big" src="assets/logo-nextfleet.png" alt="NEXTfleet">
      <h1>Qual é o nível de <em>maturidade</em> da gestão da sua frota?</h1>
      <p>Em cerca de <b>8 minutos</b>, você descobre onde a sua operação está bem, onde o dinheiro está escapando e quais são os próximos passos.</p>
      <div class="pillars-row">${PILLARS.map(p => `<span class="chip">${esc(p.name)}</span>`).join('')}</div>
      <p style="font-size:14px;color:#8a93a3">As perguntas se adaptam ao seu tipo de frota. Nenhuma resposta é compartilhada sem o seu consentimento.</p>
      <div class="actions"><div class="inner"><button class="btn primary" data-act="next">Começar diagnóstico</button></div></div>
    </main>`;
  }

  function renderIntro(cur, a) {
    const steps = stepsVisible(a);
    const idx = steps.findIndex(s => s.id === cur.step.id);
    const dots = steps.map((s, i) => `<div class="dot ${i < idx ? 'done' : i === idx ? 'current' : ''}">${s.num}</div>`).join('');
    const minutes = Math.max(1, Math.round(cur.count * 12 / 60));
    return `<main class="screen intro">
      <div class="steps-dots">${dots}</div>
      <div class="hero">${ICONS[cur.step.icon] || ICONS.target}</div>
      <h2>Etapa ${cur.step.num}: ${esc(cur.step.title)}</h2>
      <p>${esc(cur.step.desc)}</p>
      <p class="time">${cur.count} pergunta${cur.count > 1 ? 's' : ''}, em torno de <b>${minutes} minuto${minutes > 1 ? 's' : ''}</b>.</p>
      <div class="actions"><div class="inner"><button class="btn primary" data-act="next">Vamos lá!</button></div></div>
    </main>`;
  }

  function renderQuestion(cur, a) {
    const q = cur.q; const v = a[q.id];
    let opts = '';
    if (q.type === 'text') {
      opts = `<input class="text-input" type="text" id="txt" placeholder="Digite aqui" value="${esc(v || '')}" autocomplete="off">`;
    } else {
      opts = `<div class="options">${q.options.map(o => {
        const sel = Array.isArray(v) ? v.includes(o.v) : v === o.v;
        return `<button class="opt ${q.type === 'multi' ? 'multi' : ''} ${sel ? 'selected' : ''}" data-act="choose" data-q="${q.id}" data-v="${esc(o.v)}">${esc(o.label)}</button>`;
      }).join('')}</div>`;
    }
    const needsBtn = q.type !== 'single';
    const canGo = q.type === 'text' ? true : Array.isArray(v) && v.length > 0;
    const pad = String(cur.idx).padStart(2, '0') + '/' + String(cur.total).padStart(2, '0');
    return `<main class="screen">
      <div class="counter">${pad}</div>
      <h1 class="q">${esc(q.text)}</h1>
      <p class="hint">${esc(q.hint || (q.type === 'single' ? 'Selecione apenas uma opção' : ''))}</p>
      ${opts}
      ${q.learn ? `<p class="learn"><a href="#" data-act="learn">Saiba mais</a>: ${esc(q.learn)}</p>` : ''}
      ${needsBtn ? `<div class="actions"><div class="inner"><button class="btn primary" data-act="next" ${canGo ? '' : 'disabled'}>${q.optional && !(v && v.length) ? 'Pular' : 'Continuar'}</button></div></div>` : ''}
    </main>`;
  }

  function renderResult(a) {
    const s = computeScores(a);
    const lvlIdx = LEVELS.indexOf(s.level);
    const found = FINDINGS.filter(f => f.when(a)).sort((x, y) => y.prio - x.prio);
    const risks = found.filter(f => f.kind === 'risk').slice(0, 3);
    const goods = found.filter(f => f.kind === 'good').slice(0, 1);
    const recPillars = [s.weak, s.secondWeak].filter(Boolean);
    const lead = leadScore(a, s);
    const routes = activeRoutes(a);

    const pillarRows = s.pillars.map(p => {
      if (p.score === null) return `<div class="pillar-row"><div class="name">${esc(p.name)}</div><div class="track"></div><div class="band" style="color:#b8bfcc">Não avaliado</div></div>`;
      const b = band(p.score);
      return `<div class="pillar-row"><div class="name">${esc(p.name)}</div><div class="track"><i class="${b.cls}" style="width:${p.score}%"></i></div><div class="band ${b.cls}">${b.name}</div></div>`;
    }).join('');

    const nextSteps = recPillars.map(p => {
      const mods = MODULES[p.id] || [];
      return `<div class="card"><h3>${esc(p.name)}: ${esc(band(p.score).name.toLowerCase())}</h3><p class="lead">${esc(pillarAdvice(p.id, a))}</p><div class="two" style="margin-top:12px">${mods.slice(0, 2).map(m => `<div class="module-card"><div class="head">${esc(m.name)}</div><div class="body">${esc(m.text)}</div></div>`).join('')}</div></div>`;
    }).join('');

    const strongMods = s.strong ? (MODULES[s.strong.id] || []).slice(0, 1) : [];

    return `<main class="screen result">
      <div class="hero-level">
        <div class="label">O nível de maturidade da sua operação é</div>
        <div class="level">${esc(s.level.name)}</div>
        <div class="bar"><i style="width:${s.global}%"></i></div>
        <div class="levels-scale">${LEVELS.map((l, i) => `<span style="${i === lvlIdx ? 'color:var(--nf-blue)' : ''}">${l.name}</span>`).join('')}</div>
        <div class="score">${s.global} de 100 pontos</div>
      </div>
      <div class="card"><h3>O que isso quer dizer?</h3><p class="lead">${esc(s.level.text)}</p></div>

      <div class="card"><h3>Sua performance em cada pilar</h3>${pillarRows}<div class="legend"><span class="bad">Frágil</span><span class="warn">Em evolução</span><span class="ok">Consolidado</span></div></div>

      <div class="two">
        <div class="card" style="margin:0"><h3 style="font-size:14px;color:#8a93a3;text-transform:uppercase;letter-spacing:.05em">Ponto forte</h3><div style="font-size:20px;font-weight:700;color:var(--nf-ok)">${s.strong ? esc(s.strong.name) : '-'}</div>${strongMods.length ? `<p class="lead" style="font-size:13px;margin-top:6px">Mantenha com o módulo <b>${esc(strongMods[0].name)}</b>.</p>` : ''}</div>
        <div class="card" style="margin:0"><h3 style="font-size:14px;color:#8a93a3;text-transform:uppercase;letter-spacing:.05em">Ponto mais frágil</h3><div style="font-size:20px;font-weight:700;color:var(--nf-bad)">${s.weak ? esc(s.weak.name) : '-'}</div><p class="lead" style="font-size:13px;margin-top:6px">É onde está a maior oportunidade de redução de gastos.</p></div>
      </div>

      <div class="card"><h3>O que encontramos nas suas respostas</h3>
        <ul class="findings">
          ${risks.map((f, i) => `<li><span class="n">${i + 1}</span><span>${esc(f.text(a))}</span></li>`).join('')}
          ${goods.map(f => `<li><span class="n good">&#10003;</span><span>${esc(f.text(a))}</span></li>`).join('')}
          ${!risks.length && !goods.length ? '<li><span class="n good">&#10003;</span><span>Não identificamos alertas críticos nas suas respostas.</span></li>' : ''}
        </ul>
      </div>

      <h3 style="margin:26px 0 4px;font-size:21px;text-align:center">Próximos passos para a sua frota</h3>
      <p style="text-align:center;color:#6b7383;margin:0 0 6px;font-size:14px">Começando pelos pilares mais frágeis</p>
      ${nextSteps}

      <div class="cta">
        <h3>Quer ver esses números na sua frota?</h3>
        <p>Um especialista NEXTfleet monta, em 30 minutos, uma simulação de redução de gastos com base neste diagnóstico.</p>
        <button class="btn primary" data-act="toast" data-msg="Protótipo: aqui abre o agendamento ou o WhatsApp do comercial">Falar com um especialista</button>
        <button class="btn ghost" data-act="toast" data-msg="Protótipo: aqui envia o relatório completo em PDF">Receber o relatório completo</button>
      </div>

      <details class="lead-sheet" ${state.showLead ? 'open' : ''} id="leadsheet">
        <summary><span>Ficha do lead (visão do comercial)</span><span class="tag">interno</span></summary>
        <h4>Temperatura</h4>
        <span class="temp ${lead.temp}">${esc(lead.label)} &middot; ${lead.pts} pts</span>
        <ul class="reasons">${lead.reasons.map(r => `<li>${esc(r)}</li>`).join('') || '<li>Sem sinais fortes de compra.</li>'}</ul>
        <h4>Perfil da frota</h4>
        <div class="kv">${['segmento', 'tamanho', 'composicao', 'propriedade', 'vinculo', 'abrangencia', 'cargo'].filter(k => a[k] !== undefined).map(k => `<div><b>${esc(QUESTIONS.find(q => q.id === k).text)}</b>${esc(labelOf(k, a[k]))}</div>`).join('')}</div>
        <h4>Rotas percorridas</h4>
        <div class="routes">${routes.map(r => `<span>${esc(r)}</span>`).join('') || '<span>Fluxo padrão</span>'}</div>
        <h4>Dores e momento de compra</h4>
        <div class="kv">${['maior_gasto', 'maior_dor', 'motivo_agora', 'prazo', 'decisor', 'sistema_nome', 'sistema_falta', 'tempo_consolidando'].filter(k => a[k] !== undefined && a[k] !== '').map(k => `<div><b>${esc(QUESTIONS.find(q => q.id === k).text)}</b>${esc(labelOf(k, a[k]))}</div>`).join('')}</div>
        <h4>Score por pilar</h4>
        <div class="kv">${s.pillars.map(p => `<div><b>${esc(p.name)}</b>${p.score === null ? 'Não avaliado' : p.score + ' / 100 · ' + band(p.score).name + ' (' + p.answered + ' resp.)'}</div>`).join('')}<div><b>Global</b>${s.global} / 100 · ${esc(s.level.name)}</div></div>
        <h4>Sugestão de abordagem</h4>
        <p style="font-size:14px;line-height:1.55;margin:0">${esc(approach(a, s, lead))}</p>
        <h4>Exportação (JSON)</h4>
        <pre class="json">${esc(JSON.stringify({ answers: a, scores: { global: s.global, level: s.level.name, pillars: Object.fromEntries(s.pillars.map(p => [p.id, p.score])) }, lead: { temp: lead.temp, pts: lead.pts }, routes }, null, 2))}</pre>
      </details>

      <p class="footer-note">Protótipo de validação · <img src="assets/logo-nextfleet.png" alt="NEXTfleet"> · tecnologia · software · gestão · frotas</p>
      <div style="display:flex;justify-content:center;margin-top:14px"><button class="btn ghost sm" data-act="restart">Refazer o diagnóstico</button></div>
    </main>`;
  }

  function pillarAdvice(id, a) {
    const t = {
      gestao: R.manual(a) ? 'O controle em planilha ou papel custa tempo e esconde erros. O primeiro ganho é centralizar fornecedores e custos por veículo em um só lugar.' : R.noOne(a) ? 'Defina um responsável pela frota e um fechamento mensal simples. A ferramenta vem depois do processo.' : 'Padronize indicadores (custo por km e por veículo) e feche os custos todo mês para enxergar a tendência.',
      combustivel: a.comb_controle === 'nenhum' ? 'Comece registrando cada abastecimento por veículo. Em poucas semanas aparece o consumo real e os desvios.' : 'Passe do controle de gasto para o controle de consumo por veículo e condutor, com alertas de abastecimento fora do padrão.',
      manutencao: R.rented(a) ? 'Acompanhe SLA, cobranças extras e dias parados por veículo locado. É onde o contrato costuma custar mais do que parece.' : 'Crie planos de preventiva por quilometragem ou tempo, com alerta automático, e registre o checklist de saída pelo app.',
      compliance: 'Centralize multas, indicação de condutor e vencimentos de documentos com alertas. Cada prazo perdido é custo direto e risco jurídico.',
      motoristas: 'Vincule condutor e veículo, acompanhe comportamento ao volante e dê feedback com base em dados, não em reclamação.',
    };
    return t[id] || '';
  }
  function approach(a, s, lead) {
    const dor = labelOf('maior_dor', a.maior_dor || 'nenhuma');
    const weak = s.weak ? s.weak.name.toLowerCase() : 'gestão';
    const gasto = a.maior_gasto ? labelOf('maior_gasto', a.maior_gasto).toLowerCase() : 'custos';
    let txt = `Abrir a conversa pela dor declarada ("${dor}") e pelo pilar mais frágil (${weak}). O maior gasto citado é ${gasto}: usar como base da simulação de economia.`;
    if (R.usesSystem(a)) txt += ' Lead já usa sistema: posicionar como complemento ou substituição, focando no que falta hoje (' + labelOf('sistema_falta', a.sistema_falta || 'nada').toLowerCase() + ').';
    else if (R.manual(a)) txt += ' Lead controla em planilha: mostrar o tempo recuperado e os erros evitados com a centralização.';
    if (R.rented(a)) txt += ' Frota locada: trazer o caso de gestão de contratos com locadoras.';
    if (R.heavy(a)) txt += ' Frota pesada: pneus, jornada e combustível pesam mais no ticket.';
    if (lead.temp === 'hot') txt += ' Prioridade alta: agendar reunião em até 48 horas.';
    return txt;
  }

  // ---------- painel de validação ----------
  function renderDev(seq, a) {
    const list = QUESTIONS.map(q => {
      const vis = isVisible(q, a); const ans = a[q.id] !== undefined && !(Array.isArray(a[q.id]) && !a[q.id].length);
      return `<button class="${!vis ? 'hidden' : ans ? 'answered' : ''}" data-act="jump" data-key="q:${q.id}" ${!vis ? 'disabled' : ''}>${q.id}${q.route ? ' · ' + esc(q.route) : ''}</button>`;
    }).join('');
    const routes = activeRoutes(a);
    return `<button class="devbtn" data-act="dev">Validação</button>
    <div class="devpanel ${state.devOpen ? 'open' : ''}">
      <h5>Personas (preenchem tudo e vão ao resultado)</h5>
      <div class="row">${Object.keys(PERSONAS).map(p => `<button class="mini" data-act="persona" data-p="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      <h5>Ações</h5>
      <div class="row"><button class="mini" data-act="jump" data-key="welcome">Início</button><button class="mini" data-act="jump" data-key="result">Resultado</button><button class="mini" data-act="restart">Limpar respostas</button></div>
      <h5>Rotas ativas</h5>
      <div class="row">${routes.map(r => `<span class="chip">${esc(r)}</span>`).join('') || '<span class="chip">Fluxo padrão</span>'}</div>
      <h5>Perguntas (${visibleQuestions(a).length} visíveis de ${QUESTIONS.length}) · riscadas = fora da rota</h5>
      <div class="qlist">${list}</div>
    </div>`;
  }

  // ---------- eventos ----------
  function toast(msg) { $toast.textContent = msg; $toast.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $toast.classList.remove('show'), 2600); }

  function bind() {
    $app.querySelectorAll('[data-act]').forEach(el => {
      el.addEventListener('click', ev => {
        const act = el.dataset.act;
        if (act === 'learn') { ev.preventDefault(); return; }
        if (act === 'next') return go(+1);
        if (act === 'back') return go(-1);
        if (act === 'choose') return choose(el.dataset.q, el.dataset.v);
        if (act === 'restart') { state.answers = {}; state.pos = 0; return render(); }
        if (act === 'toast') return toast(el.dataset.msg);
        if (act === 'dev') { state.devOpen = !state.devOpen; return render(); }
        if (act === 'jump') return jump(el.dataset.key);
        if (act === 'persona') { state.answers = JSON.parse(JSON.stringify(PERSONAS[el.dataset.p])); state.showLead = true; return jump('result'); }
      });
    });
    const txt = $app.querySelector('#txt');
    if (txt) {
      txt.focus();
      txt.addEventListener('input', () => { const seq = buildSequence(state.answers); const cur = seq[state.pos]; state.answers[cur.q.id] = txt.value; });
      txt.addEventListener('keydown', e => { if (e.key === 'Enter') go(+1); });
    }
    const ls = $app.querySelector('#leadsheet');
    if (ls) ls.addEventListener('toggle', () => { state.showLead = ls.open; });
  }

  function choose(qid, v) {
    const q = QUESTIONS.find(x => x.id === qid);
    if (q.type === 'multi') {
      let arr = Array.isArray(state.answers[qid]) ? state.answers[qid].slice() : [];
      const opt = q.options.find(o => o.v === v);
      if (arr.includes(v)) arr = arr.filter(x => x !== v);
      else if (opt && opt.exclusive) arr = [v];
      else arr = arr.filter(x => !(q.options.find(o => o.v === x) || {}).exclusive).concat(v);
      state.answers[qid] = arr;
      // respostas de perguntas que deixaram de ser visíveis são mantidas, mas ignoradas na pontuação
      return render();
    }
    state.answers[qid] = v;
    // feedback visual breve e avanço automático (como no fluxo do concorrente)
    $app.querySelectorAll('.opt').forEach(o => o.classList.toggle('selected', o.dataset.v === v));
    setTimeout(() => go(+1), 220);
  }

  function go(delta) {
    const seq = buildSequence(state.answers);
    const cur = seq[state.pos];
    if (delta > 0 && cur.kind === 'question' && cur.q.type !== 'text' && !cur.q.optional) {
      const v = state.answers[cur.q.id];
      if (v === undefined || (Array.isArray(v) && !v.length)) return;
    }
    state.pos = Math.max(0, Math.min(seq.length - 1, state.pos + delta));
    render();
  }
  function jump(key) {
    const seq = buildSequence(state.answers);
    const i = seq.findIndex(s => s.key === key);
    if (i >= 0) { state.pos = i; state.devOpen = false; render(); }
  }

  render();
})();
