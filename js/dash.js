/**
 * Dashboard Controller - Ordem KOC
 * Controle completo de gráficos e estatísticas
 * Versão 2.1 - Compatível com carregamento dinâmico
 */

// =============================================
// CONFIGURAÇÕES GLOBAIS
// =============================================
const DASHBOARD_CONFIG = {
    colors: {
        primary: '#3498db',
        secondary: '#2ecc71',
        accent: '#e74c3c',
        background: 'rgba(44, 62, 80, 0.2)',
        text: '#ffffff'
    },
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    }
};

// =============================================
// DADOS DOS GRÁFICOS (Pode ser substituído por API)
// =============================================
const chartData = {
    views: {
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
    },
    chapters: {
        lastMonth: [8, 12, 14, 6],
        lastWeek: [1, 2, 1, 3, 0, 1, 1]
    }
};

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================
let mainChart;
let isLoading = false;

// =============================================
// FUNÇÃO DE INICIALIZAÇÃO (Ponto de entrada)
// =============================================
function initDashboard() {
    if (!checkRequiredElements()) {
        showError('Elementos do dashboard não encontrados');
        return;
    }

    if (typeof Chart === 'undefined') {
        loadChartJS()
            .then(initializeDashboard)
            .catch(err => showError('Falha ao carregar gráficos'));
    } else {
        initializeDashboard();
    }
}

// =============================================
// FUNÇÕES PRINCIPAIS
// =============================================
function initializeDashboard() {
    showLoading(true);
    
    try {
        // Inicializa gráficos
        initMainChart();
        initMiniCharts();
        
        // Configura interações
        setupEventListeners();
        updateStatsCards();
        
        // Atualiza UI
        showLoading(false);
        setActiveFilter('year'); // Filtro padrão
        
    } catch (error) {
        console.error('Erro na inicialização:', error);
        showError('Erro ao carregar dados');
        showLoading(false);
    }
}

function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    mainChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: chartData.views.year.labels,
            datasets: [{
                label: chartData.views.year.label,
                data: chartData.views.year.data,
                borderColor: DASHBOARD_CONFIG.colors.primary,
                backgroundColor: DASHBOARD_CONFIG.colors.background,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#fff'
            }]
        },
        options: getMainChartOptions()
    });
}

function initMiniCharts() {
    // Gráfico de capítulos mensais
    createMiniChart(
        'monthlyChaptersChart',
        'bar',
        chartData.chapters.lastMonth,
        DASHBOARD_CONFIG.colors.secondary
    );

    // Gráfico de capítulos semanais
    createMiniChart(
        'weeklyChaptersChart',
        'bar',
        chartData.chapters.lastWeek,
        DASHBOARD_CONFIG.colors.accent
    );
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================
function createMiniChart(elementId, type, data, color) {
    const ctx = document.getElementById(elementId);
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: type,
        data: {
            labels: type === 'bar' && data.length === 4 ? 
                ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'] : 
                ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        },
        options: getMiniChartOptions()
    });
}

function updateMainChart(period) {
    if (!mainChart || !chartData.views[period]) return;

    const data = chartData.views[period];
    
    mainChart.data.labels = data.labels;
    mainChart.data.datasets[0].data = data.data;
    mainChart.data.datasets[0].label = data.label;
    mainChart.update();
}

function updateStatsCards() {
    const stats = {
        users: 1254,
        views: 3200,
        chapters: 42,
        books: 18
    };

    Object.keys(stats).forEach(key => {
        const element = document.querySelector(`.stat-card[data-type="${key}"] .stat-value`);
        if (element) {
            animateValue(element, 0, stats[key], 1000);
        }
    });
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// =============================================
// CONFIGURAÇÕES DOS GRÁFICOS
// =============================================
function getMainChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: DASHBOARD_CONFIG.colors.text,
                    font: {
                        size: 14,
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: DASHBOARD_CONFIG.colors.primary,
                bodyColor: DASHBOARD_CONFIG.colors.text,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        animation: {
            duration: DASHBOARD_CONFIG.animation.duration,
            easing: DASHBOARD_CONFIG.animation.easing
        }
    };
}

function getMiniChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: true
            }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };
}

// =============================================
// MANIPULAÇÃO DE EVENTOS
// =============================================
function setupEventListeners() {
    // Filtros
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            if (isLoading) return;
            
            const period = this.dataset.period;
            setActiveFilter(period);
            updateMainChart(period);
        });
    });

    // Redimensionamento
    window.addEventListener('resize', throttle(() => {
        if (mainChart) {
            mainChart.resize();
        }
    }, 200));
}

function setActiveFilter(period) {
    document.querySelectorAll('.filter').forEach(filter => {
        filter.classList.toggle('active', filter.dataset.period === period);
    });
}

// =============================================
// UTILITÁRIOS
// =============================================
function loadChartJS() {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function checkRequiredElements() {
    const elements = [
        'mainChart',
        'monthlyChaptersChart',
        'weeklyChaptersChart'
    ];
    return elements.every(id => document.getElementById(id));
}

function showLoading(show) {
    isLoading = show;
    const loader = document.querySelector('.loading-state');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

function showError(message) {
    const errorContainer = document.querySelector('.dashboard-error');
    if (errorContainer) {
        errorContainer.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <h3>Erro no Dashboard</h3>
            <p>${message}</p>
            <button class="retry-btn" onclick="initDashboard()">
                <i class="fas fa-sync-alt"></i> Tentar novamente
            </button>
        `;
        errorContainer.style.display = 'block';
    }
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// =============================================
// INICIALIZAÇÃO
// =============================================
// Para carregamento dinâmico
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDashboard };
} else {
    // Auto-inicialização quando adicionado via script
    document.addEventListener('DOMContentLoaded', initDashboard);
    // Permite reinicialização manual
    window.initDashboard = initDashboard;
}