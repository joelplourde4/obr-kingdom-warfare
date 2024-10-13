<template>
  <Sheet
    :domain="domain"
    :config="config"
    :isGM="isGM"
    :hasPermission="hasPermission"
    @update:domain="updateDomain"
    @update:config="updateConfig"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import Sheet from './components/Sheet.vue'
import { Domain } from './models/Domain.ts'

import OBR, { Metadata, Theme } from "@owlbear-rodeo/sdk";
import { Config } from './models/Config.ts';

const DM_ID = "000000000-0000-0000-0000-0000000000000";

const DOMAIN_METADATA_KEY = "com.obr.domain-sheet/sheet/metadata/";
const CONFIG_METADATA_KEY = "com.obr.domain-sheet/config/metadata";

export default defineComponent({
    components: { Sheet },
    name: 'App',
    data() {
      const debouncedSaveDomain = useDebounceFn((domain) => { this.saveDomain(domain) }, 500)
      const debouncedSaveConfig = useDebounceFn((config) => { this.saveConfig(config) }, 500)
      return {
        debouncedSaveDomain,
        debouncedSaveConfig,
        isGM: false,
        hasPermission: false,
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
            this.playerId = await OBR.player.getId();

            // Load the metadata
            await this.loadMetadata();

            // Listen for changes to the metadata of the room.
            OBR.room.onMetadataChange((metadata) => {
              this.loadConfig(metadata);
              this.loadDomain(metadata);
              this.loadPermission();
            });

            const theme = await OBR.theme.getTheme();
            this.setTheme(theme);

            OBR.theme.onChange((theme) => {
              this.setTheme(theme);
            }),

            clearInterval(intervalId);
          }
        }, 200);
    },
    computed: {
      getDomainId() {
        return this.config.sharedMode ? DM_ID : this.playerId;
      }
    },
    methods: {
      /**
       * Method to load the metadata from the Room.
       */
      async loadMetadata() {
        await OBR.room.getMetadata().then(metadata => {
          this.loadConfig(metadata);
          this.loadDomain(metadata);
        }).finally(() => {
          this.loadPermission();
        });
      },
      /**
       * Determine whether the player has permission or not.
       */
      async loadPermission() {
        this.isGM = await OBR.player.hasPermission("MAP_CREATE");
        if (!this.config.sharedMode) {
          this.hasPermission = true;
        } else {
          this.hasPermission = this.isGM;
        }
      },
      updateDomain(domain: Domain) {
        this.debouncedSaveDomain(domain);
      },
      /**
       * Load a Domain from the metadata.
       * @param metadata the metadata of the room.
       */
      loadDomain(metadata: Metadata) {
        const domain = metadata[DOMAIN_METADATA_KEY + this.getDomainId] as Domain;
        if (domain) {
          this.domain = domain;
        }
      },
      /**
       * Save the domain to the room metadata.
       * @param domain the domain
       */
      saveDomain(domain: Domain) {
        OBR.room.setMetadata({
          [DOMAIN_METADATA_KEY + this.getDomainId]: JSON.parse(JSON.stringify(domain))
        });
      },
      /**
       * Load the configuration from the metadata
       * @param metadata the metadata of the room.
       */
      loadConfig(metadata: Metadata) {
        const configData = metadata[CONFIG_METADATA_KEY] as any;
        if (configData) {
          this.config = Config.fromJson(configData.data);
        }
      },
      /**
       * Method that updates the config after a debounce time.
       * @param config the config
       */
      updateConfig(config: Config) {
        this.debouncedSaveConfig(config);
      },
      /**
       * Save the configuration to the room metadata.
       * @param config the config
       */
      saveConfig(config: Config) {
        // Set the metadata
        OBR.room.setMetadata({
          [CONFIG_METADATA_KEY]: {
            data: JSON.parse(JSON.stringify(config))
          }
        });
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