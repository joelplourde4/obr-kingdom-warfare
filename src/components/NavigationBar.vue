<template>
    <div v-if="hasPermission" class="row header">
        <label class="switch">
            <input type="checkbox" @click="toggleEditMode"/>
            <span class="slider round"></span>
        </label>
        <input v-if="isGM" type="button" class="settings-button settings-icon" @click="toggleSettings">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'NavigationBar',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        isSettings: {
          type: Boolean,
          required: true
        },
        hasPermission: {
            type: Boolean,
            required: true
        },
    },
    data() {
        const editMode = false;
        const settings = false;
        return {
            editMode: editMode,
            settings: settings,
        }
    },
    emits: ['update:editMode','update:settings'],
    computed: {
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.editMode;
        }
    },
    methods: {
        toggleEditMode() {
            this.editMode = !this.editMode;
            this.$emit('update:editMode', this.editMode);
        },
        toggleSettings() {
            this.settings = !this.settings;
            this.$emit('update:settings', this.settings);
        },
    }
})
  
</script>

<style scoped>

.header {
    margin-bottom: 0.5rem;
    align-items: center;
    margin-left: 78%;
}

.settings-icon {
    margin-top: -0.125rem;
    margin-left: 0.5rem;
}

/* The switch - the box around the slider */
.switch {
  align-self: center;
  position: relative;
  display: inline-block;
  width: 56px;
  height: 24px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: var(--text);
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--text-accent);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--text-accent);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>