<template>
  <Sheet
    :currentPlayer="currentPlayer"
    :players="players"
    :domain="domain"
    :config="config"
    :isGM="isGM"
    :hasPermission="hasPermission"
    @update:domain="updateDomain"
    @update:config="updateConfig"
    @update:switch-sheet="switchSheet"
  />
  <Tools
    :currentPlayer="currentPlayer"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import Sheet from './components/Sheet.vue'
import { Domain } from './models/Domain.ts'

import OBR, { Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import { Config } from './models/Config.ts';
import Tools from '../tool/Tools.vue';

const DM_ID = "000000000-0000-0000-0000-0000000000000";

const DOMAIN_METADATA_KEY = "com.obr.domain-sheet/sheet/metadata/";
const CONFIG_METADATA_KEY = "com.obr.domain-sheet/config/metadata";

export default defineComponent({
    components: { Sheet, Tools },
    name: 'App',
    data() {
      const debouncedSaveConfig = useDebounceFn((config) => { this.saveConfig(config) }, 500)
      let roomMetadataCallback = () => {};
      return {
        roomMetadataCallback,
        debouncedSaveConfig,
        isGM: false,
        hasPermission: false,
        domain: new Domain(),
        config: new Config(),
        currentPlayer: {
          id: "",
          name: "",
          color: ""
        } as Player,
        selectedPlayerId: "",
        players: [] as Array<Player>,
        root: document.getElementById('content'),
      }
    },
    mounted() {
      this.root = document.documentElement;

      const intervalId = window.setInterval(async () => {
          if (OBR.isReady) {
            // Load the Players
            await this.loadPlayers();

            // Load the metadata
            await this.loadMetadata();

            // Listen for changes to the metadata of the room.
            this.roomMetadataCallback = OBR.room.onMetadataChange((metadata) => {
              this.loadConfig(metadata);
              this.loadDomain(metadata);
              this.loadPermission();
            });

            const theme = await OBR.theme.getTheme();
            this.setTheme(theme);

            OBR.theme.onChange((theme) => {
              this.setTheme(theme);
            }),

            OBR.party.onChange((party) => {
              this.players = [];

              this.players.push({
                id: this.currentPlayer.id,
                name: this.currentPlayer.name,
                connectionId: '',
                role: this.isGM ? 'GM' : 'PLAYER',
                color: this.currentPlayer.color,
                syncView: false,
                metadata: {}
              });

              this.players.push(...party);
            });

            OBR.player.onChange((player) => {
              this.currentPlayer.name = player.name;
              this.currentPlayer.color = player.color;

              const index = this.players.findIndex((x) => x.id === player.id);
              if (index >= 0) {
                this.players[index] = player;
              }
            });

            clearInterval(intervalId);
          }
        }, 200);
    },
    unmounted() {
      this.roomMetadataCallback();
    },
    computed: {
      getDomainId() {
        return this.config.sharedMode ? DM_ID : this.selectedPlayerId;
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
        this.saveDomain(domain);
      },
      /**
       * Load a Domain from the metadata.
       * @param metadata the metadata of the room.
       */
      loadDomain(metadata: Metadata) {
        const domain = metadata[DOMAIN_METADATA_KEY + this.getDomainId] as Domain;
        if (domain) {
          const newVersion = domain.version;
          const currentVersion = this.domain.version;
          if (newVersion > currentVersion) {
            this.domain = domain;
          }
        } else {
          this.domain = new Domain();
        }
      },
      /**
       * Save the domain to the room metadata.
       * @param domain the domain
       */
      saveDomain(domain: Domain) {
        domain.version = (domain.version || 0) + 1;
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
        if (!config.warfare) {
          OBR.contextMenu.remove("com.obr.domain-sheet/warfare")
        }
        // Set the metadata
        OBR.room.setMetadata({
          [CONFIG_METADATA_KEY]: {
            data: JSON.parse(JSON.stringify(config))
          }
        });
      },
      async loadCurrentPlayer() {
        this.currentPlayer.id = await OBR.player.getId();
        this.currentPlayer.name = await OBR.player.getName();
        this.currentPlayer.color = await OBR.player.getColor();

        this.selectedPlayerId = this.currentPlayer.id;
      },
      /**
       * Load the players currently in the Room.
       */
      async loadPlayers() {
        await this.loadCurrentPlayer();

        this.players.push({
          id: this.currentPlayer.id,
          name: this.currentPlayer.name,
          connectionId: '',
          role: this.isGM ? 'GM' : 'PLAYER',
          color: this.currentPlayer.color,
          syncView: false,
          metadata: {}
        });

        OBR.party.getPlayers().then((party) => {
          this.players.push(...party);
        });
      },
      /**
       * This method switches the sheet to a different player
       * @param playerId The player id to switch to.
       */
      switchSheet(playerId: string) {
        this.selectedPlayerId = playerId;
        this.loadMetadata();
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