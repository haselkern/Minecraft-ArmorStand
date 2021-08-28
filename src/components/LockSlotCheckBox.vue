<template>
    <input type="checkbox" @click="armorstand.lockFlags ^= value" :checked="Boolean(armorstand.lockFlags & value)" />
</template>

<script>
// This checkbox is a helper for toggling the binary flag "value" in "armorstand.lockFlags"

export default {
    props: ["armorstand", "value"],
}
</script>