// Dados dos gráficos
const chartData = {
    year: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        data: [1200, 1900, 1700, 2100, 2300, 2500, 2200, 2400, 2600, 2800, 3000, 3200],
        label: 'Visualizações Anuais'
    },
    month: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        data: [800, 950, 1100, 850],
        label: 'Visualizações Mensais'
    },
    week: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        data: [150, 220, 180, 250, 200, 300, 280],
        label: 'Visualizações Semanais'
    }
};

let mainChart; // Variável para armazenar o gráfico principal

function initializeDashboard() {
    // Inicializa o gráfico principal
    initMainChart();
    
    // Inicializa os gráficos secundários
    initSecondaryCharts();
    
    // Configura os eventos dos filtros
    setupFilterEvents();
}

function initMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.year.labels,
            datasets: [{
                label: chartData.year.label,
                data: chartData.year.data,
                borderColor: '#2c3e50',
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }]
        },
        options: getChartOptions()
    });
}

function initSecondaryCharts() {
    // Gráfico de capítulos mensais
    new Chart(
        document.getElementById('monthlyChaptersChart').getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                datasets: [{
                    data: [8, 12, 14, 6],
                    backgroundColor: '#3498db'
                }]
            },
            options: getMiniChartOptions()
        }
    );

    // Gráfico de capítulos semanais
    new Chart(
        document.getElementById('weeklyChaptersChart').getContext('2d'),
        {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    data: [1, 2, 1, 3, 0, 1, 1],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: getMiniChartOptions()
        }
    );
}

function setupFilterEvents() {
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', function() {
            // Atualiza o filtro ativo
            document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Obtém o período selecionado
            const period = this.dataset.period;
            
            // Atualiza o gráfico principal
            updateMainChart(period);
        });
    });
}

function updateMainChart(period) {
    const data = chartData[period];
    
    mainChart.data.labels = data.labels;
    mainChart.data.datasets[0].data = data.data;
    mainChart.data.datasets[0].label = data.label;
    mainChart.update();
}

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
}

function getMiniChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { display: false },
            x: { display: false }
        },
        plugins: {
            legend: { display: false }
        }
    };
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeDashboard);