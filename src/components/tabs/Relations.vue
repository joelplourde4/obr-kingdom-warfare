<template>
    <div class="content">
        <p v-if="domain.relations.length === 0 && !isEditMode">There are no known relations at this time.</p>
        <div class="relation" v-for="relation in domain.relations">
            <div class="row">  
                <div v-if="isShown(relation)" class="group">
                    <button type="button" class="collapsible" @click="openCollapsible(relation)">
                    <div>
                        <img v-if="!isVisible" class="image not-clickable" :src="relation.img">
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
                        <img class="dot" src="/more.svg">
                        <div class="more-options">
                            <div class="option-container caret">
                                <img v-if="relation.expand" src="/caret-up.svg">
                                <img v-if="!relation.expand" src="/caret-down.svg">
                            </div>
                            <div v-if="!relation.show" class="option-container tooltip">
                                <input type="button" class="icon-button show-button" @click="onToggleRelation(relation)"/>
                                <span class="tooltiptext">
                                    Is shown to the players, click to hide.
                                </span>
                            </div>
                            <div v-if="relation.show" class="option-container tooltip">
                                <input type="button" class="icon-button hide-button" @click="onToggleRelation(relation)"/>
                                <span class="tooltiptext">
                                    Is hidden from the players, click to show.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" :disabled="relation.id === 0" class="icon-button arrow-up-button" @click="onMoveRelation(relation, -1)"/>
                                <span class="tooltiptext">
                                    On click, move the Relation up.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" class="icon-button arrow-down-button" :disabled="relation.id === domain.relations.length - 1" @click="onMoveRelation(relation, 1)"/>
                                <span class="tooltiptext">
                                    On click, move the Relation down.
                                </span>
                            </div>
                            <div class="option-container tooltip">
                                <input type="button" class="icon-button remove-button" @click="onRemoveRelation(relation)"/>
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
                                    <textarea class="description"
                                        ref="textarea"
                                        v-model="officer.description"
                                        @input="onTextAreaChange"
                                        :disabled="isDisabled"
                                        :class="isDisabled ? 'disabled read-only' : 'edit-mode'"
                                    />
                                </div>
                                <div v-if="isVisible" class="more">
                                    <img class="dot" src="/more.svg">
                                    <div class="more-options">
                                        <div v-if="!officer.show" class="option-container tooltip">
                                            <input type="button" class="icon-button show-button" @click="onToggleOfficer(officer)"/>
                                            <span class="tooltiptext">
                                                Is shown to the players, click to hide.
                                            </span>
                                        </div>
                                        <div v-if="officer.show" class="option-container tooltip">
                                            <input type="button" class="icon-button hide-button" @click="onToggleOfficer(officer)"/>
                                            <span class="tooltiptext">
                                                Is hidden from the players, click to show.
                                            </span>
                                        </div>
                                        <div class="option-container tooltip">
                                            <input type="button" :disabled="officer.id === 0" class="icon-button arrow-up-button" @click="onMoveOfficer(relation, officer, -1)"/>
                                            <span class="tooltiptext">
                                                On click, move the Officer up.
                                            </span>
                                        </div>
                                        <div class="option-container tooltip">
                                            <input type="button" class="icon-button arrow-down-button" :disabled="officer.id === relation.officers.length - 1" @click="onMoveOfficer(relation, officer, 1)"/>
                                            <span class="tooltiptext">
                                                On click, move the Officer down.
                                            </span>
                                        </div>
                                        <div class="option-container tooltip">
                                            <input v-show="isVisible" type="button" class="icon-button remove-button remove-officer" @click="onRemoveOfficer(relation, officer)"/>
                                            <span class="tooltiptext">
                                                On click, remove the Officer.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-show="isVisible" class="add-button-container tooltip">
                            <input type="button" class="icon-button add-button" @click="onAddOfficer(relation)"/>
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
            <input type="button" class="icon-button add-button" @click="onAddRelation"/>
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

import BaseTab from './BaseTab.ts'
    
export default defineComponent({
    mixins: [utils],
    extends: BaseTab,
    name: 'Relation',
    data() {
        return {
            RelationStatus
        }
    },
    created() {
        this.domain.relations.forEach((relation: Relation, i: number) => { 
            relation.id = i;
            relation.officers.forEach((officer: Officer, j: number) => {
                officer.id = j;
            })
        });
    },
    updated() {
        this.resizeAllTextArea();
    },
    methods: {
        onTabSelected() {
            this.resizeAllTextArea();
        },
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
        onMoveOfficer(relation: Relation, officer: Officer, direction: number) {
            const index = relation.officers.indexOf(officer);
            const newIndex = index + direction;

            // Invert the position in the Relation array
            if (newIndex >= 0 && newIndex < relation.officers.length) {
                relation.officers.splice(index, 1);
                relation.officers.splice(newIndex, 0, officer);
            }

            // Re-calculate each index
            relation.officers.forEach((officer: Officer, index: number) => {
                officer.id = index;
            });

            this.onUpdate();
        },
        onMoveRelation(relation: Relation, direction: number) {
            const index = this.domain.relations.indexOf(relation);
            const newIndex = index + direction;

            // Invert the position in the Relation array
            if (newIndex >= 0 && newIndex < this.domain.relations.length) {
                this.domain.relations.splice(index, 1);
                this.domain.relations.splice(newIndex, 0, relation);
            }

            // Re-calculate each index
            this.domain.relations.forEach((relation: Relation, index: number) => {
                relation.id = index;
            });

            this.onUpdate();
        },
        onAddRelation() {
            const relationId = this.domain.relations.length;
            this.domain.relations.push(new Relation(relationId));
            this.onUpdate();
        },
        onRemoveRelation(relation: Relation) {
            this.domain.relations = this.domain.relations.filter((x: Relation) => {
                return x !== relation
            });
            this.onUpdate();
        },
        onAddOfficer(relation: Relation) {
            const officerId = relation.officers.length;
            relation.officers.push(new Officer(officerId))
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
            const images = await OBR.assets.downloadImages(false, "Token", "NOTE");
            if (images.length > 0) {
                relation.img = images[0].image.url;
                this.onUpdate();
            }
        },
        async uploadOfficerImage(officer: Officer) {
            this.preventPropagation(event);
            const images = await OBR.assets.downloadImages(false, "Token", "NOTE");
            if (images.length > 0) {
                officer.img = images[0].image.url;
                this.onUpdate();
            }
        },
        onTextAreaChange(event: any) {
            this.resizeTextArea(event.target);
            return this.onUpdate();
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

    .not-clickable {
        cursor: default;
    }

    .portrait {
        border-radius: 25px;
        cursor: pointer;
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
        filter: invert(80%) sepia(29%) saturate(6341%) hue-rotate(207deg) brightness(100%) contrast(102%);;
        float: right;
        align-self: center;
    }
}

.officer {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;

    .container {
        width: 100%;

        .read-only {
            resize: none;
            min-width: 95%;
        }

        .edit-mode {
            max-width: 95%;
            min-width: 95%;
        }
    }
}
</style>