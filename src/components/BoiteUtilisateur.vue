<script setup lang="ts">
import { computed } from 'vue';
import { apiStore } from '@/util/apiStore';
import { RouterLink, useRouter } from 'vue-router';
import type { Utilisateur } from "@/types";


const props = defineProps<{ utilisateur: Utilisateur | undefined }>();
const utilisateurConnecte = computed(() => apiStore.utilisateurConnecte.value);
const isAdmin = computed(() => {
  return utilisateurConnecte.value?.roles?.includes('ROLE_ADMIN');
});

const utilisateurId = computed(() => {
  const id = props.utilisateur?.['@id'];
  if (id) {
    return id.match(/\/([^/]+)$/)?.[1] || null;
  }
  return null;
});

const supprimerUtilisateur = (userId: string) => {
  const userIdNum = Number(userId);
  const connectedUserId = utilisateurConnecte.value?.id;

  if (connectedUserId === userIdNum) {
    alert("Vous ne pouvez pas supprimer votre propre compte.");
    return;
  }

  apiStore.deleteUser(userIdNum).then(response => {
    if (response.success) {
      alert("Utilisateur supprimé avec succès.");
      window.location.reload();
    } else {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  }).catch(error => {
    console.error('Erreur lors de l\'appel API :', error);
  });
}
</script>

<template>
  <div class="content-box">
    <div class="top">
      <RouterLink
        v-if="utilisateurId"
        :to="{ name: 'DetailsUsers', params: { id: utilisateurId } }"
        class="clickable"
      >
        Profil de {{ props.utilisateur?.login }}
      </RouterLink>
    </div>
    <div class="content">
      <div class="group">
        <label>Login :</label>
        <span class="value">{{ props.utilisateur?.login }}</span>
      </div>
      <div class="group">
        <label>Nom :</label>
        <span class="value">{{ props.utilisateur?.nom }}</span>
      </div>
      <div class="group">
        <label>Prénom :</label>
        <span class="value">{{ props.utilisateur?.prenom }}</span>
      </div>
      <div v-if="isAdmin && utilisateurId">
        <button @click="supprimerUtilisateur(utilisateurId)" class="btn-supprimer">
          Supprimer l'utilisateur
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/components/css/content-box.css";

.clickable {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.clickable:hover {
  text-decoration: none;
}

.content-box {
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin: 20px auto;
}

.group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.group label {
  font-weight: bold;
  margin-right: 10px;
  width: 30%;
  text-align: right;
}

.value {
  font-size: 16px;
  color: #333;
  width: 65%;
  text-align: left;
}

.btn-supprimer {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-supprimer:hover {
  background-color: #c82333;
}
</style>
