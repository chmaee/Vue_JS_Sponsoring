<script setup lang="ts">
import { ref } from 'vue';
import { apiStore } from '@/util/apiStore';
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";

const newUser = ref({
  login: "",
  nom: "",
  prenom: "",
  email: "",
  plainPassword: "",
  confirmPassword: "",
});

function register() {
  if (newUser.value.plainPassword !== newUser.value.confirmPassword) {
    notify({
      type: "error",
      title: "Erreur",
      text: "Les mots de passe ne correspondent pas.",
    });
    return;
  }

  apiStore.createResource('utilisateurs', {
    login: newUser.value.login,
    nom: newUser.value.nom,
    prenom: newUser.value.prenom,
    adresseEmail: newUser.value.email,
    plainPassword: newUser.value.plainPassword,
  }).then(result => {
    if (result.success) {
      notify({
        type: "success",
        title: "Inscription réussie",
        text: "Votre compte a été créé avec succès !",
      });
      newUser.value = { login: "", nom: "", prenom: "", email: "", plainPassword: "", confirmPassword: "" };
      router.push({ name: 'login' });
    } else {
      notify({
        type: "error",
        title: "Erreur d'inscription",
        text: result.error || "Une erreur inconnue est survenue.",
      });
    }
  }).catch(error => {
    console.error("Erreur réseau :", error);
    notify({
      type: "error",
      title: "Erreur réseau",
      text: "Impossible de s'inscrire pour le moment.",
    });
  });
}
</script>

<template>
  <form @submit.prevent="register">
    <fieldset>
      <legend>Créer un compte</legend>
      <div>
        <label for="login">Login</label>
        <input v-model="newUser.login" id="login" required placeholder="Nom d'utilisateur" />
      </div>
      <div>
        <label for="nom">Nom</label>
        <input v-model="newUser.nom" id="nom" required placeholder="Votre nom" />
      </div>
      <div>
        <label for="prenom">Prénom</label>
        <input v-model="newUser.prenom" id="prenom" required placeholder="Votre prénom" />
      </div>
      <div>
        <label for="email">Email</label>
        <input v-model="newUser.email" id="email" type="email" required placeholder="Votre adresse email" />
      </div>
      <div>
        <label for="plainPassword">Mot de passe</label>
        <input v-model="newUser.plainPassword" id="plainPassword" type="password" required placeholder="Mot de passe" />
      </div>
      <div>
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input v-model="newUser.confirmPassword" id="confirmPassword" type="password" required placeholder="Confirmez le mot de passe" />
      </div>
      <div>
        <button type="submit">S'inscrire</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgb(225, 235, 250);
  padding: 20px;
}

fieldset {
  border: 2px solid #007bff;
  padding: 20px;
  border-radius: 5px;
}

legend {
  font-size: 1.2em;
  font-weight: bold;
}

label {
  margin-bottom: 5px;
}

input {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1em;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
