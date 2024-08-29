<template>
  <Sheet
    :domain="domain"
    :isGM="isGM"
    @update:domain="updateDomain"
  />
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue'

import Sheet from './components/Sheet.vue'
import { Domain } from './models/Domain.ts'

import OBR from "@owlbear-rodeo/sdk";

const GLOBAL_MESSAGE = "obr.domain.sheet.channel"

export default defineComponent({
    components: { Sheet },
    name: 'App',
    data() {
      return {
        isGM: false,
        domain: new Domain(),
        playerId: ""
      }
    },
    mounted() {
      const intervalId = window.setInterval(async () => {
          if (OBR.isReady) {
            // Load the Player ID
            this.playerId = await OBR.player.getConnectionId()

            this.isGM = await OBR.player.hasPermission("MAP_CREATE");

            // Load the metadata
            OBR.room.getMetadata().then(metadata => {
              const data = metadata["com.obr.domain-sheet/metadata"] as any;
              this.domain = new Domain()//data.data as Domain;
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
      updateDomain(domain: Domain) {
        console.log('Saving: ', domain);

        const metadata = {
          "com.obr.domain-sheet/metadata": {
            data: toRaw(domain)
          }
        }

        // Set the metadata
        OBR.room.setMetadata(metadata)

        // Broadcast a message to
        OBR.broadcast.sendMessage(GLOBAL_MESSAGE, toRaw(domain), { destination: "REMOTE" })
      }
    }
})

</script>

<style scoped>
</style>