import {generateIntArray, generateUUID, isXYZZero, xyzToTextArray} from "./util.js"

// The Armorstand will hold all attributes for an armor stand.
export class Armorstand {
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

        // Slot interaction
        this.lockSlots = false
        this.lockFlags = 0
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

        // DisabledSlots
        if(this.lockSlots){
            tags.push("DisabledSlots:"+this.lockFlags)
        }

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
