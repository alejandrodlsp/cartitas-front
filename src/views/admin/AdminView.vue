<template>
  <div class="p-6">
    <!-- Header con título y botones -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold flex items-center space-x-2">
        <span>🎃 Cartitas Halloween</span>
        <span class="text-base font-normal text-gray-500 pt-2"
          >- Panel Admin</span
        >
      </h2>
      <div class="flex space-x-3">
        <CreateCardButton @open="cardModal.openModal()" />
        <CardModal ref="cardModal" @created="loadCards" @updated="loadCards" />
        <Button variant="destructive" @click="logout">🚪 Cerrar Sesión</Button>
      </div>
    </div>

    <!-- Scrollable cards -->
    <div class="relative">
      <ScrollArea>
        <div
          class="flex flex-wrap md:flex-nowrap justify-center md:justify-start gap-4 pb-4"
        >
          <CardArtwork
            v-for="card in cards"
            v-if="cards.length > 0"
            @dblclick.prevent="cardModal.openModal(card)"
            @deleted="loadCards"
            @edit="cardModal.openModal(card)"
            :key="card.titulo"
            :card="card"
            class="w-[85vw] sm:w-[300px] md:w-[350px]"
            aspect-ratio="portrait"
            :width="350"
            :height="470"
          />
          <Card
            v-else
            class="w-[85vw] sm:w-[300px] md:w-[350px] h-[470px] flex items-center justify-center border-dashed border-2 border-gray-300 text-gray-500"
          >
            No hay cartas disponibles
          </Card>
        </div>
        <ScrollBar orientation="horizontal" class="hidden md:block" />
      </ScrollArea>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
    console.log(res.data);
    console.log(cards.value);
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
