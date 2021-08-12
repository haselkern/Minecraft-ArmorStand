<template>
    <div>
        <div class="w-3/5 h-screen float-left">
            <Scene :armorstand="armorstand" />
        </div>
        <div class="w-2/5 float-right">
            <label><input v-model="armorstand.showArms" type="checkbox">Show Arms</label>
            <label><input v-model="armorstand.small" type="checkbox">Small</label>
            <label><input v-model="armorstand.noBasePlate" type="checkbox">No Base Plate</label>
            <hr>
            <table>
                <tr>
                    <td>Rotation</td>
                    <td colspan="3">
                        <input @dblclick="() => armorstand.rotation = 0" class="w-full" type="range" min="-180" max="180" v-model="armorstand.rotation" />
                    </td>
                </tr>
                <RotationSliderRow label="Head" :rotation="armorstand.head" />
                <RotationSliderRow label="Body" :rotation="armorstand.body" />
                <RotationSliderRow label="Left Leg" :rotation="armorstand.legLeft" />
                <RotationSliderRow label="Right Leg" :rotation="armorstand.legRight" />
                <RotationSliderRow v-if="armorstand.showArms" label="Left Arm" :rotation="armorstand.armLeft" />
                <RotationSliderRow v-if="armorstand.showArms" label="Right Arm" :rotation="armorstand.armRight" />
            </table>
        </div>
    </div>
</template>

<script>
import Scene from "./Scene.vue"
import RotationSliderRow from "./RotationSliderRow.vue"

// The Armorstand will hold all attributes for an armor stand.
class Armorstand {
    constructor() {
        // Rotation values for the body parts
        this.rotation = 0
        this.head = { x: 0, y: 0, z: 0 }
        this.body = { x: 0, y: 0, z: 0 }
        this.legLeft = { x: 0, y: 0, z: 0 }
        this.legRight = { x: 0, y: 0, z: 0 }
        this.armLeft = { x: 0, y: 0, z: 0 }
        this.armRight = { x: 0, y: 0, z: 0 }

        // Boolean attributes
        this.invisible = false
        this.invulnerable = false
        this.persistenceRequired = false
        this.noBasePlate = false
        this.noGravity = false
        this.showArms = false
        this.small = false
        this.marker = false
        this.centerCorrected = false

        // TODO Lots more to come
    }
    getScale() {
        if (this.small) {
            return { x: 0.6, y: 0.6, z: 0.6 }
        } else {
            return { x: 1, y: 1, z: 1 }
        }
    }
}

export default {
    data() {
        return {
            armorstand: new Armorstand(),
        }
    },
    components: { Scene, RotationSliderRow },
}
</script>
