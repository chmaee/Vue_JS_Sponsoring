<template>
  <div id="wrapper" v-if="loaded">
    <header>
      <h1 @click="$router.push({ name: 'event' })">Annuaire d'évènements</h1>
      <nav>
        <div @click="$router.push({ name: 'event' })">Les Évènements</div>
        <div @click="$router.push({ name: 'allUsers' })">Les membres</div>
        <div v-if="!estConnecte" @click="$router.push({ name: 'login' })">Se connecter</div>
        <div v-if="estConnecte" @click="goToProfile">Voir mon profil</div>
        <div v-if="estConnecte" @click="deconnexion">Se déconnecter</div>
        <div v-if="!estConnecte" @click="$router.push({ name: 'register' })">S'inscrire</div>
        <div v-if="estConnecte && isOrganisateur" @click="$router.push({ name: 'createEvent' })">Créer un événement</div>
      </nav>
    </header>
    <main>
      <notifications />
      <router-view />
    </main>
  </div>
</template>


<script setup lang="ts">
import { apiStore } from '@/util/apiStore';
import { useRouter} from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { Notifications, notify } from '@kyvg/vue3-notification';

const router = useRouter();
const loaded = ref(false);


const estConnecte = computed(() => apiStore.estConnecte.value);
const utilisateurConnecte = computed(() => apiStore.utilisateurConnecte.value);
const isOrganisateur = computed(() => {
  return apiStore.utilisateurConnecte.value?.roles?.some(role => role === 'ROLE_ORGANISATEUR');
});


onMounted(() => {
  apiStore
    .checkConnexion()
    .then(() => {
      notify({
        type: "success",
        title: "Connexion",
        text: "Connexion vérifiée avec succès.",
      });
      loaded.value = true;
    })
    .catch(() => {
      notify({
        type: "error",
        title: "Erreur",
        text: "Impossible de vérifier la connexion. Veuillez réessayer.",
      });
      loaded.value = true;
    });
});

watch(() => utilisateurConnecte.value, (newUser) => {
  if (newUser && newUser.id) {
    notify({
      type: "info",
      title: "Utilisateur connecté",
      text: `Bienvenue, ${newUser.login}!`,
    });
  } else {
    notify({
      type: "info",
      title: "Utilisateur déconnecté",
      text: "Vous n'êtes pas connecté.",
    });
  }
});

function goToProfile() {
  const id = utilisateurConnecte.value?.id;
  if (id) {
    router.push({ name: 'DetailsUsers', params: { id } });
  } else {
    console.error("Utilisateur non authentifié ou ID manquant");
    notify({
      type: "error",
      title: "Erreur",
      text: "Impossible d'afficher le profil. L'utilisateur n'est pas authentifié.",
    });
    router.push({ name: 'login' });
  }
}

function deconnexion() {
  apiStore.logout()
    .then(() => {
      notify({
        type: "success",
        title: "Déconnexion réussie",
        text: "Vous avez été déconnecté avec succès."
      });
      console.log("Déconnexion réussie");
      router.push({ name: 'login' });
    })
    .catch(error => {
      notify({
        type: "error",
        title: "Erreur de déconnexion",
        text: "Impossible de se déconnecter, veuillez réessayer."
      });
      console.error("Erreur de déconnexion:", error);
    });
}
</script>

<style scoped>
#wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: rgb(225, 235, 250);
}
header {
  width: 100%;
  position: sticky;
  top: 0px;
  background-color: rgb(100, 210, 250);
  padding: 20px;
}
header h1 {
  text-align: center;
  font-family: helvetica, serif;
  font-weight: 700;
  cursor: pointer;
}
nav {
  box-shadow: 0 0 0.5rem #999;
  display: flex;
  justify-content: space-evenly;
  width: 80%;
  margin: 0 auto;
}

nav > div {
  padding: 10px;
  background-color: rgb(105, 190, 250);
  flex-grow: 1;
  text-align: center;
  border: solid #22A 1px;
}
nav > div:hover {
  box-shadow: 0 0 0.3rem #000;
  cursor: pointer;
}
main {
  max-width: 1280px;
  width: 780px;
  padding: 10px;
  background-color: rgb(225, 240, 255);
  flex-grow: 1;
}
</style>

