<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import actions from "../store/actions";
import getters from "../store/getters";
import mutations from "../store/mutations";

export default {
    name: "InitAddon",
    computed: {
        ...mapGetters("Modules/InitAddon", Object.keys(getters))
    },
    mounted () {
        this.runTasks();
    },
    methods: {
        ...mapMutations("Modules/InitAddon", Object.keys(mutations)),
        ...mapActions("Modules/InitAddon", Object.keys(actions)),
        ...mapActions("Maps", ["placingPointMarker"])
    }
};
</script>

<template>
    <div />
</template>
