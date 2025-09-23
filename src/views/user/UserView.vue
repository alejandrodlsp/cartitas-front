<template>
<div
  class="p-6 flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900"
>
  <!-- Título -->
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
    🎃 Hasloween
  </h2>

  <transition name="page-flip" mode="out-in">
    <!-- Carta -->
    <Card
      v-if="currentCard"
      :key="currentCard.id"
      class="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-800"
    >
      <CardContent class="flex flex-col items-center p-4">
        <CardArtwork
          :card="currentCard"
          class="w-[85vw] max-w-[450px]"
          aspect-ratio="portrait"
          :width="450"
          :height="570"
          :actions="false"
          mas_desc_length="400"
          @dblclick="loadCard"
        />
      </CardContent>
    </Card>
  </transition>

  <!-- Slider -->
  <div class="mt-6 w-full max-w-md">
    <label class="block mb-2 font-medium text-center text-gray-700 dark:text-gray-200">
      Factor de riesgo: {{ riskFactor }}
    </label>
    <Slider
      v-model="riskFactorProxy"
      :min="1"
      :max="5"
      step="1"
      class="w-full"
    />
    <p class="text-sm mt-2 text-center text-gray-500 dark:text-gray-400">
      (1 = cartas fáciles más probables, 5 = cartas difíciles más probables)
    </p>
  </div>

  <!-- Botón -->
  <div class="mt-6 flex flex-col gap-3">
    <Button>🔄 Sacar otra carta</Button>
    <Button variant="destructive" size="sm" @click="clearSession">
      🧹 Limpiar Historial
    </Button>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import CardArtwork from "@/components/CardArtwork.vue";
import { public_api } from "@/lib/api";

const currentCard = ref(null);
const riskFactor = ref(3); // valor inicial (neutro)

// Slider de shadcn necesita array
const riskFactorProxy = computed({
  get: () => [riskFactor.value],
  set: (val) => (riskFactor.value = val[0]),
});

async function loadCard() {
  try {
    const normalizedRisk = (riskFactor.value - 1) / 4;
    const res = await public_api.get("/cartas/random", {
      params: { risk: normalizedRisk },
    });
    currentCard.value = res.data.resource;
  } catch (err) {
    console.error("Error cargando cartas:", err);
  }
}

async function clearSession() {
  try {
    await public_api.delete("/cartas/session");
    alert("Historial de cartas limpiado");
  } catch (err) {
    console.error(err);
    alert("Error al limpiar el historial");
  }
}

onMounted(() => {
  loadCard();
});
</script>

<style scoped>
.page-flip-enter-active,
.page-flip-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
  transform-style: preserve-3d;
}

.page-flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg);
}

.page-flip-enter-to {
  opacity: 1;
  transform: rotateY(0deg);
}

.page-flip-leave-from {
  opacity: 1;
  transform: rotateY(0deg);
}

.page-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg);
}
</style>
