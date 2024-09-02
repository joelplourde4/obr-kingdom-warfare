<template>
    <div class="content">
        <div class="relation" v-for="relation in domain.relations">
            <div class="row">  
                <div v-if="isVisible" class="show">
                    <div v-if="!relation.show" class="tooltip">
                        <input type="button" class="show-button" @click="onToggleRelation(relation)"/>
                        <span class="tooltiptext">
                            Is shown to the Player, click to hide.
                        </span>
                    </div>
                    <div v-if="relation.show" class="tooltip">
                        <input type="button" class="hide-button" @click="onToggleRelation(relation)"/>
                        <span class="tooltiptext">
                            Is hidden from the player, click to show.
                        </span>
                    </div>
                </div>
                <div v-if="isShown(relation)" class="group">
                    <button type="button" class="collapsible" @click="openCollapsible(relation)">
                        <div>
                            <img v-if="!isVisible" class="image" :src="relation.img">
                            <img v-if="isVisible" class="image" :src="relation.img" @click="uploadImage(relation)">
                        </div>
                        <input class="name" v-model="relation.name" @input="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                        <select class="dropdown" v-model="relation.relationStatus" @change="onUpdate" @click="preventPropagation" :disabled="isDisabled">
                            <option v-for="status in RelationStatus" :value="status">
                                {{ status }}
                            </option>
                        </select>
                        <div class="caret">
                            <img v-if="relation.expand" src="/caret-up.svg">
                            <img v-if="!relation.expand" src="/caret-down.svg">
                        </div>
                        <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveRelation(relation)"/>
                    </button>
                    <div v-if="relation.expand" class="collapsible-content">
                    <div class="officer row" v-for="officer in relation.officers">
                        <img class="image" src="/person.svg">
                        <div class="container">
                            <input class="name" v-model="officer.name" @input="onUpdate" :disabled="isDisabled">
                            <input class="description" v-model="officer.description" @input="onUpdate" :disabled="isDisabled">
                        </div>
                        <input v-show="isVisible" type="button" class="remove-button" @click="onRemoveOfficer(relation, officer)"/>
                    </div>
                    <input v-show="isVisible" type="button" class="add-button" @click="onAddOfficer(relation)"/>
                </div>
            </div>
            </div>
        </div>
        <input v-show="isVisible" type="button" class="add-button" @click="onAddRelation"/>
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
            return relation.show;
        },
        openCollapsible(relation: Relation) {
            relation.expand = !relation.expand;
        },
        onToggleRelation(relation: Relation) {
            relation.show = !relation.show;
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
        async uploadImage(relation: Relation) {
            this.preventPropagation(event);
            const images = await OBR.assets.downloadImages(false, "The Barony of Bloodstone/heraldry/Heraldry - ", "NOTE");
            if (images.length > 0) {
                relation.img = images[0].image.url;
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
        margin: auto;
        height: 25px;
        width: 25px;
    }

    .group {
        width: 100%;
    }

    .image {
        height: 40px;
        width: 40px;
        margin: auto;
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
}
</style>