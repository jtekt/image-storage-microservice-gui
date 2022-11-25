<template>
<v-expansion-panels>
    <v-expansion-panel>
        <v-expansion-panel-header>
            Add fields
        </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row v-for="(field, index) in fields" :key="index" align="baseline">
                <v-col>
                    <v-text-field label="Field" v-model="field.key" />
                </v-col>
                <v-col>
                    <v-text-field label="Value" v-model="field.value" />
                </v-col>
                <v-col cols="auto">
                    <v-btn icon @click="deleteField(index)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="auto">
                    <v-btn text @click="addField()">
                        <v-icon left>mdi-plus</v-icon>
                        <span>Add field</span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-expansion-panel-content>
    </v-expansion-panel>
</v-expansion-panels>
</template>

<script>
export default {
    name: 'UploadFields',
    props: {
        value: Array,
    },
    data(){
        return {
            // fields: [],

        }
    },
    methods: {
        addField() {
            this.fields.push({ key: '', value: '' })
        },
        deleteField(index) {
            this.fields.splice(index, 1)
        }
    },
    computed: {
        fields: {
            get(){
                return this.value
            },
            set(newVal){
                this.$emit('input', newVal)
            }
        }
    }
}

</script>