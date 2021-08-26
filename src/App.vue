<template>
    <div class="box-border">
        <div class="w-3/5 fixed h-screen">
            <Scene :armorstand="armorstand" />
        </div>
        <div class="w-2/5 right-0 ml-60">
            <div class="bg-white m-4 p-4 border border-gray-900">

                <h1>{{t("hero")}}</h1>

                <select v-model="locale">
                    <option value="en">🇬🇧 English</option>
                </select>

                <select v-model="mcVersion">
                    <option value="1.16">Minecraft 1.16 +</option>
                    <option value="1.14">Minecraft 1.14 &amp; 1.15</option>
                    <option value="1.13">Minecraft 1.13</option>
                    <option value="1.11">Minecraft 1.11 &amp; 1.12</option>
                    <option value="1.9">Minecraft 1.9 &amp; 1.10</option>
                    <option value="1.8">Minecraft 1.8</option>
                </select>
                <label><input v-model="armorstand.noBasePlate" type="checkbox">{{t("checkNoBasePlate")}}</label>
                <label><input v-model="armorstand.noGravity" type="checkbox">{{t("checkNoGravity")}}</label>
                <label><input v-model="armorstand.showArms" type="checkbox">{{t("checkShowArms")}}</label>
                <label><input v-model="armorstand.small" type="checkbox">{{t("checkSmall")}}</label>
                <details>
                    <summary>{{t("checkAdvanced")}}</summary>
                    <label><input v-model="armorstand.invisible" type="checkbox">{{t("checkInvisible")}}</label>
                    <label><input v-model="armorstand.invulnerable" type="checkbox">{{t("checkInvulnerable")}}</label>
                    <label><input v-model="armorstand.persistenceRequired" type="checkbox">{{t("checkPersistenceRequired")}}</label>
                    <label><input v-model="armorstand.marker" type="checkbox">{{t("checkMarker")}}</label>
                    <label><input v-model="armorstand.centerCorrected" type="checkbox">{{t("checkCenterCorrected")}}</label>
                </details>

                <hr>

                <table>
                    <tr>
                        <td>{{t("sliderRotation")}}</td>
                        <td colspan="3">
                            <input @dblclick="() => armorstand.rotation = 0" class="w-full" type="range" min="-180" max="180" v-model="armorstand.rotation" />
                        </td>
                    </tr>
                    <RotationSliderRow :label="t('sliderHead')" :rotation="armorstand.head" />
                    <RotationSliderRow :label="t('sliderBody')" :rotation="armorstand.body" />
                    <RotationSliderRow :label="t('sliderLeftLeg')" :rotation="armorstand.legLeft" />
                    <RotationSliderRow :label="t('sliderRightLeg')" :rotation="armorstand.legRight" />
                    <RotationSliderRow v-if="armorstand.showArms" :label="t('sliderLeftArm')" :rotation="armorstand.armLeft" />
                    <RotationSliderRow v-if="armorstand.showArms" :label="t('sliderRightArm')" :rotation="armorstand.armRight" />
                </table>

                <hr>

                <label><input v-model="armorstand.enableEquipment" type="checkbox">{{t("equipEnable")}}</label>
                <div v-if="armorstand.enableEquipment">
                    <input v-model="armorstand.equipHandRight" :placeholder="t('equipHandRight')"/>
                    <input v-model="armorstand.equipHandLeft" :placeholder="t('equipHandLeft')"/>
                    <input v-model="armorstand.equipShoes" :placeholder="t('equipShoes')"/>
                    <input v-model="armorstand.equipLeggings" :placeholder="t('equipLeggings')"/>
                    <input v-model="armorstand.equipChestplate" :placeholder="t('equipChestplate')"/>
                    <input v-model="armorstand.equipHelmet" :placeholder="t('equipHelmet')"/>
                    <select v-model="armorstand.helmetMode">
                        <option value="item">{{t("equipHelmetModeItem")}}</option>
                        <option value="name">{{t("equipHelmetModePlayer")}}</option>
                        <option value="url">{{t("equipHelmetModeUrl")}}</option>
                    </select>
                </div>

                <hr>
                
                <input v-model="armorstand.customName" :placeholder="t('customName')"/>
                <label><input v-model="armorstand.showCustomName" type="checkbox">{{t("cnShow")}}</label>
                <div v-if="armorstand.showCustomName">
                    <select v-model="armorstand.customNameColor">
                        <option value="">{{t("cnColorNone")}}</option>
                        <option value="black">{{t("cnColorBlack")}}</option>
                        <option value="dark_blue">{{t("cnColorDarkBlue")}}</option>
                        <option value="dark_green">{{t("cnColorDarkGreen")}}</option>
                        <option value="dark_aqua">{{t("cnColorDarkAqua")}}</option>
                        <option value="dark_red">{{t("cnColorDarkRed")}}</option>
                        <option value="dark_purple">{{t("cnColorDarkPurple")}}</option>
                        <option value="gold">{{t("cnColorGold")}}</option>
                        <option value="gray">{{t("cnColorGray")}}</option>
                        <option value="dark_gray">{{t("cnColorDarkGray")}}</option>
                        <option value="blue">{{t("cnColorBlue")}}</option>
                        <option value="green">{{t("cnColorGreen")}}</option>
                        <option value="aqua">{{t("cnColorAqua")}}</option>
                        <option value="red">{{t("cnColorRed")}}</option>
                        <option value="light_purple">{{t("cnColorLightPurple")}}</option>
                        <option value="yellow">{{t("cnColorYellow")}}</option>
                        <option value="white">{{t("cnColorWhite")}}</option>
                    </select>
                    <label><input v-model="armorstand.customNameBold" type="checkbox">{{t("cnBold")}}</label>
                    <label><input v-model="armorstand.customNameItalic" type="checkbox">{{t("cnItalic")}}</label>
                    <label><input v-model="armorstand.customNameStrikethrough" type="checkbox">{{t("cnStrikethrough")}}</label>
                    <label><input v-model="armorstand.customNameObfuscated" type="checkbox">{{t("cnObfuscated")}}</label>
                </div>

                <hr>

                <p class="break-all">{{currentCode}}</p>

                <hr>

            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import Scene from "./Scene.vue"
import RotationSliderRow from "./RotationSliderRow.vue"
import {generateIntArray, generateUUID, isXYZZero, xyzToTextArray} from "./util.js"

// The Armorstand will hold all attributes for an armor stand.
// TODO Move this to a different file
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
                armor.push(this.getHeadItem(mcVersion))

                tags.push("Equipment:["+armor.join(",")+"]")
            } else {
                // New 1.9+ Equipment format
                let armor = []

                armor.push(this.getShoesItem())
                armor.push(this.getLeggingsItem())
                armor.push(this.getChestplateItem())
                armor.push(this.getHeadItem(mcVersion))

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
            // Arms will also be added if they are 0, because if we omit them, Minecraft
            // will give the arms a default rotation that does not match our version.
            pose.push("LeftArm:"+xyzToTextArray(this.armLeft))
            pose.push("RightArm:"+xyzToTextArray(this.armRight))
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

    getHeadItem(mcVersion) {
        if (this.equipHelmet == "") return "{}"

        // Use input as item
        if (this.helmetMode == "item") {
            return "{id:\""+this.equipHelmet+"\",Count:1b"
            // +getLeatherColorString($("#helmetcolor"), isLeatherArmor(equipHelmet))
            +"}"
        }

        // Use input as player name
        else if (this.helmetMode == "name") {
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
    setup() {
        const { locale, t } = useI18n({
            inheritLocale: true,
            useScope: "global"
        })

        return { locale, t }
    },
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
