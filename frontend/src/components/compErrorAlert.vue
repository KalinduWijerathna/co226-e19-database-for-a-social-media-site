<template>
    <div class="alert alert-danger">
        <strong class="me-1">Error!</strong> {{ props.msg }}
    </div>
</template>

<script setup>
const props = defineProps(['msg'])
</script>

<style scoped>
.alert {
    position: fixed;
    top: 5rem;
    left: 50%;
    transform: translate(-50%);
    z-index: 100;
    width: 60%;
    min-width: 300px;
    color: white;
    background: red;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
}
</style>