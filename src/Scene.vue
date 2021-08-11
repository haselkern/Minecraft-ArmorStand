<template>
    <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: false }" resize="true">
        <Camera :position="{ z: 10 }" />
        <Scene>
            <AmbientLight :intensity="0.3" />
            <DirectionalLight :intensity="1" :position="{ x: 10, y: 9 }" />
            <Box ref="box" :rotation="{ y: rot / Math.PI / 4 }">
                <LambertMaterial />
            </Box>
        </Scene>
    </Renderer>
</template>
  
<script>

import { Box, Camera, LambertMaterial, AmbientLight, Renderer, Scene } from 'troisjs';

export default {
    props: ["rot"],
    mounted() {
        // const renderer = this.$refs.renderer
        // const box = this.$refs.box.mesh
        // renderer.onBeforeRender(() => {
        //     box.rotation.x += 0.01
        // })
    },
    components: { Box, Camera, LambertMaterial, Renderer, Scene },
}
</script>
  
<style>
body {
    margin: 0;
}
canvas {
    display: block;
}
</style>
  