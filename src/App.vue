<template>
  <Sheet
    :domain="domain"
    @update:model-value="save"
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
    setup () {
        const domain = new Domain()
        const playerId = ""

        return {
          playerId,
          domain
        }
    },
    mounted() {
      const intervalId = window.setInterval(async () => {
          if (OBR.isReady) {
            // Load the Player ID
            this.playerId = await OBR.player.getConnectionId()

            // Subscribe to Global Messages
            OBR.broadcast.onMessage(GLOBAL_MESSAGE, (event) => {
              if (this.playerId !== event.connectionId) {
                // TODO reload the domain.
                console.log('Received an event: ', event);
              }
            });
            clearInterval(intervalId);
          }
        }, 1000)
    },
    methods: {
      save() {
        // TODO save this somewhere, if you aren't the same connection Id.
        console.log('Saving!');

        // Broadcast a message to
        OBR.broadcast.sendMessage(GLOBAL_MESSAGE, this.domain, { destination: "ALL" })
      }
    }
})

</script>

<style scoped>
</style>