<script setup lang="ts">
const snapshotBtnSize = "55px"
const snapshotBtnColor = "rgba(250, 250, 250, .9)"

const emits = defineEmits<{
    (e: "onSnapshot", v: boolean): void
}>()

const onSnapshot = () => {
    emits("onSnapshot", true)
}
</script>

<template>
    <div class="snapshot" @click="onSnapshot" @contextmenu="(e) => { e.preventDefault() }">
        <button class="snapshot-inline" @contextmenu="(e) => { e.preventDefault() }"></button>
    </div>
</template>

<style scoped>
.snapshot {
    z-index: 214;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: v-bind(snapshotBtnSize);
    height: v-bind(snapshotBtnSize);
    border: solid 4px v-bind(snapshotBtnColor);
}

.snapshot-inline {
    border-radius: 50%;
    border: none;
    width: calc(v-bind(snapshotBtnSize) * .75);
    height: calc(v-bind(snapshotBtnSize) * .75);
    background-color: v-bind(snapshotBtnColor);
    transition: 70ms;
}

.snapshot-inline:active {
    width: calc(v-bind(snapshotBtnSize) * .7);
    height: calc(v-bind(snapshotBtnSize) * .7);
}
</style>