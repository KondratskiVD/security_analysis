const OverviewFilterTime = {
    data() {
        return {
            start_time: 'last_week',
        }
    },
    mounted() {
        $('#timeFilter').on('change', (e) => {
            this.start_time = e.target.value;
            this.$emit('change-filter', this.timeframe());
        })
    },
    methods: {
        refresh_pickers() {
            $(this.$el).find('.selectpicker').selectpicker('redner').selectpicker('refresh')
        },
        timeframe() {
            let d = new Date()
            d.setUTCHours(0, 0, 0, 0)
            switch (this.start_time) {
                case 'yesterday':
                    d.setUTCDate(d.getUTCDate() - 1)
                    return {start_time: d.toISOString()}
                    break
                case 'last_week':
                    d.setUTCDate(d.getUTCDate() - 7)
                    return {start_time: d.toISOString()}
                    break
                case 'last_month':
                    d.setUTCMonth(d.getUTCMonth() - 1)
                    return {start_time: d.toISOString()}
                    break
                case 'all':
                    return {}
                    break
                default:
                    return { start_time: this.start_time }
            }
        },
    },
    template: `
        <div class="selectpicker-titled">
            <span class="font-h6 font-semibold px-3 item__left fa fa-calendar"></span>
            <select class="selectpicker flex-grow-1" data-style="item__right" id="timeFilter"
                v-model="start_time">
                <option value="all">All</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
            </select>
        </div>
    `
}

register_component('OverviewFilterTime', OverviewFilterTime)
