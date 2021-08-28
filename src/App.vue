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

                <label><input v-model="armorstand.lockSlots" type="checkbox">Lock Slot Interaction</label>
                <table v-if="armorstand.lockSlots">
                    <tr>
                        <td></td>
                        <td><img src="slot_helmet.png" alt="Helmet" /></td>
                        <td><img src="slot_chestplate.png" alt="Chestplate" /></td>
                        <td><img src="slot_leggings.png" alt="Leggings" /></td>
                        <td><img src="slot_shoes.png" alt="Shoes" /></td>
                        <td><img src="slot_sword.png" alt="Right Hand" /></td>
                        <td><img src="slot_shield.png" alt="Left Hand" /></td>
                    </tr>
                    <tr>
                        <td>Remove</td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 4"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 3"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 2"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 1"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 0"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << 5"/></td>
                    </tr>
                    <tr>
                        <td>Replace</td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (4 + 8)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (3 + 8)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (2 + 8)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (1 + 8)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (0 + 8)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (5 + 8)"/></td>
                    </tr>
                    <tr>
                        <td>Place</td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (4 + 16)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (3 + 16)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (2 + 16)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (1 + 16)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (0 + 16)"/></td>
                        <td><LockSlotCheckBox :armorstand="armorstand" :value="1 << (5 + 16)"/></td>
                    </tr>
                </table>

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
import { useI18n } from "vue-i18n"
import Scene from "./Scene.vue"
import RotationSliderRow from "./components/RotationSliderRow.vue"
import LockSlotCheckBox from "./components/LockSlotCheckBox.vue"
import { Armorstand } from "./armorstand.js"

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
            dings: "10",
        }
    },
    computed: {
        // Code for the current armor stand
        currentCode() {
            return this.armorstand.getCode(this.mcVersion)
        },
    },
    components: { Scene, RotationSliderRow, LockSlotCheckBox },
}
</script>
