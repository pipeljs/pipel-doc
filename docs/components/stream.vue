<template>
  <div style="background-color: #292d3e; margin: 30px 0; padding: 20px; border-radius: 8px">
    <div
      style="display: flex; justify-content: space-between; font-family: var(--vp-font-family-mono)"
    >
      <div>
        <span class="line"
          ><span style="color: #f97583">const</span><span style="color: #79b8ff"> promise$</span
          ><span style="color: #f97583"> =</span><span style="color: #b392f0"> $</span
          ><span style="color: #e1e4e8">()</span></span
        >
      </div>
    </div>
    <div style="color: #e1e4e8; display: flex; align-items: flex-start; position: relative">
      <ul
        class="api"
        style="
          margin-left: 230px;
          padding-left: 10px;
          border-left: 1px solid #e1e4e8;
          border-radius: 4px;
        "
      >
        <span
          style="
            position: absolute;
            left: 0px;
            top: 30px;
            background: #292d3e;
            color: #47c1a8;
            z-index: 1;
          "
          >Stream <span style="color: #4a92cc">extends</span> Observable</span
        >
        <a
          :href="item.address"
          class="item"
          style="display: block"
          v-for="item in streamApi"
          :key="item.name"
        >
          {{ item.name }}
        </a>
      </ul>
    </div>
  </div>
</template>

<script setup lang="tsx">
defineOptions({
  name: 'stream',
})

const streamApi = [
  {
    name: 'next',
    address: '#next',
  },
  {
    name: 'set',
    address: '#set',
  },
  {
    name: 'complete',
    address: '#complete',
  },
  {
    name: 'pause',
    address: '#pause',
  },
  {
    name: 'restart',
    address: '#restart',
  },
  {
    name: '...observable',
    address: './observable',
  },
]
</script>

<style lang="scss" scoped>
.item {
  color: #d8d6a5;
  &:hover {
    color: #8a8a7b;
  }
}
.api {
  &::before {
    content: ' ';
    position: absolute;
    left: 3px;
    top: -5px;
    display: block;
    width: 130px;
    height: 8px;
    border-bottom: 1px dashed #e1e4e8;
    border-radius: 4px;
  }
  &::after {
    content: ' ';
    position: absolute;
    left: 70px;
    top: 5px;
    display: block;
    width: 157px;
    height: 80px;
    border-left: 1px dashed #e1e4e8;
    border-bottom: 1px dashed #e1e4e8;
  }
}
</style>
