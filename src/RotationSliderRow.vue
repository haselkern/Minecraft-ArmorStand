<template>
    <tr>
        <td>{{label}}</td>
        <td>
            <input
                class="w-full"
                @dblclick="() => rotation.x = 0"
                type="range"
                min="-180"
                max="180"
                v-model="rotation.x"
            />
        </td>
        <td>
            <input
                class="w-full"
                @dblclick="() => rotation.y = 0"
                type="range"
                min="-180"
                max="180"
                v-model="rotation.y"
            />
        </td>
        <td>
            <input
                class="w-full"
                @dblclick="() => rotation.z = 0"
                type="range"
                min="-180"
                max="180"
                v-model="rotation.z"
            />
        </td>
    </tr>
</template>

<script>
export default {
    props: ["rotation", "label"],
}
</script>