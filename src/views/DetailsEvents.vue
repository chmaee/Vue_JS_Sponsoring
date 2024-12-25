<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiStore } from '@/util/apiStore';
import type { Evenement } from '@/types';
import BoiteEvenement from "@/components/BoiteEvenement.vue";

const route = useRoute();
const evenement = ref<Evenement | null>(null);
const id = Number(route.params.id);

onMounted(() => {
  apiStore.getById('evenements', id).then((data) => {
    evenement.value = data;
  }).catch((error) => {
    console.error("Erreur lors de la récupération de l'événement:", error);
  });
});
</script>

<template>
  <div>
    <h1>Détails de l'évènement {{ id }}</h1>
    <div v-if="evenement">
      <BoiteEvenement :evenement="evenement" />
    </div>
    <div v-else>
      <p>Chargement en cours...</p>
    </div>
  </div>
</template>

<style scoped>
</style>
