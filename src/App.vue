<template>
    <div class="box-border">
        <div class="w-3/5 fixed h-screen">
            <Scene :armorstand="armorstand" />
        </div>
        <div class="w-2/5 right-0 ml-60">
            <div class="bg-white m-4 p-4 border border-gray-900">

                <select v-model="mcVersion">
                    <option value="1.16">Minecraft 1.16 and above</option>
                    <option value="1.14">Minecraft 1.14 &amp; 1.15</option>
                    <option value="1.13">Minecraft 1.13</option>
                    <option value="1.11">Minecraft 1.11 &amp; 1.12</option>
                    <option value="1.9">Minecraft 1.9 &amp; 1.10</option>
                    <option value="1.8">Minecraft 1.8</option>
                </select>
                <label><input v-model="armorstand.noBasePlate" type="checkbox">No Base Plate</label>
                <label><input v-model="armorstand.noGravity" type="checkbox">No Gravity</label>
                <label><input v-model="armorstand.showArms" type="checkbox">Show Arms</label>
                <label><input v-model="armorstand.small" type="checkbox">Small</label>
                <details>
                    <summary>Advanced</summary>
                    <label><input v-model="armorstand.invisible" type="checkbox">Invisible</label>
                    <label><input v-model="armorstand.invulnerable" type="checkbox">Invulnerable</label>
                    <label><input v-model="armorstand.persistenceRequired" type="checkbox">Persistence Required</label>
                    <label><input v-model="armorstand.marker" type="checkbox">Marker</label>
                    <label><input v-model="armorstand.centerCorrected" type="checkbox">Center Corrected</label>
                </details>

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

                <hr>

                <label><input v-model="armorstand.enableEquipment" type="checkbox">Enable Equipment</label>
                <div v-if="armorstand.enableEquipment">
                    <input v-model="armorstand.equipHandRight" placeholder="Item in right hand"/>
                    <input v-model="armorstand.equipHandLeft" placeholder="Item in left hand"/>
                    <input v-model="armorstand.equipBoots" placeholder="Boots"/>
                    <input v-model="armorstand.equipLeggings" placeholder="Leggings"/>
                    <input v-model="armorstand.equipChestplate" placeholder="Chestplate"/>
                    <input v-model="armorstand.equipHelmet" placeholder="Helmet"/>
                    <select v-model="armorstand.helmetMode">
                        <option value="item">Item Name</option>
                        <option value="name">Player Name</option>
                        <option value="url">Image URL</option>
                    </select>
                </div>

                <hr>
                
                <input v-model="armorstand.customName" placeholder="Custom Name"/>
                <label><input v-model="armorstand.showCustomName" type="checkbox">Show custom name</label>
                <div v-if="armorstand.showCustomName">
                    <select v-model="armorstand.customNameColor">
                        <option value="">None</option>
                        <option value="black">Black</option>
                        <option value="dark_blue">Dark Blue</option>
                        <option value="dark_green">Dark Green</option>
                        <option value="dark_aqua">Dark Aqua</option>
                        <option value="dark_red">Dark Red</option>
                        <option value="dark_purple">Dark Purple</option>
                        <option value="gold">Gold</option>
                        <option value="gray">Gray</option>
                        <option value="dark_gray">Dark Gray</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="aqua">Aqua</option>
                        <option value="red">Red</option>
                        <option value="light_purple">Light Purple</option>
                        <option value="yellow">Yellow</option>
                        <option value="white">White</option>
                    </select>
                    <label><input v-model="armorstand.customNameBold" type="checkbox">Bold</label>
                    <label><input v-model="armorstand.customNameItalic" type="checkbox">Italic</label>
                    <label><input v-model="armorstand.customNameStrikethrough" type="checkbox">Strikethrough</label>
                    <label><input v-model="armorstand.customNameObfuscated" type="checkbox">Obfuscated</label>
                </div>

                <hr>

            </div>
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
        this.enableEquipment = false

        // Equipment attributes
        this.equipHandRight = ""
        this.equipHandLeft = ""
        this.equipBoots = ""
        this.equipLeggings = ""
        this.equipChestplate = ""
        this.equipHelmet = ""
        // Valid values for this attribute are "item", "name", "url".
        // TODO More explanation what each value does
        this.helmetMode = "item"

        // CustomName attributes
        this.customName = ""
        this.showCustomName = false
        this.customNameColor = ""
        this.customNameBold = false
        this.customNameItalic = false
        this.customNameObfuscated = false
        this.customNameStrikethrough = false

    }
    getScale() {
        if (this.small) {
            return { x: 0.6, y: 0.6, z: 0.6 }
        } else {
            return { x: 1, y: 1, z: 1 }
        }
    }
    // Return the code to generate this armorstand
    getCode(mcVersion) {
        // TODO Handle different versions
    }
}

export default {
    data() {
        return {
            armorstand: new Armorstand(),
            mcVersion: "1.16",
        }
    },
    components: { Scene, RotationSliderRow },
}
</script>
