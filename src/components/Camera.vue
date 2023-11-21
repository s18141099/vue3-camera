<script setup lang="ts">
import { ref, onMounted } from "vue"

import Camera from "@/components/camera"
import Grid from "@/components/Grid.vue"
import RemoveButton from "@/components/RemoveButton.vue"

const shutterSpeed = 1000
let camera: Camera

const video = ref<HTMLVideoElement>()
const gridColor = ref<string>("rgba(255, 255, 255, 0.473)")
const backgroundColor = ref<string>("")
const isTaking = ref<boolean>(false)
const reloadKey = ref<number>(0)

const { gridLine, facingMode } = defineProps<{
    gridLine: boolean,
    facingMode: "user" | "environment",
}>()

const emits = defineEmits<{
    (e: "onSnapshot", v: string): void
}>()

const onSnapshot = () => {
    if (isTaking.value) return
    isTaking.value = true

    gridColor.value = "rgba(255, 255, 255, 0)"
    backgroundColor.value = "rgb(0, 0, 0)"
    reloadKey.value++

    const dataUrl = camera.snapshot()
    emits("onSnapshot", dataUrl || "")

    setTimeout(() => {
        gridColor.value = "rgba(255, 255, 255, 0.473)"
        backgroundColor.value = ""
        reloadKey.value++
    }, shutterSpeed * 0.1)

    setTimeout(() => {
        isTaking.value = false
    }, shutterSpeed)
}

onMounted(async () => {
    if (!video.value) return

    camera = new Camera(video.value, facingMode)
    const videoElement = await camera.init()
    if (!camera.stream || !videoElement) return

    video.value = videoElement
    video.value.srcObject = camera.stream
    video.value.play()
})
</script>

<template>
    <div id="camera">
        <video ref="video" width="1" height="1" autoplay></video>
        <Grid v-if="gridLine" :grid-color="gridColor" :background-color="backgroundColor" :key="reloadKey" />

        <div class="bottom">
            <RemoveButton class="RemoveButton" @on-snapshot="onSnapshot" />
        </div>
    </div>
</template>

<style>
body,
#app {
    margin: 0 !important;
    padding: 0 !important;
}
</style>

<style scoped>
video {
    object-fit: contain;
    width: 100vw;
    height: 100vh;
}

#camera {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
}

.bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100vw;
    bottom: 20px;
}
</style>