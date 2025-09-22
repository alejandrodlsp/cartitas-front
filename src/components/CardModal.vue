<script setup>
import CardArtwork from "./CardArtwork.vue";
import { ref, reactive, defineEmits, defineExpose, computed } from "vue";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { secured_api } from "@/lib/api";

const open = ref(false);
const emit = defineEmits(["created", "updated"]);

const preview = reactive({
  id: null,
  titulo: "Nueva carta",
  descripcion: "Nueva descripción",
  imagen:
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
  dificultad: 1,
});

// Permitir abrir el modal desde afuera
function openModal(card = null) {
  if (card) {
    // editar carta
    preview.id = card.id;
    preview.titulo = card.titulo;
    preview.descripcion = card.descripcion;
    preview.imagen = card.imagen;
    preview.dificultad = card.dificultad;
  } else {
    resetPreview();
  }
  open.value = true;
}

// Exponemos la función para que otros componentes puedan llamarla
defineExpose({ openModal });

function onFileChange(e) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => (preview.imagen = reader.result);
    reader.readAsDataURL(file);
  }
}

const dificultadProxy = computed({
  get() {
    return [preview.dificultad]; // devuelve un array de un elemento para el slider
  },
  set(val) {
    preview.dificultad = val[0]; // toma el primer valor del array y lo guarda en el número
  },
});

async function saveCard() {
  try {
    const formData = new FormData();
    formData.append("titulo", preview.titulo);
    formData.append("descripcion", preview.descripcion);
    formData.append("dificultad", preview.dificultad.toString());
    if (preview.imagen && preview.imagen.startsWith("data:")) {
      const res = await fetch(preview.imagen);
      const blob = await res.blob();
      formData.append("imagen", blob, "carta.png");
    }

    if (preview.id) {
      await secured_api.put(`/admin/cartas/${preview.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      emit("updated", { ...preview });
    } else {
      await secured_api.post("/admin/cartas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      emit("created", { ...preview });
    }

    open.value = false;
    resetPreview();
  } catch (err) {
    console.error(err);
    alert("Error guardando la carta");
  }
}

function resetPreview() {
  preview.id = null;
  preview.titulo = "Nueva carta";
  preview.descripcion = "Nueva descripción";
  preview.imagen =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
  preview.dificultad = 1;
}
</script>

<template>
  <Dialog v-model:open="open" class="w-full max-w-[900px]">
    <DialogContent class="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      <!-- Vista previa arriba en móvil, izquierda en desktop -->
      <div class="w-full md:w-1/2 flex justify-center">
        <div class="rounded-2xl overflow-hidden shadow-lg">
          <CardArtwork
            mas_desc_length="400"
            :actions="false"
            :card="preview"
            class="w-[85vw] max-w-[350px] md:w-[350px]"
            aspect-ratio="portrait"
            :width="350"
            :height="470"
          />
        </div>
      </div>

      <!-- Formulario debajo en móvil, derecha en desktop -->
      <div class="w-full md:w-1/2 space-y-4">
        <DialogTitle>
          {{ preview.id ? "Editar Carta" : "Crear Nueva Carta" }}
        </DialogTitle>
        <DialogDescription>
          Rellena los datos de tu carta y ajusta la dificultad.
        </DialogDescription>

        <div class="space-y-3">
          <Input v-model="preview.titulo" placeholder="Título de la carta" />
          <Textarea
            v-model="preview.descripcion"
            placeholder="Descripción de la carta"
            rows="6"
          />
          <Input type="file" @change="onFileChange" />
          <div>
            <label class="block mb-1 font-medium"
              >Dificultad: {{ preview.dificultad }}</label
            >
            <Slider :min="1" :max="5" step="1" v-model="dificultadProxy" />
          </div>
        </div>

        <div class="flex flex-wrap justify-end mt-4 gap-2">
          <Button variant="outline" @click="open = false">Cancelar</Button>
          <Button @click="saveCard">{{
            preview.id ? "Guardar Cambios" : "Crear Carta"
          }}</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
