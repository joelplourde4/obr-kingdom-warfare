<template>
  <Sheet
    :domain="domain"
    :isGM="isGM"
    @update:domain="updateDomain"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
              this.domain = Object.setPrototypeOf(data.data, Domain.prototype)
            });

            // Subscribe to Global Messages
            OBR.broadcast.onMessage(GLOBAL_MESSAGE, (event) => {
              this.domain = Object.setPrototypeOf(event.data, Domain.prototype)
            });
            clearInterval(intervalId);
          }
        }, 200)
    },
    methods: {
      updateDomain(domain: Domain) {
        console.log('Saving: ', domain);

        const json = JSON.parse(JSON.stringify(domain))

        const metadata = {
          "com.obr.domain-sheet/metadata": {
            data: json
          }
        }

        // Set the metadata
        OBR.room.setMetadata(metadata)

        // Broadcast a message to
        OBR.broadcast.sendMessage(GLOBAL_MESSAGE, json, { destination: "REMOTE" })
      }
    }
})

</script>

<style scoped>
</style>