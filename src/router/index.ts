import { createRouter, createWebHistory } from 'vue-router';
import Event from '@/views/EventMain.vue';
import Users from "@/views/AllUsers.vue";
import FormulaireConnexion from "@/components/FormulaireConnexion.vue";
import FormulaireEvenement from "@/components/FormulaireEvenement.vue";
import FormulaireInscription from "@/components/FormulaireInscription.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'event' } },
    { path: '/event', name: 'event',  component: Event },
    { path: '/event/:id', name: 'detailsEvents', component: () => import('@/views/DetailsEvents.vue') },
    { path: '/create-event', name: 'createEvent', component: FormulaireEvenement },
    { path: '/users', name: 'allUsers', component: Users },
    { path: '/users/:id', name: 'DetailsUsers', component: () => import('@/views/DetailsUsers.vue') },
    { path: '/login', name: 'login', component: FormulaireConnexion },
    {path: '/register', name: 'register', component: FormulaireInscription,},
    { path: '/:pathMatch(.*)*', redirect: { name: 'event' } }
  ]
});

export default router;
