const OverviewFilter = {
    props: ['data'],
    data() {
        return {
            is_loading: false,
            groups: [],
            selected_groups: [],
            tests: [],
            selected_tests: [],
            test_types: [],
            selected_test_types: [],
            test_envs: [],
            selected_test_envs: [],
            selected_metric_ui: 'total',
            start_time: 'last_week',
            end_time: undefined,
            selected_filters: [],
        }
    },
    async mounted() {
    },
    watch: {
        data(newValue) {
            console.log(newValue.length)
            this.groups = Array.from(newValue.reduce((accum, item) => accum.add(item.test_type), new Set()))
            this.selected_groups = newValue.length > 0 ? ['all'] : []
            this.$nextTick(this.refresh_pickers)
        },
        selected_groups(newValue, oldValue) {
            // handle select all
            if (newValue.includes('all') && !oldValue.includes('all')) {
                this.selected_groups = ['all']
                return
            } else if (newValue.includes('all') && newValue.length > 1) {
                newValue.splice(newValue.indexOf('all'), 1)
            }
        },
        start_time() {
             ApiFetchReports(this.timeframe).then(data => {
                 console.log(data)
            this.healthColor = data.application.health
            this.applicationReports = data.application.reports
            $('#table_reports_overview').bootstrapTable('load', this.applicationReports);
        })
        },
    },
    methods: {
        refresh_pickers() {
            $(this.$el).find('.selectpicker').selectpicker('redner').selectpicker('refresh')
        },

    },
    computed: {
        filtered_tests() {
            return this.all_data.filter(i => {
                return (this.selected_groups.includes('all') || this.selected_groups.includes(i.group))
            })
        },

        timeframe() {
            let d = new Date()
            d.setUTCHours(0, 0, 0, 0)
            switch (this.start_time) {
                case 'yesterday':
                    this.end_time = undefined
                    d.setUTCDate(d.getUTCDate() - 1)
                    return {start_time: d.toISOString()}
                    break
                case 'last_week':
                    this.end_time = undefined
                    d.setUTCDate(d.getUTCDate() - 7)
                    return {start_time: d.toISOString()}
                    break
                case 'last_month':
                    this.end_time = undefined
                    d.setUTCMonth(d.getUTCMonth() - 1)
                    return {start_time: d.toISOString()}
                    break
                case 'all':
                    this.end_time = undefined
                    return {}
                    break
                default: // e.g. if start time is from timepicker
                    return {start_time: this.start_time, end_time: this.end_time}
            }
        },
    },
    template: `
<div>
    <div class="d-flex flex-wrap filter-container">
        <div class="selectpicker-titled">
            <span class="font-h6 font-semibold px-3 item__left text-uppercase">group</span>
            <select class="selectpicker flex-grow-1" data-style="item__right"
                multiple
                v-model="selected_groups"
            >
                <option value="all" v-if="groups.length > 0">All</option>
                <option v-for="i in groups" :value="i" :key="i">{{ i }}</option>
            </select>
        </div>
        
        <div class="selectpicker-titled">
            <span class="font-h6 font-semibold px-3 item__left fa fa-calendar"></span>
            <select class="selectpicker flex-grow-1" data-style="item__right"
                v-model="start_time"
            >
                <option value="all">All</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
            </select>
        </div>


    </div>
</div>
    `
}

register_component('OverviewFilter', OverviewFilter)
