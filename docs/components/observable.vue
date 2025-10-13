<template>
  <div style="background-color: #292d3e; margin: 30px 0; padding: 20px; border-radius: 8px">
    <div
      style="display: flex; justify-content: space-between; font-family: var(--vp-font-family-mono)"
    >
      <div>
        <span class="line"
          ><span style="color: #f97583">const</span><span style="color: #79b8ff"> observable$</span
          ><span style="color: #f97583"> =</span><span style="color: #79b8ff"> promise$.</span
          ><span style="color: #b392f0">then</span><span style="color: #e1e4e8">((</span
          ><span style="color: #ffab70">data</span><span style="color: #e1e4e8">) </span
          ><span style="color: #f97583">=&gt;</span><span style="color: #e1e4e8"> data </span
          ><span style="color: #f97583">+</span><span style="color: #79b8ff"> 1</span
          ><span style="color: #e1e4e8">)</span></span
        >
      </div>
    </div>
    <div style="color: #e1e4e8; display: flex; align-items: flex-start; position: relative">
      <ul
        class="api"
        style="
          margin-left: 125px;
          cursor: pointer;
          padding-left: 10px;
          border-left: 1px solid #e1e4e8;
          border-radius: 4px;
          height: auto;
        "
      >
        <span
          style="
            position: absolute;
            left: 30px;
            top: 60px;
            background: #292d3e;
            color: #47c1a8;
            z-index: 1;
          "
          >Observable</span
        >
        <a
          :href="item.address"
          class="item"
          style="display: block"
          v-for="item in subjectionApi"
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

const subjectionApi = [
  { name: 'value', address: '#value' },
  { name: 'status', address: '#status' },
  {
    name: 'then',
    address: '#then',
  },
  {
    name: 'thenSet',
    address: '#thentset',
  },
  {
    name: 'thenOnce',
    address: '#thenonce',
  },
  {
    name: 'thenOnceSet',
    address: '#thenonceset',
  },
  {
    name: 'thenImmediate',
    address: '#thenimmediate',
  },
  {
    name: 'thenImmediateSet',
    address: '#thenimmediateset',
  },
  {
    name: 'catch',
    address: '#catch',
  },
  {
    name: 'finally',
    address: '#finally',
  },
  {
    name: 'pipe',
    address: '#pipe',
  },
  {
    name: 'use',
    address: '#use',
  },
  {
    name: 'remove',
    address: '#remove',
  },
  {
    name: 'execute',
    address: '#execute',
  },
  {
    name: 'unsubscribe',
    address: '#unsubscribe',
  },
  {
    name: 'afterUnsubscribe',
    address: '#afterunsubscribe',
  },
  {
    name: 'offUnsubscribe',
    address: '#offunsubscribe',
  },
  {
    name: 'afterComplete',
    address: '#aftercomplete',
  },
  {
    name: 'offComplete',
    address: '#offcomplete',
  },
  {
    name: 'afterSetValue',
    address: '#aftersetvalue',
  },
  {
    name: 'offAfterSetValue',
    address: '#offaftersetvalue',
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
    left: 8px;
    top: -5px;
    display: block;
    width: 150px;
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
    width: 52px;
    height: 140px;
    border-left: 1px dashed #e1e4e8;
    border-bottom: 1px dashed #e1e4e8;
  }
}
</style>
