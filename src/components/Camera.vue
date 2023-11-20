<script setup lang="ts">
import { ref, onMounted } from "vue"
import Camera from "@/components/camera"

import Button from "@/components/Button.vue"
import Grid from "@/components/Grid.vue"

const shutterSpeed = 300
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
    backgroundColor.value = "rgba(45, 45, 45)"
    reloadKey.value++

    setTimeout(() => {
        gridColor.value = "rgba(255, 255, 255, 0.473)"
        backgroundColor.value = ""
        reloadKey.value++
    }, shutterSpeed * 0.3)

    setTimeout(() => {
        isTaking.value = false

        const dataUrl = camera.snapshot()
        emits("onSnapshot", dataUrl || "")
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
        <Button class="Button" @on-snapshot="onSnapshot" />
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
    width: -webkit-fill-available;
}

#camera {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: -webkit-fill-available;
    height: -webkit-fill-available;
}

.Button {
    position: fixed;
    bottom: 20px;
}
</style>