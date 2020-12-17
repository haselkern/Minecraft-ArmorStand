<template>
    <!-- Armorstand -->
    <object3d :position="{y: -1}">
        <!-- BasePlate -->
        <mesh :position="{x: 0, y: -1/32, z: 0}">
            <material type="MeshPhong" :color="colorStone"></material>
            <geometry type="Box" :args="[12/16, 1/16, 12/16]"></geometry>
        </mesh>
        <!-- Little direction indicator for the baseplate -->
        <mesh :position="{x: 0, y: -1/32, z: 10/16}">
            <material type="MeshPhong" :color="colorStone"></material>
            <geometry type="Box" :args="[2/16, 1/16, 4/16]"></geometry>
        </mesh>
        <!-- Left leg -->
        <object3d :position="{x: 2/16, y: 11/16, z: 0}">
            <mesh :position="{x: 0, y: -5.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 11/16, 2/16]"></geometry>
            </mesh>
        </object3d>
        <!-- Right leg -->
        <object3d :position="{x: -2/16, y: 11/16, z: 0}">
            <mesh :position="{x: 0, y: -5.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 11/16, 2/16]"></geometry>
            </mesh>
        </object3d>
        <!-- Left arm -->
        <object3d :position="{x: 6/16, y: 21/16, z: 0}">
            <mesh :position="{x: 0, y: -4/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 12/16, 2/16]"></geometry>
            </mesh>
        </object3d>
        <!-- Right arm -->
        <object3d :position="{x: -6/16, y: 21/16, z: 0}">
            <mesh :position="{x: 0, y: -4/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 12/16, 2/16]"></geometry>
            </mesh>
        </object3d>
        <!-- Body -->
        <object3d :position="{x: 0, y: 23/16, z: 0}">
            <!-- Hip -->
            <mesh :position="{x: 0, y: -11/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[8/16, 2/16, 2/16]"></geometry>
            </mesh>
            <!-- Left side -->
            <mesh :position="{x: 2/16, y: -6.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 7/16, 2/16]"></geometry>
            </mesh>
            <!-- Right side -->
            <mesh :position="{x: -2/16, y: -6.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 7/16, 2/16]"></geometry>
            </mesh>
            <!-- Shoulders -->
            <mesh :position="{x: 0, y: -1.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[12/16, 3/16, 3/16]"></geometry>
            </mesh>
        </object3d>
        <!-- Head -->
        <object3d :position="{x: 0, y: 22/16, z: 0}">
            <!-- Neck -->
            <mesh :position="{x: 0, y: 3.5/16, z: 0}">
                <material type="MeshPhong" :color="colorWood"></material>
                <geometry type="Box" :args="[2/16, 7/16, 2/16]"></geometry>
            </mesh>
            <!-- Skull -->
            <mesh :position="{x: 0, y: 5/16, z: 0}">
                <material type="MeshPhong" :color="colorStone"></material>
                <geometry type="Box" :args="[10/16, 10/16, 10/16]"></geometry>
            </mesh>
        </object3d>
    </object3d>
</template>

<script>
export default {
    data() {
        // TODO This should be a prop "pose" to allow external modification
        return {
            colorWood: 0xCC933D,
            colorStone: 0x888888,
        };
    },
}
</script>