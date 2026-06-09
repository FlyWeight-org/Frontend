import type { VueMessageType } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'

const frFR: LocaleMessage<VueMessageType> = {
  title: 'FlyWeight',
  a11y: {
    skipToContent: 'Aller au contenu principal',
  },
  account: {
    edit: {
      title: 'Modifier le compte',
      button: 'Mettre à jour',
      changePassword: 'Changer le mot de passe',
      success: 'Les informations de votre compte ont été modifiées.',
      weightUnit: {
        label: 'Unité de masse',
        lb: 'Livres (lb)',
        kg: 'Kilogrammes (kg)',
      },
      language: {
        label: 'Langue',
      },
      passkeys: {
        title: 'Clés d’accès',
        empty: 'Vous n’avez pas encore enregistré de clé d’accès.',
        unsupported: 'Votre navigateur ne prend pas en charge les clés d’accès.',
        labelPlaceholder: 'Nommez cette clé d’accès (par ex. « Mon iPhone »)',
        passwordPlaceholder: 'Saisissez votre mot de passe',
        passwordRequired: 'Saisissez votre mot de passe pour ajouter une clé d’accès.',
        add: 'Ajouter une clé d’accès',
        rename: 'Renommer',
        remove: 'Supprimer',
        save: 'Enregistrer',
        cancel: 'Annuler',
        unnamed: 'Clé d’accès sans nom',
        lastUsed: 'Dernière utilisation il y a {duration}',
        justUsed: 'Utilisée à l’instant',
        neverUsed: 'Jamais utilisée',
        registered: 'Clé d’accès enregistrée.',
        renamed: 'Clé d’accès renommée.',
        removed: 'Clé d’accès supprimée.',
        registerError: 'Impossible d’enregistrer la clé d’accès.',
        renameError: 'Impossible de renommer la clé d’accès.',
        confirmRemove: 'Supprimer cette clé d’accès ?',
      },
    },
    nav: {
      myAccount: 'Mon compte',
    },
  },
  cargo: {
    name: 'Description',
    bagsWeight: 'Masse',
    bagsWeightWithUnit: 'Masse ({unit})',
  },
  error: {
    badResponse: 'Réponse HTTP non valide {status}',
    emptyBody: 'Corps de réponse HTTP vide',
    notFound: 'Introuvable',
    unknown: 'Erreur inconnue',
  },
  field: {
    date: {
      placeholder: {
        click: 'Cliquez pour choisir',
        tap: 'Touchez pour choisir',
      },
      select: 'Sélectionner',
      cancel: 'Annuler',
    },
  },
  flight: {
    date: 'Date',
    description: 'Description',
  },
  flights: {
    finished: {
      body: '{name} a bien reçu votre poids. On se retrouve là-haut !',
      note: 'Si vous devez mettre à jour votre poids, il vous suffit de remplir à nouveau {0}. Vos anciennes informations seront remplacées.',
      formLink: 'le formulaire',
      title: 'Merci, {name} !',
    },
    list: {
      addFABAria: 'Ajouter un vol',
      empty: 'Aucun vol pour l’instant.',
      flight: {
        passengers: 'aucun passager | 1 passager | {count} passagers',
      },
    },
    nav: {
      myFlights: 'Mes vols',
      addFlight: 'Ajouter un vol',
      logout: 'Se déconnecter',
    },
    new: {
      title: 'Créer un vol',
      button: 'Créer',
    },
    show: {
      authorized: {
        delete: 'Supprimer le vol',
        edit: {
          button: 'Mettre à jour le vol',
        },
        header: {
          cargo: 'Fret',
          passengers: 'Passagers',
          edit: 'Modifier le vol',
        },
        none: 'Impossible de trouver ce vol',
        owner: 'Voici ce que vous pouvez voir et qu’ils ne voient pas :',
        loads: {
          addAria: 'Ajouter',
          averageWeight: '({pax} par passager en moy., {cargo} de fret au total)',
          averageWeightLabel: 'masse moy.',
          bags: 'Bagages',
          bagsWithWeight: '{weight} de bagages',
          cargoAndBagsLabel: 'Fret et bagages',
          createButton: 'Ajouter',
          noCargo: 'Aucun fret',
          noPassengers: 'Aucun passager',
          removeAria: 'Supprimer',
          totalWeight: 'Total',
        },
        share:
          'Partagez le lien de cette page avec vos passagers pour qu’ils puissent ajouter leur masse en toute confidentialité. Ils ne pourront pas voir la masse des autres, seulement saisir la leur.',
        title: 'Vol du {date}',
      },
      unauthorized: {
        explanation:
          'Indiquez votre poids ci-dessous pour que votre pilote puisse préparer un décollage en toute sécurité. Il ne sera communiqué qu’au pilote, et seulement jusqu’à une semaine après le vol.',
        form: 'Je m’appelle # [name] ## et je pèse # [weight] # livres (habillé). ## Mes bagages pèsent environ # [bags_weight] # livres. ## [submit]',
        loads: {
          createButton: 'Trop hâte de décoller !',
        },
        privacy: 'Votre poids est confidentiel — seul le pilote voit les totaux',
        title: 'Vous partez en vol avec {name} le {date} ?',
      },
    },
  },
  home: {
    forgotPassword: {
      button: 'Envoyer les instructions',
      cancelButton: 'Laisser tomber',
      description:
        'Saisissez l’adresse e-mail utilisée lors de votre inscription, et nous vous enverrons un lien pour réinitialiser votre mot de passe :',
      success:
        'Si {email} correspond à un compte valide, un e-mail vient d’être envoyé à cette adresse avec les instructions pour réinitialiser votre mot de passe.',
      title: 'Mot de passe oublié ?',
      turnstileFailed: 'Veuillez compléter le test de vérification.',
    },
    logIn: {
      button: 'Se connecter',
      error: 'Connexion impossible : {error}',
      forgotPassword: 'J’ai oublié mon mot de passe :(',
      turnstileFailed: 'Veuillez compléter le test de vérification.',
    },
    nav: {
      logIn: 'Se connecter',
      signUp: 'S’inscrire',
    },
    resetPassword: {
      button: 'Changer le mot de passe',
      mismatch: 'Les mots de passe ne correspondent pas.',
      success:
        'Votre mot de passe a été modifié. Vous pouvez désormais vous connecter avec votre nouveau mot de passe.',
      title: 'Réinitialiser le mot de passe',
      tokenError: 'Jeton de réinitialisation {error}.',
    },
    signUp: {
      button: 'S’inscrire',
      checkEmail: 'Vérifiez votre boîte mail — nous avons envoyé un lien à {email}.',
      error: 'Inscription impossible : {error}',
      logInLink: 'Retour à la connexion',
      turnstileFailed: 'Veuillez compléter le test de vérification.',
    },
    verifyAccount: {
      failure: 'Échec de la vérification : {error}.',
      pending: 'Vérification de votre compte…',
      success: 'Compte vérifié — redirection vers la connexion.',
    },
    welcome: {
      description:
        '{title} est un site web qui permet aux passagers d’informer discrètement les pilotes de leur poids, en toute confidentialité. Aucun compte n’est nécessaire pour les passagers et personne, hormis le pilote, ne peut voir le poids de chaque passager.',
      subtitle: 'Le poids des passagers dans le cloud !',
    },
  },
  messages: {
    loading: 'Chargement…',
  },
  notFound: {
    message:
      'Nous n’avons pas trouvé cette page. Elle a peut-être été déplacée ou n’a jamais existé.',
    goHome: 'Retour à l’accueil',
  },
  passenger: {
    name: 'Nom du passager',
    weight: 'Poids',
    weightWithUnit: 'Poids ({unit})',
    bagsWeight: 'Poids des bagages',
    bagsWeightWithUnit: 'Poids des bagages ({unit})',
  },
  pilot: {
    current_password: 'Mot de passe actuel',
    email: 'E-mail',
    name: 'Nom',
    password: 'Nouveau mot de passe',
    password_confirmation: 'Confirmation du mot de passe',
  },
  session: {
    password: 'Mot de passe',
  },
}
export default frFR
