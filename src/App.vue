<template>
  <span v-if="isAdminRoute">
    <LoginView v-if="!isLoggedIn" />
    <AdminView v-else />
  </span>

  <span v-else>
    Usuario normal
  </span>
</template>

<script setup>
import { computed } from "vue";
import LoginView from "@/views/admin/LoginView.vue";
import AdminView from "@/views/admin/AdminView.vue";

const isLoggedIn = computed(() => {
  const token = localStorage.getItem("admin_token");
  return !!token;
});

const isAdminRoute = computed(() => {
  return window.location.pathname.startsWith("/admin");
});
</script>
