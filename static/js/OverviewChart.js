const OverviewChart = {
    props: ['labels', 'datasets', 'options', 'isLoading', 'chartId'],
    mounted() {
        if (!this.isLoading) {
            const ctx = document.getElementById(this.chartId);
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.labels,
                    datasets: this.datasets,
                },
                options: this.options,
            });
            window.OverviewChart = chart;
        }
    },
    template: `
        <div class="position-relative" style="height: 300px">
            <div class="layout-spinner" v-if="isLoading">
                <div class="spinner-centered">
                    <i class="spinner-loader__32x32"></i>
                </div>
            </div>
            <canvas :id="chartId" style="height: 300px; width: 100%"></canvas>
        </div>
    `
}
