<template>
    <div class="grid grid-cols-5 min-h-screen bg-gray-700">
        <div ref="rendererwrapper" class="col-span-3">
            <renderer :obj="renderer" :size="{w: 400, h: 400}">
                <scene>
                    <camera :obj="camera" :position="{ z: 5 }"></camera>
                    <light :hex="0xEEEEEE" :position="{x: 10, y: 10, z: 10}"></light>
                    <light :obj="ambientLight"></light>
                    <mesh :rotation="rotationInRad">
                        <geometry type="Box" :args="[1, 1, 1]"></geometry>
                        <material type="MeshLambert" :obj="testMaterial"></material>
                    </mesh>
                </scene>
            </renderer>
        </div>
        <div class="col-span-2">
            <card class="text-center">
                <h1 class="text-2xl font-bold">Minecraft Armorstand</h1>
                <a
                    title="Source Code"
                    href="https://github.com/haselkern/Minecraft-ArmorStand"
                    class="inline-flex items-center justify-center w-8 h-8 m-2 text-white bg-gray-700 rounded-lg">
                    <i class="fas fa-code"></i>
                </a>
                <a
                    title="Help"
                    href="https://haselkern.com/armorstand/"
                    class="inline-flex items-center justify-center w-8 h-8 m-2 text-white bg-gray-700 rounded-lg">
                    <i class="fas fa-question"></i>
                </a>
            </card>
            <card>
                <h1 class="text-xl">Pose</h1>
                <table class="w-full">
                    <tr>
                        <td>Rotation</td>
                        <td colspan="3"><input class="w-full" type="range" min="0" max="360"></td>
                    </tr>
                    <tr>
                        <td>Head</td>
                        <td><input v-model="rotation.x" class="w-full" type="range" min="0" max="360"></td>
                        <td><input v-model="rotation.y" class="w-full" type="range" min="0" max="360"></td>
                        <td><input v-model="rotation.z" class="w-full" type="range" min="0" max="360"></td>
                    </tr>
                </table>
            </card>
        </div>
    </div>
</template>

<script>
import Card from "./components/Card";
import * as THREE from "three";

export default {
    components: {Card},
    data() {
        return {
            renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
            camera: new THREE.PerspectiveCamera(70, 400 / 400, 0.1, 100),
            testMaterial: new THREE.MeshLambertMaterial({color: 0x826841}),
            ambientLight: new THREE.AmbientLight(0x333333),
            rotation: {x: 30, y: 40, z: 0},
        };
    },
    mounted() {
        this.resize();
        window.resize = this.resize;
    },
    methods: {
        resize() {
            let el = this.$refs.rendererwrapper;
            let w = el.clientWidth;
            let h = el.clientHeight;
            this.camera.aspect = w/h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        },
    },
    computed: {
        rotationInRad() {
            return {
                x: this.rotation.x/180*Math.PI,
                y: this.rotation.y/180*Math.PI,
                z: this.rotation.z/180*Math.PI,
            };
        },
    },
}
</script>
