export interface Utilisateur {
  "@id": string;
    id: number;
    login: string;
    nom: string;
    prenom: string;
    roles: Array<string>;
    adresseEmail: string;
    password: string;
  evenements: Array<Evenement>;
  participations: Array<Evenement>;
}

export interface Evenement {
    "@id": string;
    id: number;
    nom: string;
    description: string;
    date_debut: string;
    date_fin: string;
    lieu: string;
    budget: number;
    categorie: string;
    organisateur: Utilisateur;
    participants: Array<Utilisateur>;
}
