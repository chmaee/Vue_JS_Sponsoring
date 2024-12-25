import {ref} from "vue";
import type {Utilisateur} from "@/types";
import router from "@/router";

export const apiStore = {
  apiUrl: "http://localhost/sponsoringtest/public/api/",
  utilisateurConnecte: ref<Utilisateur | null>(null),
  estConnecte: ref(false),

  async getAll(resource: string): Promise<any> {
    return fetch(this.apiUrl + resource)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur de récupération des données');
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Erreur dans la récupération des ressources:", error);
        throw error;
      });
  },


  async getById(resource: string, id: number): Promise<any> {
    if (!id) {
      return Promise.reject(new Error("L'identifiant (id) est requis pour récupérer la ressource."));
    }

    return fetch(`${this.apiUrl}${resource}/${id}`, {
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Non autorisé - Vous devez vous connecter pour accéder à ces données.');
          }
          throw new Error('Erreur de récupération des données');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Erreur dans la récupération des données:', error);
        throw error;
      });
  }
  ,

  async login(login: string, password: string): Promise<{ success: boolean, error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}auth`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ login, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }

      const data = await response.json();
      if (data.id) {
        this.utilisateurConnecte.value = data as Utilisateur;
        if (!this.utilisateurConnecte.value.roles) {
          this.utilisateurConnecte.value.roles = [];
        }
        this.estConnecte.value = true;
        await this.loadUserEvents();

        return { success: true };
      } else {
        throw new Error("Les données utilisateur ne contiennent pas d'identifiant.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  async logout(): Promise<{ success: boolean, error?: string }> {
    try {
      if (!this.utilisateurConnecte.value) {
        console.warn("L'utilisateur est déjà déconnecté.");
        await router.push("/login");
        return { success: false, error: "L'utilisateur est déjà déconnecté." };
      }

      const refreshResponse = await this.refresh();

      if (!refreshResponse || refreshResponse.status === 401) {
        console.warn("Le token est expiré ou invalide. Redirection vers /login.");
        this.utilisateurConnecte.value = null;
        this.estConnecte.value = false;
        await router.push("/login");
        return { success: false, error: "Le token est expiré ou invalide." };
      }

      const response = await fetch(`${this.apiUrl}token/invalidate`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l'invalidation du token :", errorData);
        return { success: false, error: errorData.message };
      }

      this.utilisateurConnecte.value = null;
      this.estConnecte.value = false;
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      return { success: false, error: "Erreur réseau lors de la déconnexion." };
    }
  },

  async getResource(url: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}${url}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn(`Erreur 401 détectée pour l'URL : ${url}`);
          await this.refresh();
          return this.getResource(url);
        }
        throw new Error(`Erreur lors de la récupération de la ressource ${url} (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur dans getResource (${url}) :`, error);
      throw error;
    }
  },

  async updateResource(resource: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}${resource}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`Erreur dans updateResource (${resource}) :`, error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  async deleteResource(resource: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}${resource}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`Erreur dans deleteResource (${resource}) :`, error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  async createResource(ressource: string, data: any, refreshAllowed = true): Promise<{ success: boolean, error?: string }> {
    return fetch(`${this.apiUrl}${ressource}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }).then(reponsehttp => {
        if (reponsehttp.ok) {
          return reponsehttp.json().then(() => {
              return { success: true };
            });
        } else if (reponsehttp.status === 401 && refreshAllowed) {
          return this.refresh()
            .then(() => {
              return this.createResource(ressource, data, false);
            })
            .catch(() => {
              return { success: false, error: "Unauthorized, failure to refresh token." };
            });
        } else {
          return reponsehttp.json()
            .then(reponseJSON => {
              return { success: false, error: reponseJSON.message };
            });
        }
      })
      .catch(error => {
        return { success: false, error: error.message || "Erreur réseau" };
      });
  },


  async refresh(): Promise<any> {
    const data = null;
    try {
      const response = await fetch(`${this.apiUrl}token/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Le token est expiré ou invalide. Redirection vers /login.");
          this.utilisateurConnecte.value = null;
          this.estConnecte.value = false;
          await router.push("/login");
        }
      } else {
        const data = await response.json();
        if (data.utilisateur) {
          this.utilisateurConnecte.value = data.utilisateur;
          this.estConnecte.value = true;
        }
      }

      return data;
    } catch (error) {
      console.error("Erreur de rafraîchissement :", error);
      this.utilisateurConnecte.value = null;
      this.estConnecte.value = false;
      throw error;
    }
  },



  async checkConnexion(): Promise<void> {
    if (!this.estConnecte.value) {
      this.utilisateurConnecte.value = null;
      this.estConnecte.value = false;
      return;
    }

    try {
      const response = await this.refresh();
      this.utilisateurConnecte = response;
      this.estConnecte.value = true;
    } catch (error) {
      console.error("Utilisateur non connecté :", error);
      this.utilisateurConnecte.value = null;
      this.estConnecte.value = false;
    }
  },

  async loadUserEvents(): Promise<void> {
    if (!this.utilisateurConnecte.value) {
      console.log("Aucun utilisateur connecté.");
      return;
    }
    try {
      const response = await fetch(`${this.apiUrl}utilisateurs/${this.utilisateurConnecte.value.id}/evenements`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements de l'utilisateur.");
      }

      const data = await response.json();
      if (this.utilisateurConnecte.value) {
        this.utilisateurConnecte.value.evenements = data?.member?.length ? data.member : [];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements :", error);
      if (this.utilisateurConnecte.value) {
        this.utilisateurConnecte.value.evenements = [];
      }
    }
  },

  async deleteEvent(eventId: number): Promise<{ success: boolean, error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}evenements/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'événement (${eventId}):`, error);
      return { success: false, error: "Erreur réseau" };
    }
  },

  async deleteUser(userId: number): Promise<{ success: boolean, error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}utilisateurs/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur (${userId}):`, error);
      return { success: false, error: "Erreur réseau" };
    }
  }


};
