import type { VueMessageType } from 'vue-i18n'
import type { LocaleMessage } from '@intlify/core-base'

const en: LocaleMessage<VueMessageType> = {
  title: 'FlyWeight',
  account: {
    edit: {
      title: 'Edit Account',
      button: 'Update',
      success: 'Your account information has been changed.'
    },
    nav: {
      myAccount: 'My Account'
    }
  },
  cargo: {
    name: 'Description',
    bagsWeight: 'Weight'
  },
  error: {
    badResponse: 'Invalid HTTP response {status}',
    emptyBody: 'Empty HTTP body',
    notFound: 'Not found',
    unknown: 'Unknown error'
  },
  field: {
    date: {
      placeholder: {
        click: 'Click to select',
        tap: 'Tap to select'
      }
    }
  },
  flight: {
    date: 'Date',
    description: 'Description'
  },
  flights: {
    finished: {
      body: '{name} has your weight info. See you in the skies!!',
      note: 'If you need to update your weight, just fill out {0} again. Your old information will be replaced.',
      formLink: 'the form',
      title: 'Thanks, {name}!'
    },
    list: {
      empty: 'No flights yet.',
      flight: {
        passengers: 'no passengers | 1 passenger | {count} passengers'
      }
    },
    nav: {
      myFlights: 'My Flights',
      addFlight: 'Add a Flight',
      logout: 'Log Out'
    },
    new: {
      title: 'Create Flight',
      button: 'Create'
    },
    show: {
      authorized: {
        delete: 'Delete Flight',
        edit: {
          button: 'Update Flight'
        },
        header: {
          cargo: 'Cargo',
          passengers: 'Passengers',
          edit: 'Edit Flight'
        },
        none: 'Couldn’t find that flight',
        owner: 'Here’s what you can see that they can’t:',
        loads: {
          averageWeight: '({pax} avg. passenger, {cargo} total cargo)',
          createButton: 'Add',
          noCargo: 'No cargo',
          noPassengers: 'No passengers',
          totalWeight: 'Total'
        },
        share:
          'Share a link to this page with your passengers so they can privately add their weights. They will not be able to see anyone else’s weight, only add their own.',
        title: 'Flight on {date}'
      },
      unauthorized: {
        explanation:
          'If so, you should add your weight down below so your pilot can do their proper pre-flight planning. It’s important not to takeoff overweight, which is why you’re being asked to reveal your weight.',
        explanation2:
          'Your weight will not be shared with anyone except the pilot. It will be available to the pilot only until one week after the flight.',
        form: 'My name is # [name] ## and I weigh # [weight] # pounds (with clothes on). ## My bags weigh around # [bags_weight] # pounds. ## [covid19_vaccine] ## [submit]',
        loads: {
          createButton: 'So pumped to go flying!'
        },
        title: 'Are you going on a flight with {name} on {date}?'
      }
    }
  },
  home: {
    forgotPassword: {
      button: 'Send Instructions',
      cancelButton: 'Never Mind',
      description:
        'Enter the email address you used to sign up, and we’ll send you a link you can use to reset your password:',
      success:
        'If {email} is a valid account, then an email has been sent to that address with instructions on how to reset your password.',
      title: 'Forgot your password?'
    },
    logIn: {
      button: 'Log In',
      error: 'Couldn’t log you in: {error}',
      forgotPassword: 'I forgot my password :(',
      rememberMe: 'Remember me',
      newAccounts:
        'Important Note: FlyWeight has been re-released. If you had an account on the old website, you will need to sign up for a new one here before logging in.'
    },
    nav: {
      logIn: 'Log In',
      signUp: 'Sign Up'
    },
    resetPassword: {
      button: 'Change Password',
      success: 'Your password has been changed. You can now log in with your new password.',
      title: 'Reset Password',
      tokenError: 'Reset token {error}.'
    },
    signUp: {
      button: 'Sign Up',
      error: 'Couldn’t sign you up: {error}'
    },
    welcome: {
      description:
        '{title} is a website that lets passengers discreetly inform pilots of their weight in a private manner. No account is necessary for passengers and no one but the pilot can see each passenger’s weight.',
      subtitle: 'Passenger weights in the cloud! (Not that kind of cloud.)'
    }
  },
  messages: {
    loading: 'Loading…'
  },
  passenger: {
    name: 'Passenger name',
    weight: 'Weight',
    bagsWeight: 'Bags weight',
    covid19Vaccination: 'COVID-19 Vaccination'
  },
  pilot: {
    current_password: 'Current password',
    email: 'Email',
    name: 'Name',
    password: 'New password',
    password_confirmation: 'Password confirmation'
  },
  session: {
    password: 'Password'
  }
}
export default en
