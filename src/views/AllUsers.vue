<script setup lang="ts">
import {ref, onMounted, type Ref} from 'vue';
import BoiteUtilisateur from '@/components/BoiteUtilisateur.vue';
import { apiStore } from '@/util/apiStore';
import type { Utilisateur } from '@/types';
import {notify} from "@kyvg/vue3-notification";

const users: Ref<Utilisateur[]> = ref([]);

onMounted(() => {
  apiStore.getAll('utilisateurs')
    .then(response => {
      if (response && response.member) {
        users.value = response.member;
      } else {
        notify({
          type: "warn",
          title: "Aucune donnée",
          text: "Aucune donnée trouvée ou réponse incorrecte.",
        });
      }
    })
    .catch(() => {
      notify({
        type: "error",
        title: "Erreur",
        text: "Erreur lors de la récupération des utilisateurs.",
      });
    });
});
</script>

<template>
  <div>
    <h1>Liste des utilisateurs</h1>
    <div v-for="user in users" :key="user.id">
      <BoiteUtilisateur :utilisateur="user" />
    </div>
  </div>
</template>


<style scoped>

</style>
