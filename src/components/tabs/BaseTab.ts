import { defineComponent, PropType } from "vue";
import { Domain } from "../../models/Domain";

export default defineComponent({
    name: 'BaseTab',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isEditMode: {
            type: Boolean,
            required: true
        },
        domain: {
            type: Object as PropType<Domain>,
            required: true
        }
    },
    emits: ['update:modelValue'],
    computed: {
        isVisible(): boolean {
            return this.isEditMode === true;
        },
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.isEditMode;
        }
    },
    methods: {
        onUpdate() {
            const json = JSON.parse(JSON.stringify(this.domain));
            this.$emit('update:modelValue', json);
        }
    }
});