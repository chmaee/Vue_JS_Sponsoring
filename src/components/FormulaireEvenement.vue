<script setup lang="ts">
import { ref } from 'vue';
import { apiStore } from '@/util/apiStore';
import {notify} from "@kyvg/vue3-notification";
import router from "@/router";

const nom = ref('');
const description = ref('');
const date_debut = ref('');
const date_fin = ref('');
const lieu = ref('');
const capacite = ref(0);
const budget = ref(0);
const categorie = ref('');

const emit = defineEmits<{ updated: [] }>();

function envoyer() {
  const evenement = {
    nom: nom.value,
    description: description.value,
    date_debut: date_debut.value,
    date_fin: date_fin.value,
    lieu: lieu.value,
    capacite: capacite.value,
    budget: budget.value,
    categorie: categorie.value,
  };


  apiStore.createResource('evenements', evenement)
    .then(() => {
      emit('updated');
      nom.value = '';
      description.value = '';
      date_debut.value = '';
      date_fin.value = '';
      lieu.value = '';
      capacite.value = 0;
      budget.value = 0;
      categorie.value = '';

      notify({
        type: "success",
        title: "Événement créé",
        text: "Votre événement a été publié avec succès !"
      });

      router.push({ name: 'event' });
    })
    .catch(error => {
      console.error("Erreur lors de la création de l'événement :", error);

      notify({
        type: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la création de l'événement. Veuillez réessayer."
      });
    });
}

</script>

<template>
  <form @submit.prevent="envoyer">
    <fieldset>
      <legend>Publier un nouvel événement</legend>
      <div>
        <label for="nom">Nom de l'événement</label>
        <input v-model="nom" id="nom" required placeholder="Nom de l'événement" />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea v-model="description" id="description" required placeholder="Description de l'événement"></textarea>
      </div>
      <div>
        <label for="date_debut">Date de début</label>
        <input v-model="date_debut" id="date_debut" type="datetime-local" required />
      </div>
      <div>
        <label for="date_fin">Date de fin</label>
        <input v-model="date_fin" id="date_fin" type="datetime-local" required />
      </div>
      <div>
        <label for="lieu">Lieu</label>
        <input v-model="lieu" id="lieu" required placeholder="Lieu de l'événement" />
      </div>
      <div>
        <label for="capacite">Capacité</label>
        <input v-model="capacite" id="capacite" type="number" min="1" required />
      </div>
      <div>
        <label for="budget">Budget</label>
        <input v-model="budget" id="budget" type="number" min="0" required />
      </div>
      <div>
        <label for="categorie">Catégorie</label>
        <select v-model="categorie" id="categorie" required>
          <option value="Atelier">Atelier</option>
          <option value="Conférence">Conférence</option>
          <option value="Webinaire">Webinaire</option>
          <option value="Séminaire">Séminaire</option>
          <option value="Musique">Musique</option>
          <option value="Formation">Formation</option>
          <option value="Exposition">Exposition</option>
          <option value="Exposition">Sport</option>
        </select>
      </div>
      <div>
        <button type="submit">Publier</button>
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

input, textarea, select {
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="datetime-local"] {
  padding: 8px;
}

select {
  cursor: pointer;
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

input:focus, textarea:focus, select:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
