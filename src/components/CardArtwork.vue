<script setup>
import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { computed } from 'vue'
import { secured_api } from '@/lib/api'

const props = defineProps({
  aspectRatio: 'portrait',
  width: { type: Number, default: 200 },
  height: { type: Number, default: 200 },
  mas_desc_length: { type: Number, default: 100 },
  actions: { type: Boolean, default: true },
  card: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['deleted', 'edit'])

// Texto truncado
const truncatedDescription = computed(() => {
  if (!props.card?.descripcion) return ''
  return props.card.descripcion.length > props.mas_desc_length
    ? props.card.descripcion.slice(0, props.mas_desc_length) + '...'
    : props.card.descripcion
})

// Computed de emojis según dificultad
const difficultyEmojis = computed(() => {
  const n = props.card?.dificultad || 1
  const map = {
    1: ['🌟'],
    2: ['🌟','🌟'],
    3: ['🌟','🌟','🌟'],
    4: ['🔥','🔥','🔥','🔥'],
    5: ['💀','💀','💀','💀','💀'],
  }
  return map[n] || ['🔥']
})

// Función de borrado
async function deleteCard() {
  if (!confirm(`¿Eliminar la carta "${props.card.titulo}"?`)) return

  try {
    await secured_api.delete(`/admin/cartas/${props.card.id}`)
    emit('deleted', props.card.id)
  } catch (err) {
    console.error('Error borrando carta:', err)
    alert('No se pudo eliminar la carta')
  }
}
</script>

<template>
  <div :class="cn('relative group', $attrs.class ?? '')">
    <ContextMenu>
      <ContextMenuTrigger>
        <div class="overflow-hidden rounded-md relative">
          <img
            :src="card.imagen"
            :alt="card.titulo"
            :width="width"
            :height="height"
            :class="cn(
              'h-auto w-auto object-cover transition-all group-hover:scale-105',
              aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
            )"
          />

          <!-- Overlay con texto dentro de la imagen -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
            <h3 class="text-base font-semibold text-white drop-shadow-md">
              {{ card.titulo }}
            </h3>
            <p class="text-sm text-gray-200 leading-tight drop-shadow break-words break-normal">
              {{ truncatedDescription }}
            </p>
          </div>

          <!-- Emojis de dificultad arriba a la derecha -->
          <div class="absolute top-2 right-2 flex space-x-1 text-lg">
            <span v-for="(emoji, index) in difficultyEmojis" :key="index">{{ emoji }}</span>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent v-if="actions" class="w-40">
        <ContextMenuItem class="text-blue-600 dark:text-blue-400" @click="emit('edit', card)">
          Editar
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem class="text-red-600 focus:text-red-600" @click="deleteCard">
          Borrar
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>
