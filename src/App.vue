<template>
  <Sheet
    :domain="domain"
    :config="config"
    :isGM="isGM"
    @update:domain="updateDomain"
    @update:config="updateConfig"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import Sheet from './components/Sheet.vue'
import { Domain } from './models/Domain.ts'

import OBR, { Theme } from "@owlbear-rodeo/sdk";
import { Config } from './models/Config.ts';

const GLOBAL_SHEET_MESSAGE = "obr.domain.sheet.channel"
const GLOBAL_CONFIG_MESSAGE = "obr.domain.config.channel"

export default defineComponent({
    components: { Sheet },
    name: 'App',
    data() {
      const saveDomain = (domain: Domain) => {
        let json = JSON.parse(JSON.stringify(domain));

        const metadata = {
          "com.obr.domain-sheet/sheet/metadata": {
            data: json
          }
        }

        // Set the metadata
        OBR.room.setMetadata(metadata)

        // Broadcast a message to
        OBR.broadcast.sendMessage(GLOBAL_SHEET_MESSAGE, json, { destination: "REMOTE" })
      }

      const saveConfig = (config: Config) => {
        let json = JSON.parse(JSON.stringify(config));

        const metadata = {
          "com.obr.domain-sheet/config/metadata": {
            data: json
          }
        }

        // Set the metadata
        OBR.room.setMetadata(metadata)

        OBR.broadcast.sendMessage(GLOBAL_CONFIG_MESSAGE, json, { destination: "REMOTE" })
      }

      const debouncedSaveDomain = useDebounceFn(saveDomain, 500)
      const debouncedSaveConfig = useDebounceFn(saveConfig, 500)
      return {
        debouncedSaveDomain,
        debouncedSaveConfig,
        isGM: false,
        domain: new Domain(),
        config: new Config(),
        playerId: "",
        root: document.getElementById('content'),
      }
    },
    mounted() {
      this.root = document.documentElement;

      const intervalId = window.setInterval(async () => {
          if (OBR.isReady) {
            // Load the Player ID
            this.playerId = await OBR.player.getConnectionId()

            this.isGM = await OBR.player.hasPermission("MAP_CREATE");

            // Load the metadata
            OBR.room.getMetadata().then(metadata => {
              const domainData = metadata["com.obr.domain-sheet/sheet/metadata"] as any;
              this.domain = Object.setPrototypeOf(domainData.data, Domain.prototype);

              const configData = metadata["com.obr.domain-sheet/config/metadata"] as any;
              this.config = Object.setPrototypeOf(configData.data, Config.prototype);
            });

            // Subscribe to Global Messages
            OBR.broadcast.onMessage(GLOBAL_SHEET_MESSAGE, (event) => {
              this.domain = Object.setPrototypeOf(event.data, Domain.prototype)
            });

            OBR.broadcast.onMessage(GLOBAL_CONFIG_MESSAGE, (event) => {
              this.config = Object.setPrototypeOf(event.data, Config.prototype)
            });

            const theme = await OBR.theme.getTheme();
            this.setTheme(theme);

            OBR.theme.onChange((theme) => {
              this.setTheme(theme);
            }),

            clearInterval(intervalId);
          }
        }, 200)
    },
    methods: {
      updateDomain(domain: Domain) {
        this.debouncedSaveDomain(domain);
      },
      updateConfig(config: Config) {
        this.debouncedSaveConfig(config);
      },
      setTheme(theme: Theme) {
        this.root?.style.setProperty("--primary", theme.primary.main);
        this.root?.style.setProperty("--text", theme.text.primary);
        this.root?.style.setProperty("--text-secondary", theme.text.secondary);
        this.root?.style.setProperty("--default", theme.background.default);
      }
    }
})

</script>

<style scoped>
</style>