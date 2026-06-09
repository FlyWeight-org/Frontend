import type { VueMessageType } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'

const deDE: LocaleMessage<VueMessageType> = {
  title: 'FlyWeight',
  a11y: {
    skipToContent: 'Zum Hauptinhalt springen',
  },
  account: {
    edit: {
      title: 'Konto bearbeiten',
      button: 'Aktualisieren',
      changePassword: 'Passwort ändern',
      success: 'Deine Kontodaten wurden geändert.',
      weightUnit: {
        label: 'Gewichtseinheit',
        lb: 'Pfund (lb)',
        kg: 'Kilogramm (kg)',
      },
      language: {
        label: 'Sprache',
      },
      passkeys: {
        title: 'Passkeys',
        empty: 'Du hast noch keine Passkeys registriert.',
        unsupported: 'Dein Browser unterstützt keine Passkeys.',
        labelPlaceholder: 'Diesem Passkey einen Namen geben (z. B. „Mein iPhone“)',
        passwordPlaceholder: 'Gib dein Passwort ein',
        passwordRequired: 'Gib dein Passwort ein, um einen Passkey hinzuzufügen.',
        add: 'Passkey hinzufügen',
        rename: 'Umbenennen',
        remove: 'Entfernen',
        save: 'Speichern',
        cancel: 'Abbrechen',
        unnamed: 'Unbenannter Passkey',
        lastUsed: 'Zuletzt verwendet vor {duration}',
        justUsed: 'Gerade eben verwendet',
        neverUsed: 'Nie verwendet',
        registered: 'Passkey registriert.',
        renamed: 'Passkey umbenannt.',
        removed: 'Passkey entfernt.',
        registerError: 'Passkey konnte nicht registriert werden.',
        renameError: 'Passkey konnte nicht umbenannt werden.',
        confirmRemove: 'Diesen Passkey entfernen?',
      },
    },
    nav: {
      myAccount: 'Mein Konto',
    },
  },
  cargo: {
    name: 'Beschreibung',
    bagsWeight: 'Gewicht',
    bagsWeightWithUnit: 'Gewicht ({unit})',
  },
  error: {
    badResponse: 'Ungültige HTTP-Antwort {status}',
    emptyBody: 'Leerer HTTP-Body',
    notFound: 'Nicht gefunden',
    unknown: 'Unbekannter Fehler',
  },
  field: {
    date: {
      placeholder: {
        click: 'Zum Wählen klicken',
        tap: 'Zum Wählen tippen',
      },
      select: 'Auswählen',
      cancel: 'Abbrechen',
    },
  },
  flight: {
    date: 'Datum',
    description: 'Beschreibung',
  },
  flights: {
    finished: {
      body: '{name} hat deine Gewichtsangaben. Bis bald über den Wolken!!',
      note: 'Wenn du dein Gewicht aktualisieren musst, fülle einfach noch einmal {0} aus. Deine bisherigen Angaben werden ersetzt.',
      formLink: 'das Formular',
      title: 'Danke, {name}!',
    },
    list: {
      addFABAria: 'Flug hinzufügen',
      empty: 'Noch keine Flüge.',
      flight: {
        passengers: 'keine Passagiere | 1 Passagier | {count} Passagiere',
      },
    },
    nav: {
      myFlights: 'Meine Flüge',
      addFlight: 'Flug hinzufügen',
      logout: 'Abmelden',
    },
    new: {
      title: 'Flug erstellen',
      button: 'Erstellen',
    },
    show: {
      authorized: {
        delete: 'Flug löschen',
        edit: {
          button: 'Flug aktualisieren',
        },
        header: {
          cargo: 'Fracht',
          passengers: 'Passagiere',
          edit: 'Flug bearbeiten',
        },
        none: 'Dieser Flug konnte nicht gefunden werden',
        owner: 'Das siehst nur du, deine Passagiere nicht:',
        loads: {
          addAria: 'Hinzufügen',
          averageWeight: '({pax} Ø Passagier, {cargo} Fracht gesamt)',
          averageWeightLabel: 'Ø Gewicht',
          bags: 'Gepäck',
          bagsWithWeight: '{weight} Gepäck',
          cargoAndBagsLabel: 'Fracht & Gepäck',
          createButton: 'Hinzufügen',
          noCargo: 'Keine Fracht',
          noPassengers: 'Keine Passagiere',
          removeAria: 'Entfernen',
          totalWeight: 'Gesamt',
        },
        share:
          'Teile einen Link zu dieser Seite mit deinen Passagieren, damit sie ihr Gewicht privat eintragen können. Sie sehen nicht das Gewicht der anderen, sondern geben nur ihr eigenes ein.',
        title: 'Flug am {date}',
      },
      unauthorized: {
        explanation:
          'Trag unten dein Gewicht ein, damit deine Pilotin oder dein Pilot einen sicheren Start planen kann. Es wird nur mit dem Piloten geteilt und nur bis eine Woche nach dem Flug.',
        form: 'Ich heiße # [name] ## und ich wiege # [weight] # Pfund (mit Kleidung). ## Mein Gepäck wiegt ungefähr # [bags_weight] # Pfund. ## [submit]',
        loads: {
          createButton: 'Ich freu mich riesig aufs Fliegen!',
        },
        privacy: 'Dein Gewicht ist privat – nur die Pilotin oder der Pilot sieht die Gesamtwerte',
        title: 'Fliegst du am {date} mit {name}?',
      },
    },
  },
  home: {
    forgotPassword: {
      button: 'Anleitung senden',
      cancelButton: 'Doch nicht',
      description:
        'Gib die E-Mail-Adresse ein, mit der du dich registriert hast, und wir senden dir einen Link, mit dem du dein Passwort zurücksetzen kannst:',
      success:
        'Falls {email} ein gültiges Konto ist, wurde eine E-Mail an diese Adresse gesendet, mit einer Anleitung zum Zurücksetzen deines Passworts.',
      title: 'Passwort vergessen?',
      turnstileFailed: 'Bitte schließe die Verifizierung ab.',
    },
    logIn: {
      button: 'Anmelden',
      error: 'Anmeldung fehlgeschlagen: {error}',
      forgotPassword: 'Ich hab mein Passwort vergessen :(',
      turnstileFailed: 'Bitte schließe die Verifizierung ab.',
    },
    nav: {
      logIn: 'Anmelden',
      signUp: 'Registrieren',
    },
    resetPassword: {
      button: 'Passwort ändern',
      mismatch: 'Die Passwörter stimmen nicht überein.',
      success:
        'Dein Passwort wurde geändert. Du kannst dich jetzt mit deinem neuen Passwort anmelden.',
      title: 'Passwort zurücksetzen',
      tokenError: 'Reset-Token {error}.',
    },
    signUp: {
      button: 'Registrieren',
      checkEmail: 'Schau in dein E-Mail-Postfach – wir haben einen Link an {email} gesendet.',
      error: 'Registrierung fehlgeschlagen: {error}',
      logInLink: 'Zurück zur Anmeldung',
      turnstileFailed: 'Bitte schließe die Verifizierung ab.',
    },
    verifyAccount: {
      failure: 'Verifizierung fehlgeschlagen: {error}.',
      pending: 'Dein Konto wird verifiziert…',
      success: 'Konto verifiziert – du wirst zur Anmeldung weitergeleitet.',
    },
    welcome: {
      description:
        '{title} ist eine Website, über die Passagiere Pilotinnen und Piloten diskret und privat ihr Gewicht mitteilen können. Passagiere brauchen kein Konto, und niemand außer dem Piloten kann das Gewicht der einzelnen Passagiere sehen.',
      subtitle: 'Passagiergewichte in der Cloud!',
    },
  },
  messages: {
    loading: 'Wird geladen…',
  },
  notFound: {
    message:
      'Diese Seite konnte nicht gefunden werden. Vielleicht wurde sie verschoben oder hat nie existiert.',
    goHome: 'Zurück zur Startseite',
  },
  passenger: {
    name: 'Name des Passagiers',
    weight: 'Gewicht',
    weightWithUnit: 'Gewicht ({unit})',
    bagsWeight: 'Gepäckgewicht',
    bagsWeightWithUnit: 'Gepäckgewicht ({unit})',
  },
  pilot: {
    current_password: 'Aktuelles Passwort',
    email: 'E-Mail',
    name: 'Name',
    password: 'Neues Passwort',
    password_confirmation: 'Passwort bestätigen',
  },
  session: {
    password: 'Passwort',
  },
}
export default deDE
