<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle class="text-xl">🔒 Acceso Admin</CardTitle>
        <CardDescription>
          Introduce la clave secreta para acceder al panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="login" class="space-y-4">
          <Input
            type="password"
            v-model="secret"
            placeholder="Clave secreta"
          />
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? "Entrando..." : "Entrar" }}
          </Button>
        </form>
        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { public_api } from "@/lib/api"

const secret = ref("")
const loading = ref(false)
const error = ref("")

const login = async () => {
  loading.value = true
  error.value = ""

  try {
    const res = await public_api.post("/admin/login", { secret: secret.value })
    const token = res.data.token

    if (token) {
      localStorage.setItem("admin_token", token)
      window.location.reload()
    }
  } catch (err) {
    error.value = "Clave incorrecta"
  } finally {
    loading.value = false
  }
}
</script>
