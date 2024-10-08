<template>
    <div class="content military">
        <div class="unit" v-for="unit in domain.units">
            <button type="button" class="collapsible column" @click="openCollapsible(unit)">
                <div class="column">
                    <div class="row">
                        <input class="name" v-model="unit.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                        <div v-if="!isVisible" class="caret">
                            <img v-if="unit.show" src="/caret-up.svg">
                            <img v-if="!unit.show" src="/caret-down.svg">
                        </div>
                        <div v-if="isVisible" class="more">
                            <img class="dot" src="/more.svg">
                            <div class="more-options">
                                <div class="option-container caret">
                                    <img v-if="unit.show" src="/caret-up.svg">
                                    <img v-if="!unit.show" src="/caret-down.svg">
                                </div>
                                <div class="option-container tooltip">
                                    <input type="button" class="external-link-button" @click="openModal(unit)">
                                    <span class="tooltiptext">
                                        On click, open the Unit card.
                                    </span>
                                </div>
                                <div class="option-container tooltip">
                                    <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveUnit(unit)"/>
                                    <span class="tooltiptext">
                                        On click, remote the Unit.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="attribute-selector row">
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
            <div v-if="unit.show" class="collapsible-content row">
                <hr>
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
                </div>
                <div class="column advanced-section">
                    <div class="tooltip">
                        <span>Size</span>
                        <select class="dropdown" v-model="unit.size" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                            <option v-for="size in Size" :value="size">
                                {{ size }}
                            </option>
                        </select>
                        <span class="tooltiptext">Size: Represent the casuality die (e.g HP). A unit's die is decremented each time it fails a morale check and each time it takes casualties.</span>
                    </div>
                    <div class="tooltip">
                        <span>Tier</span>
                        <select class="dropdown tier" v-model="unit.tier" @click="preventPropagation" @change="onUpdate" :disabled="isDisabled">
                            <option v-for="tier in Tier" :value="tier">
                                {{ tier }}
                            </option>
                        </select>
                        <span class="tooltiptext">Tier: Measure of the unit's overall power or nastiness.</span>
                    </div>
                </div>
                <hr>
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="add-button" @click="onAddUnit"/>
            <span>Unit</span>
            <span class="tooltiptext">
                On click, add a Unit.
            </span>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'

import { TRAIT_DESCRIPTION_MAP, ANCESTRY_TRAIT_MAP, TraitDefinition } from '../../models/Trait.ts'

// @ts-ignore
import BaseTab from './BaseTab.js'
import { Unit, Experience, Equipment, Type, Ancestry, Tier, Trait, Size  } from '../../models/Unit.js';
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
            Trait,
            Size
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
                TRAIT_DESCRIPTION_MAP.get(trait) || "",
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
        openModal(unit: Unit) {
            this.preventPropagation(event);
            const queryParams = `name=${unit.name}&equipment=${unit.equipment}&experience=${unit.experience}&type=${unit.type}&ancestry=${unit.ancestry}&tier=${unit.tier}&size=${unit.size}&traits=${unit.traits}`

            const url = `/unit/?${queryParams}`.replace(/ /g, "_");

            const modal = {
                id: "obr.kingdom-warfare/modal",
                url: url,
                height: 500,
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

    .attribute-selector {
        justify-content: space-around
    }

    .advanced-section {
        justify-content: right;
        display: grid;
    }

    .caret {
        filter: invert(80%) sepia(29%) saturate(6341%) hue-rotate(207deg) brightness(100%) contrast(102%);;
        float: right;
        align-self: center;
    }

    .dropdown {
        margin: 0.25rem;
        width: 80px;
        height: 30px;
        align-self: center;
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

    .tier {
        font-family: initial;
    }
}

</style>