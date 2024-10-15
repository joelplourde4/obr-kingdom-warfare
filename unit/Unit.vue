<template>
    <div v-if="initialized">
        <div ref="content" class="background">
            <div class="foreground">
                <div class="column">
                    <div class="header">
                        <div class="row">
                            <div class="row">
                                <div class="container">
                                    <img class="ancestry" :src="getAncestry">
                                    <img class="experience" :src="getExperience">
                                </div>
                                <img class="type" :src="getType">
                            </div>
                            <div class="name column">
                                <h3>{{ unit.name }}</h3>
                                <hr>
                                <div class="row">
                                    <p>{{ unit.ancestry }}</p>
                                    <p>{{ unit.experience }}</p>
                                </div>
                                <div class="row">
                                    <p>{{ unit.equipment }}</p>
                                    <p>{{ unit.type }}</p>
                                </div>
                            </div>
                            <div class="cost container">
                                <div class="icon-container">
                                    <span class="number">{{ getNumberAttacks }}</span>
                                    <img class ="icon" src="./assets/attack.png">
                                </div>
                                <div class="icon-container">
                                    <span class="number">{{ getDamage }}</span>
                                    <img class ="icon" src="./assets/damage.png">
                                </div>
                                <div class="icon-container">
                                    <span class="number">{{ getMovement }}</span>
                                    <img class ="icon" src="./assets/movement.png">
                                </div>
                                <span>Cost: {{ getCost }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <hr>
                        <div class="row">
                            <div class="statistics">
                                <p class="attribute">ATTACK: </p>
                                <p class="modifier">{{ getAttack }}</p>
                            </div>
                            <div class="statistics">
                                <p class="attribute">DEFENSE: </p>
                                <p class="modifier">{{ getDefense }}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="statistics">
                                <p class="attribute">POWER: </p>
                                <p class="modifier">{{ getPower }}</p>
                            </div>
                            <div class="statistics">
                                <p class="attribute">TOUGHNESS: </p>
                                <p class="modifier">{{ getToughness }}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="statistics">
                                <p class="attribute">MORALE: </p>
                                <p class="modifier">{{ getMorale }}</p>
                            </div>
                            <div class="statistics">
                                <p class="attribute">SIZE: </p>
                                <p class="modifier">{{ getSize }}</p>
                            </div>
                        </div>
                        <hr>
                    </div>
                    <div class="traits">
                        <h3>Traits</h3>
                        <div class="trait" v-for="trait in unit.traits || []" :value="trait">
                            <span class="bold">{{ trait }}</span>
                            <span>{{ getTraitDescription(trait) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-container">
            <button class="file-button" @click="download">Download</button>
            <button class="file-button" @click="upload">Upload</button>
        </div>
        <span v-if="error" class="error">{{ error }}</span>
    </div>
    <div v-else class="loader">
    </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';
import { defineComponent } from 'vue'
import { Trait, Type, Unit } from '../src/models/Unit';

import { TRAIT_DESCRIPTION_MAP } from '../src/models/Trait.ts'

import { ANCESTRY_STATS_MAP, EXPERIENCE_STATS_MAP, EQUIPMENT_STATS_MAP, TYPE_STATS_MAP, TYPE_COST_MODIFIER_MAP, SIZE_COST_MODIFIER_MAP, TRAIT_COST_MAP, ANCESTRY_COLOR_MAP, INFANTRY_ATTACK_MAP, CAVALRY_AERIAL_ATTACK_MAP, ARTILLERY_ATTACK_MAP, INFANTRY_DAMAGE_MAP, CAVALRY_AERIAL_DAMAGE_MAP } from './models/Stats.ts'
import OBR, { ImageGrid, ImageUpload, Vector2 } from '@owlbear-rodeo/sdk';
import { statsCalculator } from './mixins/statsCalculator.ts';

export default defineComponent({
    mixins: [statsCalculator],
    data() {
        const route = useRoute();
        return {
            initialized: false,
            unit: new Unit(),
            route,
            error: ""
        }
    },
    created() {
        setTimeout(() => {
            // Get the query params, initialize the unit card with them.
            const q = this.route.query;

            this.unit = new Unit(
                this.formatString(q.name),
                this.formatString(q.experience),
                this.formatString(q.equipment),
                this.formatString(q.type),
                this.formatString(q.ancestry),
                this.formatString(q.tier),
                this.formatString(q.size),
                this.formatString(q.traits).split(',') as Trait[]
            );

            setTimeout(() => {
                this.initialized = true;
            }, 200);
        }, 1);
    },
    computed: {
        getColor() {
            return ANCESTRY_COLOR_MAP.get(this.unit.ancestry) || "#ffffff"
        },
        getAttack() {
            return this.calculateAttack(this.unit);
        },
        getDefense() {
            return this.calculateDefense(this.unit);
        },
        getToughness() {
            return this.calculateToughness(this.unit);
        },
        getPower() {
            return this.calculatePower(this.unit);
        },
        getMorale() {
            return this.calculateMorale(this.unit);
        },
        getCost() {
            return this.calculateCost(this.unit);
        },
        getNumberAttacks() {
            return this.calculateNumberAttacks(this.unit);
        },
        getDamage() {
            return this.calculateDamage(this.unit);
        },
        getMovement() {
            return this.calculateMovement(this.unit);
        },
        getType() {
            const type = this.convertString(this.unit.type);
            const equipment = this.convertString(this.unit.equipment);
            return `./assets/type/${type}/${type}-${equipment}.png`;
        },
        getAncestry() {
            const ancestry = this.convertString(this.unit.ancestry);
            return `./assets/ancestry/${ancestry}.png`;
        },
        getExperience() {
            const experience = this.convertString(this.unit.experience);
            return `./assets/experience/${experience}.png`;
        },
        getSize() {
            return this.unit.size;
        },
    },
    methods: {
        // Convert a String from snake_case to human-readable format
        formatString(string: string) {
            return (string || "").replace(/_/g, ' ')
        },
        // Convert a String from human-readable format to filename format
        convertString(string: string) {
            return (string || "").replace(/ /g, '-').toLowerCase();
        },
        getTraitDescription(trait: Trait): string {
            if (!trait) {
                return "";
            }
            return ":" + TRAIT_DESCRIPTION_MAP.get(trait) || "";
        },
        /*
            Download the Unit Card in .JPG format
        */
        async download() {
            const element = this.$refs.content;

            const options = {
                type: 'dataURL'
            }

            // @ts-ignore
            await html2canvas(element, options).then((canvas) => {
                const link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = canvas.toDataURL();
                    link.download = `${this.unit.name}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        },
        async upload() {
            const element = this.$refs.content;

            const options = {
                type: 'dataURL'
            }

            // @ts-ignore
            const data = await html2canvas(element, options)

                data.toBlob((blob) => {
                    const imageUpload = {
                        file: blob,
                        name: `${this.unit.name}`,
                        grid: {
                            offset: {
                                x: 0,
                                y: 0
                            },
                            dpi: 125
                        } as ImageGrid,
                        textItemType: 'LABEL',
                        visible: true,
                        locked: false,
                        description: `Unit Card of ${this.unit.name}`
                } as ImageUpload

                OBR.assets.uploadImages([imageUpload], "NOTE").catch((error) => {
                    console.error(error);
                    this.error = "You need to be logged in to use the 'Upload' feature.";
                });
            });
        }
    }
})
</script>

<style scoped>

.background {
    display: flex;
    background-color: v-bind('getColor');
    width: 380px;
    padding-top: 8px;
    padding-bottom: 8px;
}

.foreground {
    display: flex;
    margin:auto;
    border: rgb(0, 0, 0);
    border-style: solid;
    background-color: rgb(255, 255, 255);
    width: 360px;
}

h3, p, hr {
    margin: 0.25rem 0.25rem 0 0;
}

.header {
    margin-left: 10px;
    top: -12px;
    position: relative;

    .ancestry, .type, .experience  {
        width: 50px;
    }

    .name {
        margin-left: 35px;
        margin-top: 40px;
    }

    .cost {
        margin-top: auto;
        text-align: right;
        padding-right: 20px;

        .icon-container {
            margin-left: auto;
            height: 40px;
            width: 40px;

            .number {
                position: absolute;
                margin-left: 11px;
                margin-top: 2px;
                font-size: xx-large;
                color: white;
                text-shadow: 2px 0 #000000, -2px 0 #000000, 0 2px #000000, 0 -2px #000000, 1px 1px #000000, -1px -1px #000000, 1px -1px #000000, -1px 1px #000000;
            }

            .icon {
                height: 40px;
                width: 40px;
            }
        }
    }

    .experience {
        position: relative;
        top: -10px;
    }
}

.content {
    margin: 0 2rem 0 2rem;

    .statistics {
        width: 50%;

        .attribute {
            float: left;
        }

        .modifier {
            float: right;
            margin-right: 15px;
        }
    }
}

.traits {
    margin: 0 2rem 0 2rem;

    .trait {
        margin-bottom: 10px;
    }

    .bold {
        font-weight: bold;
    }
}

.button-container {
    display: flex;
    margin-top: 10px;
}

.file-button {
    width: 100%;
    color: var(--accent);
    background-color: transparent;
    border: solid var(--accent) 1px;
    border-radius: 16px;
    padding: 10px;
    margin: auto;
}

.file-button:hover {
    filter: brightness(125%);
}

.loader {
  border: 8px solid var(--background); /* Light grey */
  border-top: 8px solid var(--accent);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  margin: auto;
  pointer-events: none;
  position: relative;
  top: 175px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
    color: red;
    display: block;
    text-align: center;
}

</style>