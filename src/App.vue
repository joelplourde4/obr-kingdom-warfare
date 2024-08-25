<template>
  <Sheet
    :domain="domain"
    @update:stats="updateStats"
  />
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'

import Sheet from './components/Sheet.vue'
import { Domain } from './models/Domain.ts'

import OBR from "@owlbear-rodeo/sdk";
import { Stats } from './models/Stats.ts';

const GLOBAL_MESSAGE = "obr.domain.sheet.channel"

export default defineComponent({
    components: { Sheet },
    name: 'App',
    data() {
      return {
        domain: new Domain(),
        playerId: ""
      }
    },
    mounted() {
      const intervalId = window.setInterval(async () => {
          if (OBR.isReady) {
            // Load the Player ID
            this.playerId = await OBR.player.getConnectionId()

            // Load the metadata
            OBR.room.getMetadata().then(metadata => {
              const data = metadata["com.obr.domain-sheet/metadata"] as any;
              this.domain = data.data as Domain;
            });

            // Subscribe to Global Messages
            OBR.broadcast.onMessage(GLOBAL_MESSAGE, (event) => {
              this.domain = event.data as Domain;
            });
            clearInterval(intervalId);
          }
        }, 200)
    },
    methods: {
      updateStats(stats: Stats) {
        // Update the stats
        this.domain.stats = stats;

        const metadata = {
          "com.obr.domain-sheet/metadata": {
            data: toRaw(this.domain)
          }
        }

        // Set the metadata
        OBR.room.setMetadata(metadata)

        // Broadcast a message to
        OBR.broadcast.sendMessage(GLOBAL_MESSAGE, toRaw(this.domain), { destination: "REMOTE" })
      }
    }
})

</script>

<style scoped>
</style>