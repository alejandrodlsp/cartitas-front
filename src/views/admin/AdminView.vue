<template>
  <div class="p-6 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
    <!-- Header con título y botones -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0"
    >
      <h2
        class="text-xl sm:text-2xl font-bold flex flex-wrap items-center space-x-2 text-gray-900 dark:text-gray-100"
      >
        <span>🎃 Cartitas Halloween</span>
        <span
          class="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400 pt-1 sm:pt-2"
        >
          - Panel Admin
        </span>
      </h2>
      <div class="flex flex-wrap md:flex-nowrap gap-2 md:space-x-3">
        <CreateCardButton @open="cardModal.openModal()" />
        <CardModal ref="cardModal" @created="loadCards" @updated="loadCards" />
        <Button variant="destructive" @click="logout">🚪 Cerrar Sesión</Button>
      </div>
    </div>

    <!-- Scrollable cards -->
    <div class="relative">
      <div class="h-[100vh] overflow-y-auto">
        <div
          class="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4 pb-4"
        >
          <CardArtwork
            v-for="card in cards"
            v-if="cards.length > 0"
            @dblclick.prevent="cardModal.openModal(card)"
            @deleted="loadCards"
            @edit="cardModal.openModal(card)"
            :key="card.titulo"
            :card="card"
            mas_desc_length="300"
            class="w-full"
            aspect-ratio="portrait"
            :width="350"
            :height="470"
          />
          <Card
            v-else
            class="w-full h-[470px] flex items-center justify-center border-dashed border-2 border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
          >
            No hay cartas disponibles
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardArtwork from "@/components/CardArtwork.vue";
import CreateCardButton from "@/components/CreateCardButton.vue";
import CardModal from "@/components/CardModal.vue";
import { secured_api } from "@/lib/api";

const cards = ref([]);
const cardModal = ref(null);

const loadCards = async () => {
  try {
    const res = await secured_api.get("/admin/cartas");
    cards.value = res.data;
  } catch (err) {
    console.error("Error cargando cartas:", err);
  }
};

function logout() {
  localStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_token");
  location.reload();
}

onMounted(() => {
  loadCards();
});
</script>
