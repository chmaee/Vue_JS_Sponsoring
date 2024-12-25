<script setup lang="ts">
import {ref, computed, onMounted, nextTick, watch} from 'vue';
import { useRoute } from 'vue-router';
import { apiStore } from '@/util/apiStore';
import type { Evenement, Utilisateur } from '@/types';
import { notify } from "@kyvg/vue3-notification";
import BoiteEvenement from "@/components/BoiteEvenement.vue";
import router from "@/router";

const route = useRoute();
const utilisateur = ref<Utilisateur | null>(null);
const evenementsInscrits = ref<Evenement[] | null>(null);
const id = Number(route.params.id);
const estProprietaire = computed(() => apiStore.utilisateurConnecte.value?.id === id);
const estConnecte = computed(() => !!apiStore.utilisateurConnecte.value);
const isEditing = ref(false);
const isAdmin = computed(() => apiStore.utilisateurConnecte.value?.roles?.includes('ROLE_ADMIN'));


const formUtilisateur = ref({
  login: "",
  email: "",
  nom: "",
  prenom: "",
  motDePasse: "",
  motDePasseConfirme: "",
});


onMounted(() => {
  if (!apiStore.estConnecte.value) {
    notify({
      type: "error",
      title: "Non connecté",
      text: "Vous devez être connecté pour accéder à cette page.",
    });
    router.push("/login");
    return;
  }

  if (id !== apiStore.utilisateurConnecte.value?.id && !isAdmin.value) {
    notify({
      type: "error",
      title: "Accès interdit",
      text: "Vous n'êtes pas autorisé à consulter ce profil.",
    });
    router.push("/event");
    return;
  }

  apiStore.getById("utilisateurs", id)
    .then((userData) => {
      utilisateur.value = userData;

      formUtilisateur.value = {
        login: userData.login || "",
        email: userData.adresseEmail || "",
        nom: userData.nom || "",
        prenom: userData.prenom || "",
        motDePasse: "",
        motDePasseConfirme: "",
      };

      if (estProprietaire.value && !isAdmin.value) {
        return apiStore.getResource(`utilisateurs/${id}/evenements`);
      } else {
        evenementsInscrits.value = [];
      }
    })
    .then((evenementsData) => {
      if (evenementsData) {
        evenementsInscrits.value = evenementsData.member || [];
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement :", error);

      notify({
        type: "error",
        title: "Erreur",
        text: "Impossible de charger vos informations.",
      });

      router.push("/login");
    });
});

watch(
  formUtilisateur,
  () => {
    isEditing.value = true;
  },
  { deep: true }
);

function mettreAJourProfil() {
  if (formUtilisateur.value.motDePasse !== formUtilisateur.value.motDePasseConfirme) {
    notify({
      type: "error",
      title: "Erreur de mot de passe",
      text: "Les mots de passe ne correspondent pas.",
    });
    return;
  }

  const updatedUserData = {
    login: formUtilisateur.value.login,
    email: formUtilisateur.value.email,
    nom: formUtilisateur.value.nom,
    prenom: formUtilisateur.value.prenom,
    motDePasse: formUtilisateur.value.motDePasse || "",
  };

  apiStore.updateResource(`utilisateurs/${id}`, updatedUserData)
    .then((response) => {
      if (response.success) {
        notify({
          type: "success",
          title: "Profil mis à jour",
          text: "Vos informations ont été mises à jour avec succès.",
        });

        if (isEditing.value) {
          apiStore.refresh().then(() => {
            notify({
              type: "info",
              title: "Session mise à jour",
              text: "Votre session a été rafraîchie après les modifications.",
            });
          });
        }

        if (updatedUserData.login !== apiStore.utilisateurConnecte.value?.login) {
          notify({
            type: "info",
            title: "Changement de login",
            text: "Votre login a été modifié. Veuillez vous reconnecter.",
          });
          apiStore.logout().then(() => {
            console.log("Utilisateur déconnecté");
            nextTick(() => {
              router.push("/login");
            });
          });
        }
      } else {
        notify({
          type: "error",
          title: "Erreur de mise à jour",
          text: response.error || "Une erreur s'est produite lors de la mise à jour.",
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la mise à jour du profil :", error);

      notify({
        type: "error",
        title: "Erreur réseau",
        text: "Impossible de mettre à jour le profil pour le moment.",
      });
    });
}


function supprimerCompte() {
  apiStore.deleteResource(`utilisateurs/${id}`).then((response) => {
    if (response.success) {
      notify({
        type: "success",
        title: "Compte supprimé",
        text: "Votre compte a été supprimé avec succès.",
      });
      apiStore.logout();
    } else {
      notify({
        type: "error",
        title: "Erreur de suppression",
        text: response.error || "Une erreur inconnue s'est produite.",
      });
    }
  }).catch((error) => {
    console.error("Erreur lors de la suppression du compte :", error);
    notify({
      type: "error",
      title: "Erreur réseau",
      text: "Impossible de supprimer votre compte pour le moment.",
    });
  });
}
</script>

<template>
  <div>
    <h1>Profil de {{ utilisateur?.login }}</h1>

    <div v-if="utilisateur">
      <form v-if="(estProprietaire || isAdmin) && estConnecte" @submit.prevent="mettreAJourProfil">
        <div>
          <label for="login">Login :</label>
          <input v-model="formUtilisateur.login" id="login" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <div>
          <label for="email">Email :</label>
          <input v-model="formUtilisateur.email" id="email" type="email" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <div>
          <label for="nom">Nom :</label>
          <input v-model="formUtilisateur.nom" id="nom" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <div>
          <label for="prenom">Prénom :</label>
          <input v-model="formUtilisateur.prenom" id="prenom" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <div>
          <label for="motDePasse">Mot de passe :</label>
          <input v-model="formUtilisateur.motDePasse" id="motDePasse" type="password" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <div>
          <label for="motDePasseConfirme">Confirmer le mot de passe :</label>
          <input v-model="formUtilisateur.motDePasseConfirme" id="motDePasseConfirme" type="password" :disabled="!(estProprietaire || isAdmin)" />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>

      <div v-if="!(estProprietaire || isAdmin)">
        <p>Login : {{ utilisateur.login }}</p>
        <p>Email : {{ utilisateur.adresseEmail }}</p>
        <p>Nom : {{ utilisateur.nom }}</p>
        <p>Prénom : {{ utilisateur.prenom }}</p>
      </div>

      <div v-if="!isAdmin">
        <h2>Événements inscrits ({{ evenementsInscrits?.length }})</h2>
        <div v-if="evenementsInscrits && evenementsInscrits.length > 0">
          <BoiteEvenement
            v-for="event in evenementsInscrits"
            :key="event.id"
            :evenement="event"
          />
        </div>
        <p v-else>Aucun événement inscrit.</p>
      </div>
      <button v-if="estProprietaire" @click="supprimerCompte" class="supprimer">Supprimer mon compte</button>
    </div>

    <div v-else>
      <p>Chargement en cours...</p>
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9f9f9;
  padding: 15px;
  border: 1px solid #ccc;
}

button {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.supprimer {
  background-color: #dc3545;
}

.supprimer:hover {
  background-color: #c82333;
}

</style>
