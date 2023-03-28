const OverviewPage = {
    components: {
        'overview-table-cards': OverviewTableCards,
        'overview-chart': OverviewChart,
        'overview-filter': OverviewFilter
    }, mounted() {
        ApiFetchReports().then(data => {
            this.healthColor = data.application.health
            this.applicationReports = data.application.reports
            $('#table_reports_overview').bootstrapTable('load', this.applicationReports);
        })
         ApiFetchTests().then(data => {
            this.securityTests = data
            $('#table_tests_overview').bootstrapTable('load', this.securityTests);
        })
    }, data() {
        return {
            applicationReports: null,
            securityTests: null,
            healthColor: null,
            reports_table_params: {
                id: 'table_reports_overview',
                'data-height': '247',
                'data-side-pagination': true,
                'data-pagination': false,
            }, tests_table_params: {
                'data-height': '247',
                id: 'table_tests_overview',
                'data-pagination': false,
                'data-unique-id': 'uid',
            },
            isLoading: true,
            chartLineOptions,
            chartLineDatasets: [],
            labels: null,
        }

    }, watch: {
        applicationReports(newValue) {
            if (newValue.length > 0) {
                this.isLoading = false
                this.generateDataset(newValue)
            }
        }
    }, methods: {
        generateDataset(reports) {
            const lineDatasets = [{
                data: null,
                label: 'number of runs',
                // borderWidth: 2,
                // borderColor: 'rgb(75, 192, 192)',
                // backgroundColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                borderWidth: 4,
                borderColor: '#5e72e4',
                backgroundColor: 'transparent',
                borderCapStyle: 'rounded',
                fill: false,
            }];
            let occurrences = {}
            reports.forEach((result) => {
                const startDate = result.start_date.split('T')[0]
                if (occurrences[startDate] === undefined) {
                    occurrences[startDate] = 1
                } else {
                    occurrences[startDate] += 1
                }
            });
            console.log(occurrences)
            this.labels = Object.keys(occurrences).reverse();
            lineDatasets[0].data = Object.values(occurrences).reverse();
            this.chartLineDatasets = lineDatasets;

        }
    },

    template: `
    <div class="p-3">
    <div class="card">
        <div class="card-header">
            <h3>Summary</h3>
        </div>
        <div class="card-body d-flex flex-column">
        <overview-filter
        :data="securityTests"
        >
        </overview-filter>
         <overview-table-cards
            v-bind:reports="applicationReports"
            v-bind:healthColor="healthColor"
            >
         </overview-table-cards>
         
        </div>
    </div>
    
    <div class="card mt-3 p-28">
        <div class="header">
            <h4 class="font-bold">Scans frequency</h4>
        </div>
            <div>
                <overview-chart
                    :key="isLoading"
                    :is-loading="isLoading"
                    chart-id="chartScansFrequency"
                    :options="chartLineOptions"
                    :datasets="chartLineDatasets"
                    :labels="labels">
                </overview-chart>
            </div>
    </div>
    
    <div class="flex-container">
        <div class="flex-item-2">
        <TableCard
                @register="$root.register"
                instance_name="table_tests_overview"
                header='Tests'
                :table_attributes="tests_table_params"
                :show-custom-count="true"
                container_classes="my-3"
                class="table-scroll"
                :adaptive-height="true"
            >
                <template #actions="{master}">
                <div class="form-group text-right mb-0">
                    <div class="dropdown dropdown_action">
                        <button class="btn btn-secondary btn-icon btn-icon__purple mr-2"
                                role="button"
                                id="dropdownMenuActionSm"
                                data-toggle="dropdown"
                                aria-expanded="false">
                            <i class="icon__18x18 icon-create-element"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuActionSm">
                            <li class="px-3 py-1 font-weight-bold">Create Test</li>
                            <li class="dropdown-item">
                                <span class="pl-2" data-toggle="modal" data-target="#create_backend_modal_overview">
                                    Application
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                </template>
                <template #table_headers="{master}">
                    <th scope="col" data-sortable="true"
                        data-cell-style="test_formatters.name_style"
                        data-field="name"
                    >
                        Name
                    </th>
                    <th scope="col" data-sortable="true"
                        data-cell-style="test_formatters.name_style"
                        data-field="test_type"
                    >
                        Group
                    </th>
                    <th scope="col" data-align="right"
                        data-cell-style="test_formatters.cell_style"
                        data-formatter=test_formatters.actions
                        data-events="test_formatters.action_events"
                    >
                        Actions
                    </th>
                </template>
            </TableCard>
        </div>
        <div class="flex-item-2">
            <TableCard
                @register="$root.register"
                instance_name="table_reports_overview"
                header='Latest reports'
                :table_attributes="reports_table_params"
                container_classes="my-3"
                :show-custom-count="true"
                class="table-scroll"
                :adaptive-height="true"
            >
                <template #actions="{master}">
                <div class="form-group text-right mb-0">
                    <button type="button" class="btn btn-secondary btn-icon btn-icon__purple mr-2" 
                        @click="master.table_action('refresh')">
                    <i class="fas fa-sync"></i>
                </button>
                </div>
                </template>
                <template #table_headers="{master}">
                    <th scope="col" data-checkbox="true"></th>
                    <th data-visible="false" data-field="id">index</th>
                    <th scope="col" data-sortable="true" data-field="name"
                        data-formatter="report_formatters.name"
                    >
                        Name
                    </th>
                    <th scope="col" data-sortable="true" data-field="start_date"
                        data-formatter="report_formatters.start"
                    >
                        Start
                    </th>
                    <th scope="col" data-sortable="true" data-field="test_status"
                        data-align="right"
                         data-formatter="report_formatters.full_status"
                    >
                        Status
                    </th>
                </template>
            </TableCard>
        </div>
    </div>
</div>
    `
}
register_component("OverviewPage", OverviewPage)
