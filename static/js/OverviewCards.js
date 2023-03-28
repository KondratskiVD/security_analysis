// const severityOptions = [
//     {name: 'critical', className: 'colored-select-red'},
//     {name: 'high', className: 'colored-select-orange'},
//     {name: 'medium', className: 'colored-select-yellow'},
//     {name: 'low', className: 'colored-select-green'},
//     {name: 'info', className: 'colored-select-blue'},
// ]

// const statusOptions = [
//     {name: 'valid', className: 'colored-select-red'},
//     {name: 'false positive', className: 'colored-select-blue'},
//     {name: 'ignored', className: 'colored-select-darkblue'},
//     {name: 'not defined', className: 'colored-select-notdefined'},
// ]


const OverviewTableCards = {
    props: ["reports", "healthColor"],
    mounted() {
        this.url = this.table_url_base

        $(() => {
            $(this.$refs.table).on('all.bs.table', function (e) {
                $('.selectpicker').selectpicker('render')
                initColoredSelect()
            })
            // this.rerender()
        })

        // this.register_formatters()
        console.debug('TableCardFindings mounted', {refs: this.$refs, props: this.$props})
    },
    data() {
        return {
            ...TableCard.data(),
            url: undefined,
            health: null,
            cardInfo: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                info: 0,
            },

            // tableData,
        }
    },
    methods: {
        countCardsInfo(reports) {
            return reports.reduce((acc, report) => {
                acc.critical += report.critical;
                acc.high += report.high;
                acc.medium += report.medium;
                acc.low += report.low;
                acc.info += report.info;
                return acc;
            }, {critical: 0, high: 0, medium: 0, low: 0, info: 0})
        },
         getHealth(color) {
            switch (color) {
                case 'green':
                    return {
                        color: 'card-health__green',
                        icon: 'icon-health__green'
                    }
                case 'amber':
                    return {
                        color: 'card-health__amber',
                        icon: 'icon-health__amber'
                    }
                case 'red':
                    return {
                        color: 'card-health__red',
                        icon: 'icon-health__red'
                    }
                case 'grey':
                    return {
                        color: 'card-health__grey',
                        icon: 'icon-health__grey'
                    }
                default:
                    return null
            }
        },
    },
    watch: {
        reports: {
            handler: function (newValue, oldValue) {
                if (newValue) {
                    this.cardInfo = this.countCardsInfo(this.reports)
                }
            },
            deep: true

        },
        healthColor: {
             handler: function (newValue, oldValue) {
                if (newValue) {
                    this.health = this.getHealth(newValue)
                }
            },
            deep: true
        }

    },
    template: `
    <div class="d-grid grid-column-6 gap-3 mt-3 colorful-cards">
        <div class="card card-sm card-health" :class="health.color" v-if="health">
            <div class="card-header">
                <i class="icon-health" :class="health.icon"></i>
            </div>
            <div class="card-body">HEALTH</div>
        </div>
        <div class="card card-sm card-red">
            <div class="card-header">
                <span>
                    {{ cardInfo.critical }}
                </span>
            </div>
            <div class="card-body"> critical </div>
        </div>
        <div class="card card-sm card-orange">
            <div class="card-header">
                <span>
                    {{ cardInfo.high }}
                </span>
            </div>
            <div class="card-body">high</div>
        </div>
         <div class="card card-sm card-yellow">
            <div class="card-header">
                <span>
                      {{ cardInfo.medium }}
                </span>
            </div>
            <div class="card-body">medium</div>
        </div>
        <div class="card card-sm card-green">
            <div class="card-header">
                <span>
                      {{ cardInfo.low }}
                </span>
            </div>
            <div class="card-body">low</div>
        </div>
        <div class="card card-sm card-blue">
            <div class="card-header">
                <span>
                      {{ cardInfo.info }}
                </span>
            </div>
            <div class="card-body">info</div>
        </div>
</div>

`

}

register_component('overview-table-cards', OverviewTableCards)

