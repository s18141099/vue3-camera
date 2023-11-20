class Camera {
    private video: HTMLVideoElement
    private quality: number
    private facingMode: "user" | "environment"
    public stream: MediaStream | undefined

    constructor(
        video: HTMLVideoElement,
        facingMode: "user" | "environment" = "environment",
        quality: number = 1
    ) {
        this.video = video
        this.facingMode = facingMode
        this.quality = quality

        this.lockScreen()
    }

    public async init(): Promise<HTMLVideoElement | undefined> {
        const stream = await this.mountMediaStream()
        if (!stream) return

        this.stream = stream
        this.setTrackSize(this.stream)

        return this.video
    }

    private lockScreen = () => {
        document.querySelector("#camera")?.addEventListener('touchmove', function (event) {
            event.preventDefault()
        }, { passive: false })
    }

    private setTrackSize(stream: MediaStream) {
        const videoTrack = stream.getVideoTracks()[0]
        const { width, height } = videoTrack.getSettings()
        videoTrack.applyConstraints({
            width: { ideal: Number(width) },
            height: { ideal: Number(height) },
        })

        if (!this.video) return
        this.video.width = Number(width)
        this.video.height = Number(height)
    }

    private async mountMediaStream(): Promise<MediaStream | null> {
        if (!navigator.mediaDevices.getUserMedia) return null

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: window.outerWidth * this.quality,
                height: window.outerHeight * this.quality,
                facingMode: this.facingMode
            },
            audio: false,
        })

        return stream
    }

    public snapshot = () => {
        if (!this.video) return null

        const canvas = document.createElement("canvas")
        canvas.width = this.video.width
        canvas.height = this.video.height

        const context = canvas.getContext("2d")
        if (!context) return null

        context.drawImage(this.video, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL("image/png")

        canvas.remove()

        return dataURL
    }
}

export default Camera