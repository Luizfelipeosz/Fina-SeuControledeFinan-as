    // Função para pegar transações do localStorage (espera um array de objetos: {description, amount, date, category})
    function getTransactions() {
      try {
        const raw = localStorage.getItem('transactions') || localStorage.getItem('fina_transactions') || null;
        if (!raw) return sampleData();
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return sampleData();
        return parsed.map(t => ({
          description: t.description || t.desc || '—',
          amount: Number(t.amount ?? t.value ?? 0),
          date: t.date || t.createdAt || new Date().toISOString().slice(0,10),
          category: t.category || t.type || (Number(t.amount) < 0 ? 'Saída' : 'Entrada')
        }));
      } catch (e) {
        console.warn('Erro ao ler transações, usando dados de exemplo', e);
        return sampleData();
      }
    }

    function sampleData(){
      // dados exemplo para demonstrar os gráficos
      return [
        { description: 'Supermercado', amount: -120.45, date: '2025-10-02', category: 'Alimentação' },
        { description: 'Salário', amount: 3500.00, date: '2025-10-01', category: 'Renda' },
        { description: 'Combustível', amount: -180.00, date: '2025-09-22', category: 'Transporte' },
        { description: 'Aluguel', amount: -900.00, date: '2025-09-05', category: 'Moradia' },
        { description: 'Netflix', amount: -29.90, date: '2025-10-15', category: 'Assinaturas' },
        { description: 'Jantar', amount: -75.00, date: '2025-08-11', category: 'Alimentação' },
        { description: 'Freelance', amount: 600.00, date: '2025-08-28', category: 'Renda' }
      ];
    }

    // util: agrupar por categoria
    function groupByCategory(transactions){
      const sums = {};
      transactions.forEach(t => {
        const cat = t.category || 'Outros';
        sums[cat] = (sums[cat] || 0) + (Number(t.amount) || 0);
      });
      return sums;
    }

    // util: agrupar por mês-ano (YYYY-MM)
    function groupByMonth(transactions){
      const sums = {};
      transactions.forEach(t => {
        const month = (t.date || '').slice(0,7) || new Date().toISOString().slice(0,7);
        sums[month] = (sums[month] || 0) + (Number(t.amount) || 0);
      });
      return sums;
    }

    // criar/atualizar gráficos
    let pieChart, barChart;
    function renderCharts(filtered){
      const catSums = groupByCategory(filtered);
      const months = Object.keys(groupByMonth(filtered)).sort();

      const pieLabels = Object.keys(catSums);
      const pieData = pieLabels.map(l => Math.abs(Math.round((catSums[l] + Number.EPSILON) * 100) / 100));

      const barLabels = months;
      const barData = months.map(m => Math.round((groupByMonth(filtered)[m] + Number.EPSILON) * 100) / 100);

      // destruir se já existente
      if (pieChart) pieChart.destroy();
      if (barChart) barChart.destroy();

      const pieCtx = document.getElementById('pieChart');
      pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: { labels: pieLabels, datasets: [{ data: pieData }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });

      const barCtx = document.getElementById('barChart');
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: { labels: barLabels, datasets: [{ label: 'Total (R$)', data: barData }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      });

      renderSummaryList(filtered, catSums);
    }

    function renderSummaryList(transactions, catSums){
      const list = document.getElementById('summary-list');
      list.innerHTML = '';
      const total = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
      const totalEl = document.createElement('div');
      totalEl.style.marginBottom = '8px';
      totalEl.innerHTML = `<strong>Total (filtrado):</strong> R$ ${total.toFixed(2)}`;
      list.appendChild(totalEl);

      const ul = document.createElement('ul');
      ul.style.paddingLeft = '18px';
      Object.keys(catSums).forEach(cat => {
        const li = document.createElement('li');
        li.textContent = `${cat}: R$ ${catSums[cat].toFixed(2)}`;
        ul.appendChild(li);
      });
      list.appendChild(ul);
    }

    // aplicar filtro de datas
    function applyFilters(transactions){
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      let filtered = transactions.slice();
      if (from) filtered = filtered.filter(t => (t.date || '').slice(0,10) >= from);
      if (to) filtered = filtered.filter(t => (t.date || '').slice(0,10) <= to);
      return filtered;
    }

    // evento: atualizar
    document.getElementById('refresh').addEventListener('click', () => {
      const tx = getTransactions();
      const filtered = applyFilters(tx);
      renderCharts(filtered);
    });

    // evento: exportar PNG (exporta o conjunto atual de canvas em sequência)
    document.getElementById('download-png').addEventListener('click', async () => {
      // cria imagem única juntando os dois canvas (simples)
      const c1 = document.getElementById('pieChart');
      const c2 = document.getElementById('barChart');
      const width = Math.max(c1.width, c2.width);
      const height = c1.height + c2.height + 40;
      const tmp = document.createElement('canvas');
      tmp.width = width;
      tmp.height = height;
      const ctx = tmp.getContext('2d');
      // fundo
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,width,height);
      ctx.drawImage(c1, 0, 0, width, c1.height);
      ctx.drawImage(c2, 0, c1.height + 20, width, c2.height);
      const dataURL = tmp.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL; a.download = `relatorio_fina_${new Date().toISOString().slice(0,10)}.png`;
      document.body.appendChild(a); a.click(); a.remove();
    });

    // inicialização automática
    (function init(){
      const tx = getTransactions();
      // define datas min/max nos inputs para facilitar filtro
      const dates = tx.map(t => t.date ? t.date.slice(0,10) : null).filter(Boolean).sort();
      if (dates.length){
        document.getElementById('from').min = dates[0];
        document.getElementById('from').max = dates[dates.length-1];
        document.getElementById('to').min = dates[0];
        document.getElementById('to').max = dates[dates.length-1];
      }
      renderCharts(tx);
    })();
  // Redireciona para fina.html ao clicar no botão "Voltar"
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "fina.html";
  });
