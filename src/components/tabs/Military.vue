<template>
    <div class="content military">
        <div class="unit" v-for="unit in domain.units">
            <button type="button" class="collapsible column" @click="openCollapsible(unit)">
                <div class="column">
                    <div class="row">
                        <input class="name" v-model="unit.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                        <div class="caret">
                            <img v-if="unit.show" src="/caret-up.svg">
                            <img v-if="!unit.show" src="/caret-down.svg">
                        </div>
                        <input type="button" class="add-button" @click="openModal">
                        <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveUnit(unit)"/>
                    </div>
                    <div class="row">
                        <div class="tooltip">
                            <select class="dropdown" v-model="unit.experience" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                                <option v-for="experience in Experience" :value="experience">
                                    {{ experience }}
                                </option>
                            </select>
                            <span class="tooltiptext">Experience is a combination of how much training a unit has and how much fighting it's seen.</span>
                        </div>
                        <div class="tooltip">
                            <select class="dropdown" v-model="unit.equipment" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                                <option v-for="equipment in Equipment" :value="equipment">
                                    {{ equipment }}
                                </option>
                            </select>
                            <span class="tooltiptext">Describes a unit's arms and armor, heavier units have better weapons and armor, granting them bonuses to Power, Toughness and Damage.</span>
                        </div>
                        <div class="tooltip">
                            <select class="dropdown" v-model="unit.type" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                                <option v-for="type in Type" :value="type">
                                    {{ type }}
                                </option>
                            </select>
                            <span class="tooltiptext">Determines what a unit can do in battle, who it can attack, and who it can be attacked by.</span>
                        </div>
                        <div class="tooltip">
                            <select class="dropdown" v-model="unit.ancestry" @click="preventPropagation" @change="onAncestryChange(unit)" :disabled="isDisabled">
                                <option v-for="ancestry in Ancestry" :value="ancestry">
                                    {{ ancestry }}
                                </option>
                            </select>
                            <span class="tooltiptext">Affects all of a unit' stats, and in many ways is the defining attribute of a unit. Ancestry also determines what traits a unit has.</span>
                        </div>
                    </div>
                </div>
            </button>
            <div v-if="unit.show" class="collapsible-content">
                <div class="row">
                    <div class="column">
                        <div class="tooltip">
                            <div class="trait-header row">
                                <p>Traits</p>
                                <input v-show="isVisible" type="button" class="add-button" @click="onAddTrait(unit)"/>
                            </div>
                            <span class="tooltiptext">Maneuvers or special features that the unit can employ in battle.</span>
                        </div>
                        <ol class="traits">
                            <li class="tooltip" style="display:list-item" v-for="trait in getTraitDefinitions(unit)">
                                <p v-if="trait.inherit" class="trait">{{ trait.name }}</p>
                                <div v-if="!trait.inherit" class="row">
                                    <p class="trait">{{ trait.name }}</p>
                                    <select v-if="isEditMode" class="selector" v-model="trait.newTrait" @click="preventPropagation" @change="onTraitChange(unit, trait)" :disabled="isDisabled">
                                        <option v-for="x in Trait" :value="x">
                                            {{ x }}
                                        </option>
                                    </select>
                                    <input v-show="isVisible" type="button" class="remove-button remove-trait" @click="onRemoveTrait(unit, trait)"/>
                                </div>
                                <span class="tooltiptext">{{ trait.description }}</span>
                            </li>
                        </ol>
                    </div>
                    <h1 class="tier">{{ unit.tier }}</h1>
                </div>
                <hr>
            </div>
        </div>
        <input v-show="isVisible" type="button" class="add-button" @click="onAddUnit"/>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import { TRAIT_MAP, ANCESTRY_TRAIT_MAP, TraitDefinition } from '../../models/Trait.ts'

// @ts-ignore
import BaseTab from './BaseTab.js'
import { Unit, Experience, Equipment, Type, Ancestry, Tier, Trait  } from '../../models/Unit.js';
import OBR from '@owlbear-rodeo/sdk';
import { Modal } from '@owlbear-rodeo/sdk/lib/types/Modal';
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Military',
    data() {
        return {
            Experience,
            Equipment,
            Type,
            Ancestry,
            Tier,
            Trait
        }
    },
    methods: {
        openCollapsible(unit: Unit) {
            unit.show = !unit.show;
        },
        onAddUnit() {
            const unit = new Unit();
            unit.traits = [...ANCESTRY_TRAIT_MAP.get(unit.ancestry) || []];
            this.domain.units.push(unit);
            this.onUpdate();
        },
        onRemoveUnit(unit: Unit) {
            this.domain.units = this.domain.units.filter((x: Unit) => {
                return x !== unit
            });
            this.onUpdate();
        },
        onAddTrait(unit: Unit) {
            unit.traits.push(Trait.ADAPTABLE);
            this.onUpdate();
        },
        onRemoveTrait(unit: Unit, traitDefinition: TraitDefinition) {
            unit.traits = unit.traits.filter((x) => {
                return x !== traitDefinition.name
            });
            this.onUpdate();
        },
        getTraitDefinitions(unit: Unit): TraitDefinition[] {
            const traitDefinitions = [];
            for (const trait of unit.traits) {
                traitDefinitions.push(this.getTraitDefinition(unit, trait));
            }
            return traitDefinitions;
        },
        getTraitDefinition(unit: Unit, trait: Trait): TraitDefinition {
            const traits = [...ANCESTRY_TRAIT_MAP.get(unit.ancestry) || []];

            let inherit = true;

            // Check if trait is within traits.
            const index = traits.indexOf(trait);
            if (index < 0) {
                inherit = false;
            }
            return new TraitDefinition(
                trait,
                TRAIT_MAP.get(trait) || "",
                inherit
            )
        },
        /* On Change Events*/
        onAncestryChange(unit: Unit) {
            unit.traits = [...ANCESTRY_TRAIT_MAP.get(unit.ancestry) || []];
            this.onUpdate();
        },
        onTraitChange(unit: Unit, traitDefinition: TraitDefinition) {
            // Find the index where the trait is.
            const index = unit.traits.findIndex(x => x == traitDefinition.name);

            // Replace at index, the new trait.
            unit.traits[index] = traitDefinition.newTrait || Trait.AAAUUUGH;
            this.onUpdate();
        },
        openModal() {
            const modal = {
                id: "obr.kingdom-warfare/modal",
                url: "/unit/",
                height: 300,
                width: 400
            } as Modal

            OBR.modal.open(modal);
        }
    }
})  
</script>
  
<style scoped>

.military {
    padding-bottom: 50px;
}

.unit {
    padding-bottom: 0.5rem;

    .name {
        width: 100%;
        margin: 0.25rem;
        height: 24px;
        float: left;
        align-self: center;
    }

    .caret {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(269deg) brightness(103%) contrast(107%);
        float: right;
        align-self: center;
    }

    .dropdown {
        margin: 0.25rem;
        width: 80px;
        height: 30px;
        align-self: center;
    }

    .tier {
        float: right;
        width: 50px;
        font-family: serif;
    }

    .trait-header {
        height: 0px;
        padding-top: 15px;
        padding-bottom: 15px;
        align-items: center;
    }

    .traits {
        float: left;
        display: grid;

        .selector {
            background: none;
            width: 20px;
        }

        .trait {
            float: left;
            margin: 0;
        }

        .remove-trait {
            float: right;
        }
    }
}

</style>