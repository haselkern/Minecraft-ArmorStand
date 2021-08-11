<template>
    <div class="flex">
        <div class="flex-1 h-screen">
            <Scene :rot="roty" />
        </div>
        <div class="flex-none w-60">
            <h1>{{ roty }}</h1>
            <input type="range" min="0" max="100" v-model="roty" />
        </div>
    </div>
</template>

<script>
import Scene from "./Scene.vue"

export default {
    data() {
        return {
            roty: 0,
        }
    },
    components: {Scene},
}
</script>
