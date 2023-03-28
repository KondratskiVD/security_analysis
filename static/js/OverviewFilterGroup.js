const OverviewFilterGroup = {
    props: ['filterGroups'],
    data() {
        return {
            refSearchId: 'refSearchCbx'+Math.round(Math.random() * 1000),
            selectedItems: {},
            closeOnItem: true,
            computedItems: {},
        }
    },
    computed: {
        isSomeSelected() {
            return (Object.values(this.selectedItems)
                .filter(group => group).length < Object.values(this.filterGroups).length)
            && Object.values(this.selectedItems)?.filter(group => group).length > 0;
        },
        selectedLength() {
            return Object.values(this.selectedItems).filter(group => !!group).length;
        },
        isAllSelected () {
            return Object.values(this.selectedItems).every(group => group)
        },
        isEmpty () {
            return Object.values(this.selectedItems).every(group => !group)
        }
    },
    watch: {
        selectedItems: {
            handler: function (val, old) {
                const isAllChecked = Object.values(this.selectedItems).every(checked => checked);
                this.$refs[this.refSearchId].checked = isAllChecked;
                const selectedGroup = [];
                for (const group in this.selectedItems) {
                    if (this.selectedItems[group]) selectedGroup.push(group)
                }
                if (Object.keys(old).length) {
                    this.$emit('change-filter', selectedGroup)
                }
            },
            deep: true,
        }
    },
    mounted() {
        this.selectedItems = { ...this.filterGroups };
        $(".dropdown-menu.close-outside").on("click", function (event) {
            event.stopPropagation();
        });
    },
    methods: {
        handlerSelectAll() {
            if (Object.values(this.selectedItems).filter(checked => checked).length !== Object.values(this.filterGroups).length) {
                this.selectedItems = {...this.filterGroups};
            } else {
                for (const key in this.selectedItems) {
                    this.selectedItems[key] = false;
                }
            }
        }
    },
    template: `
        <div id="complexList" class="complex-list complex-list__filter">
            <button class="btn btn-select dropdown-toggle position-relative text-left d-flex align-items-center"
                type="button"   
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <slot name="label"></slot>
                <p class="d-flex mb-0">
                    <span v-if="isAllSelected" class="complex-list_filled">All</span>
                    <span v-else-if="isEmpty" class="complex-list_empty">Select group</span>  
                    <span v-else class="complex-list_filled">{{ selectedLength }} selected</span>
                </p>
            </button>
            <div class="dropdown-menu close-outside">
                <ul class="my-0">
                    <li
                        class="dropdown-item dropdown-menu_item d-flex align-items-center">
                        <label
                            class="mb-0 w-100 d-flex align-items-center custom-checkbox"
                            :class="{ 'custom-checkbox__minus': isSomeSelected }">
                            <input
                                @click="handlerSelectAll"
                                :ref="refSearchId"
                                type="checkbox">
                            <span class="w-100 d-inline-block ml-3">All</span>
                        </label>
                    </li>
                    <li
                        class="dropdown-item dropdown-menu_item d-flex align-items-center"
                        v-for="(value, group) in selectedItems" :key="group">
                        <label
                            class="mb-0 w-100 d-flex align-items-center custom-checkbox">
                            <input
                                :value="value"
                                v-model="selectedItems[group]"
                                type="checkbox">
                            <span class="w-100 d-inline-block ml-3">{{ group }}</span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    `
};
