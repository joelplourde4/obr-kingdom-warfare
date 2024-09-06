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
                                <h3>{{ card.name }}</h3>
                                <hr>
                                <div class="row">
                                    <p>{{ card.ancestry }}</p>
                                    <p>{{ card.experience }}</p>
                                </div>
                                <div class="row">
                                    <p>{{ card.equipment }}</p>
                                    <p>{{ card.type }}</p>
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
                        <div class="trait" v-for="trait in card.traits || []" :value="trait">
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
    </div>
    <div v-else class="loader">
    </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import html2canvas from 'html2canvas';
import { defineComponent } from 'vue'
import { Card } from './models/Card';
import { Trait, Type } from '../src/models/Unit';

import { TRAIT_DESCRIPTION_MAP } from '../src/models/Trait.ts'

import { ANCESTRY_STATS_MAP, EXPERIENCE_STATS_MAP, EQUIPMENT_STATS_MAP, TYPE_STATS_MAP, TYPE_COST_MODIFIER_MAP, SIZE_COST_MODIFIER_MAP, TRAIT_COST_MAP, ANCESTRY_COLOR_MAP, INFANTRY_ATTACK_MAP, CAVALRY_AERIAL_ATTACK_MAP, ARTILLERY_ATTACK_MAP, INFANTRY_DAMAGE_MAP, CAVALRY_AERIAL_DAMAGE_MAP } from './models/Stats.ts'
import OBR, { ImageGrid, ImageUpload, Vector2 } from '@owlbear-rodeo/sdk';

export default defineComponent({
    data() {
        const route = useRoute();
        return {
            initialized: false,
            card: new Card(),
            route
        }
    },
    created() {
        setTimeout(() => {
            // Get the query params, initialize the unit card with them.
            const q = this.route.query;

            this.card = new Card(
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
            return ANCESTRY_COLOR_MAP.get(this.card.ancestry) || "#ffffff"
        },
        getAttack() {
            let attack = 0;
            attack += ANCESTRY_STATS_MAP.get(this.card.ancestry)?.attack || 0;
            attack += EXPERIENCE_STATS_MAP.get(this.card.experience)?.attack || 0;
            attack += EQUIPMENT_STATS_MAP.get(this.card.equipment)?.attack || 0;
            attack += TYPE_STATS_MAP.get(this.card.type)?.attack || 0;
            return attack;
        },
        getDefense() {
            let defense = 10;
            defense += ANCESTRY_STATS_MAP.get(this.card.ancestry)?.defense || 0;
            defense += EXPERIENCE_STATS_MAP.get(this.card.experience)?.defense || 0;
            defense += EQUIPMENT_STATS_MAP.get(this.card.equipment)?.defense || 0;
            defense += TYPE_STATS_MAP.get(this.card.type)?.defense || 0;
            return defense;
        },
        getToughness() {
            let toughness = 10;
            toughness += ANCESTRY_STATS_MAP.get(this.card.ancestry)?.toughness || 0;
            toughness += EXPERIENCE_STATS_MAP.get(this.card.experience)?.toughness || 0;
            toughness += EQUIPMENT_STATS_MAP.get(this.card.equipment)?.toughness || 0;
            toughness += TYPE_STATS_MAP.get(this.card.type)?.toughness || 0;
            return toughness;
        },
        getPower() {
            let power = 0;
            power += ANCESTRY_STATS_MAP.get(this.card.ancestry)?.power || 0;
            power += EXPERIENCE_STATS_MAP.get(this.card.experience)?.power || 0;
            power += EQUIPMENT_STATS_MAP.get(this.card.equipment)?.power || 0;
            power += TYPE_STATS_MAP.get(this.card.type)?.power || 0;
            return power;
        },
        getMorale() {
            let morale = 0;
            morale += ANCESTRY_STATS_MAP.get(this.card.ancestry)?.morale || 0;
            morale += EXPERIENCE_STATS_MAP.get(this.card.experience)?.morale || 0;
            morale += EQUIPMENT_STATS_MAP.get(this.card.equipment)?.morale || 0;
            morale += TYPE_STATS_MAP.get(this.card.type)?.morale || 0;
            return morale;
        },
        getCost() {
            let cost = 0;

            cost += this.getAttack;
            cost += this.getPower;
            cost += this.getDefense - 10;
            cost += this.getToughness - 10;

            cost += this.getMorale * 2;

            cost *= TYPE_COST_MODIFIER_MAP.get(this.card.type) || 1;

            cost *= SIZE_COST_MODIFIER_MAP.get(this.card.size) || 1;

            cost *= 10;

            this.card.traits.forEach(trait => {
                cost += TRAIT_COST_MAP.get(trait) || 50;
            });

            cost += 30;

            return Math.round(cost);
        },
        getNumberAttacks() {
            let numberAttack = 1;

            if (this.card.type === Type.INFANTRY) {
                numberAttack += INFANTRY_ATTACK_MAP.get(this.card.experience) || 0;
            } else if (this.card.type === Type.CAVALRY) {
                numberAttack += CAVALRY_AERIAL_ATTACK_MAP.get(this.card.experience) || 0;
            } else if (this.card.type === Type.AERIAL) {
                numberAttack += CAVALRY_AERIAL_ATTACK_MAP.get(this.card.experience) || 0;
            } else if (this.card.type === Type.ARTILLERY) {
                numberAttack += ARTILLERY_ATTACK_MAP.get(this.card.experience) || 0;
            }
            return numberAttack;
        },
        getDamage() {
            let damage = 1;

            if (this.card.type === Type.INFANTRY) {
                damage += INFANTRY_DAMAGE_MAP.get(this.card.equipment) || 0;
            } else if (this.card.type === Type.CAVALRY) {
                damage += CAVALRY_AERIAL_DAMAGE_MAP.get(this.card.equipment) || 0;
            } else if (this.card.type === Type.AERIAL) {
                damage += CAVALRY_AERIAL_DAMAGE_MAP.get(this.card.equipment) || 0;
            }
            return damage;
        },
        getMovement() {
            let movement = 1;
            if (this.card.type === Type.CAVALRY) {
                movement += 1;
            }
            if (this.card.type === Type.AERIAL) {
                movement += 1;
            }
            return movement;
        },
        getType() {
            const type = this.convertString(this.card.type);
            const equipment = this.convertString(this.card.equipment);
            return `./assets/type/${type}/${type}-${equipment}.png`;
        },
        getAncestry() {
            const ancestry = this.convertString(this.card.ancestry);
            return `./assets/ancestry/${ancestry}.png`;
        },
        getExperience() {
            const experience = this.convertString(this.card.experience);
            return `./assets/experience/${experience}.png`;
        },
        getSize() {
            return this.card.size;
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
                    link.download = `${this.card.name}.jpg`;
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
                        name: `${this.card.name}`,
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
                        description: `Unit Card of ${this.card.name}`
                } as ImageUpload

                OBR.assets.uploadImages([imageUpload], "NOTE");
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
        margin-left: 40px;
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
            padding-bottom: 10px;

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
  border: 8px solid var(--on-primary); /* Light grey */
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

</style>