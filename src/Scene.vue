<template>
    <Renderer ref="renderer" antialias resize alpha :orbit-ctrl="{ enableDamping: false, enablePan: false }">
        <Camera :position="{ z: 10 }" />
        <Scene>
            <AmbientLight :intensity="0.3" />
            <DirectionalLight :intensity="1" :position="{ x: 10, y: 9 }" />

            <!-- This group contains armorstand + base plate -->
            <Group :position="{ y: -1 }">
                <!--Baseplate-->
                <Group :position="{ y: -0.5 / 16 }">
                    <Box :visible="!armorstand.noBasePlate" :scale="{ x: 12 / 16, y: 1 / 16, z: 12 / 16 }">
                        <LambertMaterial />
                    </Box>
                    <Box :position="{ z: 10 / 16}" :scale="{ x: 2 / 16, y: 1 / 16, z: 4 / 16 }">
                        <LambertMaterial />
                    </Box>
                </Group>
                <!--Armorstand-->
                <Group :scale="armorstand.getScale()" :rotation="{ y: armorstand.rotation / 180 * Math.PI }">
                    <!--Left Leg-->
                    <Group
                        :rotation="convertRotation(armorstand.legLeft)"
                        :position="{ x: 2 / 16, y: 11 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: -5.5 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 11 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                    <!--Right Leg-->
                    <Group
                        :rotation="convertRotation(armorstand.legRight)"
                        :position="{ x: -2 / 16, y: 11 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: -5.5 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 11 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                    <!--Left Arm-->
                    <Group
                        :visible="armorstand.showArms"
                        :rotation="convertRotation(armorstand.armLeft)"
                        :position="{ x: 6 / 16, y: 21 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: -4 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 12 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                    <!--Right Arm-->
                    <Group
                        :visible="armorstand.showArms"
                        :rotation="convertRotation(armorstand.armRight)"
                        :position="{ x: -6 / 16, y: 21 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: -4 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 12 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                    <!--Body-->
                    <Group
                        :rotation="convertRotation(armorstand.body)"
                        :position="{ x: 0 / 16, y: 23 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: -11 / 16, z: 0 }"
                            :scale="{ x: 8 / 16, y: 2 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                        <Box
                            :position="{ x: 2 / 16, y: -6.5 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 7 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                        <Box
                            :position="{ x: -2 / 16, y: -6.5 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 7 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                        <Box
                            :position="{ x: 0 / 16, y: -1.5 / 16, z: 0 }"
                            :scale="{ x: 12 / 16, y: 3 / 16, z: 3 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                    <!--Head-->
                    <Group
                        :rotation="convertRotation(armorstand.head)"
                        :position="{ x: 0 / 16, y: 22 / 16, z: 0 }">
                        <Box
                            :position="{ x: 0, y: 3.5 / 16, z: 0 }"
                            :scale="{ x: 2 / 16, y: 7 / 16, z: 2 / 16 }">
                            <LambertMaterial />
                        </Box>
                        <Box
                            :position="{ x: 0, y: 5 / 16, z: 0 }"
                            :scale="{ x: 10 / 16, y: 10 / 16, z: 10 / 16 }">
                            <LambertMaterial />
                        </Box>
                    </Group>
                </Group>
            </Group>
        </Scene>
    </Renderer>
</template>
  
<script>

import { Box, Camera, LambertMaterial, AmbientLight, Renderer, Scene, Object3D } from "troisjs";

export default {
    props: ["armorstand"],
    mounted() {
        // const renderer = this.$refs.renderer
        // const box = this.$refs.box.mesh
        // renderer.onBeforeRender(() => {
        //     box.rotation.x += 0.01
        // })
    },
    methods: {
        convertRotation: function (rot) {
            // TODO Convert Minecraft to ThreeJS rotation here
            return {
                x: rot.x / 180 * Math.PI,
                y: rot.y / 180 * Math.PI,
                z: rot.z / 180 * Math.PI,
            }
        }
    },
    components: { Box, Camera, LambertMaterial, Renderer, Scene, Object3D },
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
  