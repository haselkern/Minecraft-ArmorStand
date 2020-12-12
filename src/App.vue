<template>
    <div class="grid grid-cols-5 min-h-screen bg-gray-200">
        <div class="col-span-3"></div>
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
                        <td colspan="3"><input v-model="rotation" class="w-full" type="range" min="0" max="360"></td>
                    </tr>
                    <tr>
                        <td>Head</td>
                        <td><input class="w-full" type="range" min="0" max="360"></td>
                        <td><input class="w-full" type="range" min="0" max="360"></td>
                        <td><input class="w-full" type="range" min="0" max="360"></td>
                    </tr>
                </table>
            </card>
        </div>
    </div>
</template>

<script>
import Card from "./components/Card";

export default {
    components: {Card},
    data() {
        return {
            rotation: 0,
        };
    },
}
</script>
