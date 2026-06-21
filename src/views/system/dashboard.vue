<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card>
          <a-statistic title="用户总数" :value="112" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="角色数量" :value="5" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="菜单数量" :value="17" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card>
          <a-statistic title="在线用户" :value="28" />
        </a-card>
      </a-col>
    </a-row>
    <a-card style="margin-top: 16px" title="欢迎使用权限管理系统">
      <p>这是一个基于 Vue 3 + TypeScript + Ant Design Vue 开发的权限管理系统前端。</p>
      <p>后端使用 JDK 21 + Spring Boot + Mybatis-Flex 开发。</p>
      <h4>主要功能：</h4>
      <ul>
        <li>用户管理：用户的增删改查、角色分配</li>
        <li>角色管理：角色的增删改查、菜单权限分配</li>
        <li>菜单管理：菜单的增删改查、支持目录/菜单/按钮三种类型</li>
        <li>动态菜单：根据用户权限动态渲染侧边栏菜单</li>
        <li>按钮权限：通过 v-permission 指令控制按钮级别的权限</li>
      </ul>
    </a-card>

    <a class="neo-btn-flat" href="https://api.notion.com/v1/oauth/authorize?client_id=364d872b-594c-81b6-b0e8-0037ce3f419e&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsystem%2Fmenu">
      授权 Notion
    </a>

    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.dashboard {
  padding: 0;
}
</style>

<style>
.dark .dashboard .ant-card {
  background: var(--card-bg) !important;
}
</style>
