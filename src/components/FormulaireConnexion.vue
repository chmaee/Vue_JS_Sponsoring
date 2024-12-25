<script setup lang="ts">
import { ref } from 'vue';
import { apiStore } from '@/util/apiStore';
import router from "@/router";
import { notify } from "@kyvg/vue3-notification";

const connectingUser = ref({
  login: "",
  password: ""
});


function connect(): void {
  apiStore.login(connectingUser.value.login, connectingUser.value.password)
    .then((result) => {
      if (result.success) {
        notify({
          type: "success",
          title: "Connexion réussie",
          text: "Bienvenue, vous êtes connecté !"
        });
        router.push({ name: 'event' });
      } else {
        notify({
          type: "error",
          title: "Erreur de connexion",
          text: result.error || "Une erreur inconnue est survenue."
        });
      }
    })
    .catch((error) => {
      notify({
        type: "error",
        title: "Erreur réseau",
        text: "Impossible de se connecter, veuillez réessayer."
      });
      console.error("Erreur réseau :", error);
    });
}
</script>

<template>
  <div class="wrapper">
    <div class="top">
      <h3>Connexion</h3>
    </div>
    <form @submit.prevent="connect" class="content">
      <div class="group">
        <label>Login : </label>
        <input v-model="connectingUser.login" required />
      </div>
      <div class="group">
        <label>Mot de passe : </label>
        <input type="password" v-model="connectingUser.password" required />
      </div>
      <button type="submit">
        Connexion
      </button>
    </form>
  </div>
</template>

<style scoped>
@import "@/components/css/content-box.css";

.wrapper {
  padding: 20px;
}

.top h3 {
  margin-bottom: 20px;
}

.content {
  display: flex;
  flex-direction: column;
}

.group {
  margin-bottom: 15px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
