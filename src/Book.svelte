<script context="module">
    let tag = "consult";
</script>

<script>
    import { onMount } from "svelte";
    import _load_school from "../wasm/school.cside";
    import Folder from "./Folder.svelte";
    let school;
    let catalogue = [
        {
            type: "file",
            name: "1 准备课",
        },
        {
            type: "file",
            name: "2 位置",
        },
        {
            type: "file",
            name: "3 1~5的认知和加减法",
        },
    ];
    onMount(async () => {
        school = await _load_school();
        console.log("webassembly", school);
    });
</script>

<Folder name="一年级数学（上）" files={catalogue} />

<style>
</style>
