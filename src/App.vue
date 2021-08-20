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
                    <input v-model="armorstand.equipShoes" placeholder="Boots"/>
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

                <p class="break-all">{{currentCode}}</p>

                <hr>

            </div>
        </div>
    </div>
</template>

<script>
import Scene from "./Scene.vue"
import RotationSliderRow from "./RotationSliderRow.vue"
import {generateIntArray, generateUUID, isXYZZero, xyzToTextArray} from "./util.js"

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
        this.equipShoes = ""
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
        //in 1.13, positions are no longer center-corrected. Adding .5 makes it centered. However for players it is already center-corrected
        var code = "/summon armor_stand ~ ~ ~ {"

        // if (!give) { // TODO
        if (true) {
            // Old entity name
            if (mcVersion == "1.8" || mcVersion == "1.9"){
                code = "/summon ArmorStand ~ ~ ~ {"
            } else if (mcVersion == "1.11") {
                code = "/summon armor_stand ~ ~ ~ {"
            } else {
                if (this.centerCorrected) {
                    code = "/summon armor_stand ~ ~-0.5 ~ {"
                } else {
                    code = "/summon armor_stand ~ ~ ~ {"
                }
            }
        } else {
            if(mcVersion == "1.8" || mcVersion == "1.9" || mcVersion == "1.11"){
                code = "/give @p minecraft:armor_stand 1 0 {EntityTag:{"
            } else {
                code = "/give @p armor_stand{EntityTag:{"
            }
        }

        let tags = []

        //CheckBoxes
        if (this.invisible) {
            tags.push("Invisible:1b")
        }
        if (this.invulnerable) {
            tags.push("Invulnerable:1b")
        }
        if (this.persistenceRequired) {
            tags.push("PersistenceRequired:1b")
        }
        if (this.noBasePlate) {
            tags.push("NoBasePlate:1b")
        }
        if (this.noGravity) {
            tags.push("NoGravity:1b")
        }
        if (this.showArms) {
            tags.push("ShowArms:1b")
        }
        if (this.small) {
            tags.push("Small:1b")
        }
        if (this.marker) {
            tags.push("Marker:1b")
        }

        // Sliders
        if(this.rotation != 0) {
            tags.push("Rotation:["+this.rotation+"f]")
        }

        // Equipment
        if (this.enableEquipment) {
            if (mcVersion == "1.8") {
                // Old 1.8 Equipment format
                let armor = []

                armor.push(this.getHandRightItem())
                armor.push(this.getShoesItem())
                armor.push(this.getLeggingsItem())
                armor.push(this.getChestplateItem())
                armor.push(this.getHeadItem())

                tags.push("Equipment:["+armor.join(",")+"]")
            } else {
                // New 1.9+ Equipment format
                let armor = []

                armor.push(this.getShoesItem())
                armor.push(this.getLeggingsItem())
                armor.push(this.getChestplateItem())
                armor.push(this.getHeadItem());

                tags.push("ArmorItems:["+armor.join(",")+"]")

                let hands = []

                hands.push(this.getHandRightItem())
                hands.push(this.getHandLeftItem())

                tags.push("HandItems:["+hands.join(",")+"]")
            }
        }

        // Custom name
        if (this.customName) {
            let name = []
            if (mcVersion == "1.8" || mcVersion == "1.9" || mcVersion == "1.11") {
                tags.push(`CustomName:"${this.customName}"`)
            } else if (mcVersion == "1.13") {
                name.push(this.getName())
                name.push(this.getNameColor())
                name.push(this.getNameBold())
                name.push(this.getNameItalic())
                name.push(this.getNameObfuscated())
                name.push(this.getNameStrikethrough())
    
                tags.push(`CustomName:"{${name.join("")}}"`)
            } else {
                // CustomNames from 1.14+ can now use single quotes to contain json
                // Replace escaped double quotes with single quotes to make it look pretty				
                name.push(this.getName().replaceAll("\\", ""))
                name.push(this.getNameColor().replaceAll("\\", ""))
                name.push(this.getNameBold().replaceAll("\\", ""))
                name.push(this.getNameItalic().replaceAll("\\", ""))
                name.push(this.getNameObfuscated().replaceAll("\\", ""))
                name.push(this.getNameStrikethrough().replaceAll("\\", ""))
                tags.push(`CustomName:'{${name.join("")}}'`)
            }
        }

        if (this.showCustomName) {
            tags.push("CustomNameVisible:1b")
        }

        // DisabledSlots // TODO
        // if(useDisabledSlots){
        //     tags.push("DisabledSlots:"+calculateDisabledSlotsFlag())
        // }

        // Now the pose
        // TODO Somewhere a conversion between Minecraft and ThreeJS rotations must take place.
        let pose = []
        if (!isXYZZero(this.body)) {
            pose.push("Body:"+xyzToTextArray(this.body))
        }
        if (!isXYZZero(this.head)) {
            pose.push("Head:"+xyzToTextArray(this.head))
        }
        if (!isXYZZero(this.legLeft)) {
            pose.push("LeftLeg:"+xyzToTextArray(this.legLeft))
        }
        if (!isXYZZero(this.legRight)) {
            pose.push("RightLeg:"+xyzToTextArray(this.legRight))
        }
        if (this.showArms){
            if (!isXYZZero(this.armLeft)) {
                pose.push("LeftArm:"+xyzToTextArray(this.armLeft))
            }
            if (!isXYZZero(this.armRight)) {
                pose.push("RightArm:"+xyzToTextArray(this.armRight))
            }
        }


        if (pose.length > 0) {
            tags.push("Pose:{"+pose.join(",")+"}")
        }

        code += tags.join(",")
        code += "}"
        // if (give) { // TODO
        //     code += "}"
        //     if (mcVersion != "1.8" && mcVersion != "1.9" && mcVersion != "1.11") {
        //         code += " 1"
        //     }
        // }

        return code
    }

    getHandRightItem() {
        if(this.equipHandRight == "") return "{}"
        return "{id:\""+this.equipHandRight+"\",Count:1b}"
    }

    getHandLeftItem() {
        if(this.equipHandLeft == "") return "{}"
        return "{id:\""+this.equipHandLeft+"\",Count:1b}"
    }

    getShoesItem() {
        if(this.equipShoes == "") return "{}"
        return "{id:\""+this.equipShoes+"\",Count:1b"
                        // +getLeatherColorString($("#shoecolor"), isLeatherArmor(equipShoes)) // TODO Leather armor
                        +"}"
    }

    getLeggingsItem() {
        if(this.equipLeggings == "") return "{}"
        return "{id:\""+this.equipLeggings+"\",Count:1b"
                        // +getLeatherColorString($("#leggingscolor"), isLeatherArmor(this.equipLeggings))
                        +"}"
    }

    getChestplateItem() {
        if(this.equipChestplate == "") return "{}"
        return "{id:\""+this.equipChestplate+"\",Count:1b"
                    // +getLeatherColorString($("#chestplatecolor"), isLeatherArmor(this.equipChestplate))
                    +"}"
    }

    getHeadItem() {
        if (this.equipHelmet == "") return "{}"

        // Use input as item
        if (this.helmetMode == "item") {
            return "{id:\""+this.equipHelmet+"\",Count:1b"
            // +getLeatherColorString($("#helmetcolor"), isLeatherArmor(equipHelmet))
            +"}"
        }

        // Use input as player name
        else if (this.helmetMode == "player") {
            if (mcVersion == "1.8" || mcVersion == "1.10" || mcVersion == "1.11") {
                return "{id:\"skull\",Count:1b,Damage:3b,tag:{SkullOwner:\""+this.equipHelmet+"\"}}"
            } else {
                return "{id:\"player_head\",Count:1b,tag:{SkullOwner:\""+this.equipHelmet+"\"}}"
            }
        }

        // Use input as url
        // Best reference: http://redd.it/24quwx
        else if (this.helmetMode == "url") {
            let base64Value = btoa('{"textures":{"SKIN":{"url":"'+this.equipHelmet+'"}}}')
            
            if (mcVersion == "1.8" || mcVersion == "1.9" || mcVersion == "1.11"){
                return '{id:"skull",Count:1b,Damage:3b,tag:{SkullOwner:{Id:"'+generateUUID()+'",Properties:{textures:[{Value:"'+base64Value+'"}]}}}}'
            } else if (mcVersion == "1.14") {
                return '{id:"minecraft:player_head",Count:1b,tag:{SkullOwner:{Id:"'+generateUUID()+'",Properties:{textures:[{Value:"'+base64Value+'"}]}}}}'
            } else {
                return '{id:"minecraft:player_head",Count:1b,tag:{SkullOwner:{Id:'+generateIntArray()+',Properties:{textures:[{Value:"'+base64Value+'"}]}}}}'
            }
        }
    }

    getName() {
        if (this.customName == "") return ""
        return `\\"text\\":\\"${this.customName}\\"`
    }

    getNameColor() {
        if (this.customNameColor == "") return ""
        return `,\\"color\\":\\"${this.customNameColor}\\"`
    }

    getNameBold() {
        if (!this.customNameBold) return ""
        return `,\\"bold\\":\\"true\\"`
    }

    getNameItalic() {
        if (!this.customNameItalic) return ""
        return `,\\"italic\\":\\"true\\"`
    }

    getNameStrikethrough() {
        if (!this.customNameStrikethrough) return ""
        return `,\\"strikethrough\\":\\"true\\"`
    }

    getNameObfuscated() {
        if (!this.customNameObfuscated) return ""
        return `,\\"obfuscated\\":\\"true\\"`
    }

}

export default {
    data() {
        return {
            armorstand: new Armorstand(),
            mcVersion: "1.16",
        }
    },
    computed: {
        // Code for the current armor stand
        currentCode() {
            return this.armorstand.getCode(this.mcVersion)
        },
    },
    components: { Scene, RotationSliderRow },
}
</script>
