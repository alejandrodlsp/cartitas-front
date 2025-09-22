<script setup>
import { ref } from "vue";
import { Button } from "@/components/ui/button";
const emit = defineEmits(["open"]);

function openCreate() {
  emit("open");
}
</script>

<template>
  <Button @click="openCreate">➕ Crear Carta</Button>
</template>