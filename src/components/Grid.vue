<script setup lang="ts">
const { gridColor, backgroundColor } = withDefaults(defineProps<{
    gridColor?: string,
    backgroundColor?: string
}>(), {
    gridColor: "rgba(255, 255, 255, 0.473)",
    backgroundColor: ""
})

const gridLine = `1px 1px 1px 0px ${gridColor}`
</script>

<template>
    <div class="grids">
        <div class="grid" v-for="i in 9"></div>
    </div>
</template>

<style scoped>
.grids {
    display: flex;
    position: fixed;
    flex-wrap: wrap;
    min-height: -webkit-fill-available;
    min-width: -webkit-fill-available;
    background-color: v-bind(backgroundColor);
    transition: 90ms;
}

.grid {
    min-height: calc(100% / 3);
    min-width: calc(100% / 3);
    box-shadow: v-bind(gridLine);
}
</style>