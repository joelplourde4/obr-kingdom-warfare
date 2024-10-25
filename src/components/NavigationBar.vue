<template>
    <div class="row header">
      <div v-if="displaySheetSelector" class="sheet-selector">
        <span>Sheet:</span>
        <select class="dropdown" v-model="selectedPlayer" @change="onPlayerSelected">
          <option v-for="player in players" :value="player.id">
            {{ player.name }}
          </option>
        </select>
      </div>
      <label v-if="displayEditMode" class="switch">
        <input type="checkbox" @click="toggleEditMode"/>
        <span class="slider round"></span>
      </label>
      <input v-if="displayWarfareIcon" type="button" class="icon-button warfare-button settings-icon" @click="toggleWarfare">
      <input v-if="displaySettingsIcon" type="button" class="icon-button settings-button settings-icon" @click="toggleSettings">
    </div>
</template>

<script lang="ts">
import { Player } from '@owlbear-rodeo/sdk';
import { defineComponent } from 'vue'
import { Config } from '../models/Config';

export default defineComponent({
    name: 'NavigationBar',
    props: {
        isGM: {
            type: Boolean,
            required: true
        },
        config: {
          type: Config,
          required: true
        },
        isSettings: {
          type: Boolean,
          required: true
        },
        isWarfare: {
          type: Boolean,
          required: true
        },
        isSharedMode: {
          type: Boolean,
          required: true
        },
        players: {
          type: Array<Player>,
          required: true,
        },
        hasPermission: {
            type: Boolean,
            required: true
        },
    },
    data() {
        const selectedPlayer = (this.players[0] || {}) as Player;
        return {
          selectedPlayer: selectedPlayer,
          editMode: false,
          settings: false,
          warfare: false,
        }
    },
    emits: ['update:editMode','update:settings', 'update:switchSheet', 'update:warfare'],
    computed: {
        isDisabled() {
            if (!this.isGM) {
                return true;
            }

            return !this.editMode;
        },
        displaySheetSelector() {
          if (!this.hasPermission) {
            return false;
          }

          if (this.isSettings) {
            return false;
          }

          if (!this.isGM) {
            return false;
          }

          return !this.isSharedMode;
        },
        displayEditMode() {
          if (!this.hasPermission) {
            return false;
          }

          if (this.isSettings) {
            return false;
          }

          if (this.isWarfare) {
            return false;
          }
          return true;
        },
        displayWarfareIcon() {
          if (!this.config.warfare) {
            return false;
          }

          if (this.isSettings) {
            return false;
          }
          return true;
        },
        displaySettingsIcon() {
          if (!this.hasPermission) {
            return false;
          }

          if (this.warfare) {
            return false;
          }
          return this.isGM;
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
        toggleWarfare() {
          this.warfare = !this.warfare;
          this.$emit('update:warfare', this.warfare);
        },
        onPlayerSelected() {
          this.$emit('update:switchSheet', this.selectedPlayer);
        }
    }
})
  
</script>

<style scoped>

.header {
    margin-bottom: 0.5rem;
    align-items: center;
    display: flex;
    justify-content: flex-end;
}

.sheet-selector {
  justify-content: flex-start;
  margin-right: auto;
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