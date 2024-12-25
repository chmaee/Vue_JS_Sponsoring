<script setup lang="ts">
import type { Evenement } from '@/types';
import { defineProps } from 'vue';
import {RouterLink} from "vue-router";

defineProps<{
  evenement: Evenement;
}>();

function formatDate(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('fr-FR', options).format(new Date(date));
}
</script>

<template>
  <div class="boite-evenement">
    <div class="top">
      <RouterLink
        v-if="evenement.id"
        :to="{ name: 'detailsEvents', params: { id: evenement.id } }"
        class="clickable">
        Evenement de {{ evenement.nom }}
      </RouterLink>
    </div>
    <h2>{{ evenement.nom }}</h2>
    <p><strong>Description :</strong> {{ evenement.description }}</p>
    <p><strong>Lieu :</strong> {{ evenement.lieu }}</p>
    <p>
      <strong>Date :</strong>
      {{ formatDate(evenement.date_debut) }}
      - {{ formatDate(evenement.date_fin) }}
    </p>
    <p><strong>Catégorie :</strong> {{ evenement.categorie }}</p>
  </div>
</template>


<style scoped>
@import "@/components/css/content-box.css";
.boite-evenement {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}
</style>
