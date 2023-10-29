<template>
    <div class="loading">
        <img src="@/assets/logo.gif" alt="">
    </div>
</template>


<style scoped>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #DFDFDF;
    z-index: 500;
    opacity: 0.9;
}

.loading img {
    height: 150px;
}

@media screen and (max-width:468px) {
    .loading img {
        height: 100px;
    }
}
</style>