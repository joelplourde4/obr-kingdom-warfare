<template>
    <div class="content">
        <div class="relation" v-for="relation in domain.relations">
            <div class="row">  
                <div v-if="isShown(relation)" class="group">
                    <button type="button" class="collapsible" @click="openCollapsible(relation)">
                    <div>
                        <img v-if="!isVisible" class="image" :src="relation.img">
                        <img v-if="isVisible" class="image" :src="relation.img" @click="uploadRelationImage(relation)">
                    </div>
                    <input class="name" v-model="relation.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                    <select class="dropdown" v-model="relation.relationStatus" @change="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                        <option v-for="status in RelationStatus" :value="status">
                            {{ status }}
                        </option>
                    </select>
                    <div v-if="!isVisible" class="caret">
                        <img v-if="relation.expand" src="/caret-up.svg">
                        <img v-if="!relation.expand" src="/caret-down.svg">
                    </div>
                    <div v-else class="more">
                        <img src="/more.svg">
                        <div class="more-options">
                            <div class="option-container caret">
                                <img v-if="relation.expand" src="/caret-up.svg">
                                <img v-if="!relation.expand" src="/caret-down.svg">
                            </div>
                            <div v-if="!relation.show" class="option-container tooltip">
                                <input type="button" class="show-button" @click="onToggleRelation(relation)"/>
                                <span class="tooltiptext">
                                    Is shown to the players, click to hide.
                                </span>
                            </div>
                            <div v-if="relation.show" class="option-container tooltip">
                                <input type="button" class="hide-button" @click="onToggleRelation(relation)"/>
                                <span class="tooltiptext">
                                    Is hidden from the players, click to show.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" class="remove-button" @click="onRemoveRelation(relation)"/>
                                <span class="tooltiptext">
                                    On click, remove the Relation.
                                </span>
                            </div>
                        </div>
                    </div>
                    </button>
                    <div v-if="relation.expand" class="collapsible-content">
                        <div v-for="officer in relation.officers">
                            <div v-if="isOfficerShown(officer)" class="officer row">
                                <div>
                                    <img v-if="!isVisible" class="image portrait" :src="officer.img">
                                    <img v-if="isVisible" class="image portrait" :src="officer.img" @click="uploadOfficerImage(officer)">
                                </div>
                                <div class="container">
                                    <input class="name" v-model="officer.name" @input="onUpdate" :disabled="isDisabled">
                                </div>
                                <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveOfficer(relation, officer)"/>
                            </div>
                        </div>
                        <div v-show="isVisible" class="add-button-container tooltip">
                            <input type="button" class="add-button" @click="onAddOfficer(relation)"/>
                            <span>Officer</span>
                            <span class="tooltiptext">
                                On click, add an Officer.
                            </span>
                        </div>
                </div>
            </div>
            </div>
        </div>
        <div v-show="isVisible" class="add-button-container tooltip">
            <input type="button" class="add-button" @click="onAddRelation"/>
            <span>Relation</span>
            <span class="tooltiptext">
                On click, add a Relation.
            </span>
        </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import { utils } from '../../mixins/utils'
import OBR from "@owlbear-rodeo/sdk";
import { Relation, RelationStatus, Officer } from '../../models/Relation';

// @ts-ignore
import BaseTab from './BaseTab.js'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Relation',
    data() {
        return {
            RelationStatus
        }
    },
    methods: {
        isShown(relation: Relation) {
            if (this.isGM) {
                return true;
            }
            return !relation.show;
        },
        isOfficerShown(officer: Officer) {
            if (this.isGM) {
                return true;
            }
            return !officer.show;
        },
        openCollapsible(relation: Relation) {
            relation.expand = !relation.expand;
        },
        onToggleRelation(relation: Relation) {
            this.preventPropagation(event);
            relation.show = !relation.show;
            this.onUpdate();
        },
        onToggleOfficer(officer: Officer) {
            officer.show = !officer.show;
            this.onUpdate();
        },
        onAddRelation() {
            this.domain.relations.push(new Relation());
            this.onUpdate();
        },
        onRemoveRelation(relation: Relation) {
            this.domain.relations = this.domain.relations.filter((x: Relation) => {
                return x !== relation
            });
            this.onUpdate();
        },
        onAddOfficer(relation: Relation) {
            relation.officers.push(new Officer())
            this.onUpdate();
        },
        onRemoveOfficer(relation: Relation, officer: Officer) {
            relation.officers = relation.officers.filter((x) => {
                return x !== officer
            });
            this.onUpdate();
        },
        async uploadRelationImage(relation: Relation) {
            this.preventPropagation(event);
            const images = await OBR.assets.downloadImages(false, "The Barony of Bloodstone/heraldry/Heraldry - ", "NOTE");
            if (images.length > 0) {
                relation.img = images[0].image.url;
                this.onUpdate();
            }
        },
        async uploadOfficerImage(officer: Officer) {
            this.preventPropagation(event);
            const images = await OBR.assets.downloadImages(false, "The Barony of Bloodstone", "NOTE");
            if (images.length > 0) {
                officer.img = images[0].image.url;
                this.onUpdate();
            }
        }
    }
})
    
</script>
<style scoped>

.relation {
    padding-bottom: 0.5rem;

    .show {
        display: flex;
        margin-bottom: auto;
        height: 25px;
        width: 25px;
    }

    .group {
        width: 100%;
    }

    .small-group {
        width: 95%;
    }

    .image {
        height: 40px;
        width: 40px;
        margin: auto;
    }

    .portrait {
        border-radius: 25px;
    }
    
    .name {
        margin: 0.25rem;
        height: 24px;
        float: left;
        align-self: center;
    }

    .description {
        margin: 0.25rem;
    }

    .dropdown {
        margin: 0.25rem;
        width: 130px;
        height: 30px;
        align-self: center;
    }

    .caret {
        filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(269deg) brightness(103%) contrast(107%);
        float: right;
        align-self: center;
    }
}

.officer {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
}
</style>