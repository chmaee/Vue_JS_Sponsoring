<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue';
import { apiStore } from '@/util/apiStore';
import type { Evenement } from '@/types';
import BoiteEvenement from "@/components/BoiteEvenement.vue";
import { notify } from "@kyvg/vue3-notification";
import {useRouter} from "vue-router";

const evenements = ref<Evenement[]>([]);
const estConnecte = computed(() => apiStore.estConnecte.value);
const utilisateurConnecte = computed(() => apiStore.utilisateurConnecte);
const router = useRouter();

const isAdmin = computed(() => {
  return apiStore.utilisateurConnecte.value?.roles?.some(role => role === 'ROLE_ADMIN');
});

const isOrganisateur = computed(() => {
  return apiStore.utilisateurConnecte.value?.roles?.some(role => role === 'ROLE_ORGANISATEUR');
});



const chargerFeed = async () => {
  try {
    const response = await apiStore.getAll("evenements");
    if (response && response.member) {
      evenements.value = response.member;
    } else {
      notify({
        type: "warn",
        title: "Aucune donnée",
        text: "Aucune donnée trouvée ou réponse incorrecte.",
      });
    }
  } catch (error) {
    notify({
      type: "error",
      title: "Erreur",
      text: "Erreur lors de la récupération des événements.",
    });
  }
};

const chargerEvenementsUtilisateur = async () => {
  if (utilisateurConnecte.value?.value?.id) {
    try {
      await apiStore.loadUserEvents();
      notify({
        type: "success",
        title: "Succès",
        text: "Événements utilisateur mis à jour.",
      });
    } catch (error) {
      notify({
        type: "error",
        title: "Erreur",
        text: "Erreur lors du chargement des événements utilisateur.",
      });
    }
  }
};

onMounted(async () => {
  await chargerFeed();
  await chargerEvenementsUtilisateur();

  console.log("Utilisateur connecté:", apiStore.utilisateurConnecte.value);
  console.log("Rôles:", apiStore.utilisateurConnecte.value?.roles);
});

watch(estConnecte, async (isConnected) => {
  if (isConnected) {
    await chargerEvenementsUtilisateur();
  }
});

function goToCreateEvent() {
  router.push({ name: 'createEvent' });
}
const isUserRegistered = (eventId: number): boolean => {
  if (!utilisateurConnecte.value || !utilisateurConnecte.value.value?.evenements) {
    return false;
  }
  return utilisateurConnecte.value.value?.evenements.some((event) => {
    const eventIdFromUrl = parseInt(event["@id"].split("/").pop() || "", 10);
    return eventIdFromUrl === eventId;
  });
};

function inscrireEvenement(eventId: number) {
  if (!utilisateurConnecte.value) {
    notify({
      type: "info",
      title: "Connexion requise",
      text: "Vous devez être connecté pour vous inscrire à un événement.",
    });
    return;
  }

  apiStore.createResource(`evenements/${eventId}/inscription`, {})
    .then(response => {
      if (response.success) {
        notify({
          type: "success",
          title: "Inscription réussie",
          text: "Vous êtes inscrit à l'événement.",
        });
        apiStore.loadUserEvents().then(() => {
          chargerFeed();
        });
      } else {
        notify({
          type: "error",
          title: "Erreur",
          text: `Erreur lors de l'inscription: ${response.error}`,
        });
      }
    })
    .catch(() => {
      notify({
        type: "error",
        title: "Erreur réseau",
        text: "Erreur lors de l'inscription.",
      });
    });
}

function desinscrireEvenement(eventId: number) {
  if (!utilisateurConnecte.value) {
    notify({
      type: "info",
      title: "Connexion requise",
      text: "Vous devez être connecté pour vous désinscrire d'un événement.",
    });
    return;
  }

  apiStore.deleteResource(`evenements/${eventId}/desinscription`)
    .then(response => {
      if (response.success) {
        notify({
          type: "success",
          title: "Désinscription réussie",
          text: "Vous êtes désinscrit de l'événement.",
        });
        apiStore.loadUserEvents().then(() => {
          chargerFeed();
        });
      }
    })
    .catch(() => {
      notify({
        type: "error",
        title: "Erreur réseau",
        text: "Erreur lors de la désinscription.",
      });
    });
}

const supprimerEvenement = (eventId: number) => {
  apiStore.deleteEvent(eventId).then(response => {
    if (response.success) {
      notify({
        type: "success",
        title: "Suppression réussie",
        text: "L'événement a été supprimé avec succès.",
      });
      chargerFeed();
    } else {
      notify({
        type: "error",
        title: "Erreur",
        text: `Impossible de supprimer l'événement: ${response.error}`,
      });
    }
  });
};

</script>

<template>
  <div>
    <h1>Liste des événements</h1>
    <button v-if="isOrganisateur" @click="goToCreateEvent" :disabled="!estConnecte">
      Créer un nouvel événement
    </button>

    <div v-for="event in evenements" :key="event.id">
      <BoiteEvenement :evenement="event" />
      <div v-if="estConnecte">
        <button v-if="isAdmin" @click="supprimerEvenement(event.id)" class="btn-supprimer">
          Supprimer l'événement
        </button>
      </div>

      <div v-if="estConnecte">
        <button
          v-if="!isUserRegistered(event.id)"
          @click="inscrireEvenement(event.id)"
          class="btn-inscrire"
        >
          S'inscrire
        </button>
        <button
          v-if="isUserRegistered(event.id)"
          @click="desinscrireEvenement(event.id)"
          class="btn-desinscrire"
        >
          Se désinscrire
        </button>
      </div>

    </div>
  </div>
</template>


<style scoped>
button {
  padding: 12px 20px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgb(80, 180, 230);
}

button:focus {
  outline: none;
}
.btn-inscrire {
  background-color: #28a745;
}

.btn-inscrire:hover {
  background-color: #218838;
}

.btn-desinscrire {
  background-color: #dc3545;
}

.btn-desinscrire:hover {
  background-color: #c82333;
}

 .btn-supprimer {
   background-color: #dc3545;
 }

.btn-supprimer:hover {
  background-color: #c82333;
}
</style>
