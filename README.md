# Appointments

## À propos de l'application appointments

- Licence : [AGPL v3](http://www.gnu.org/licenses/agpl.txt) - Copyright CGI
- Développeur(s) : CGI
- Mainteneur(s) : CGI
- Financeur(s) : CGI
- Description : Module permettant de prendre des rendez-vous en fonction de grilles de disponibilité

## Présentation du module

L'application **appointments** devrait permettre aux utilisateurs de prendre des rendez-vous avec d'autres utilisateurs qui auront créés des grilles de disponibilité.

## Build

Pour build le module, il suffit de lancer le build.sh présent à la racine

<pre>
./build.sh install
</pre>

Le fat-jar se trouve dans backend/target/

## Configuration

<pre>
{
  "name": "fr.openent~appointments~${appointmentsVersion}",
    "config": {
      "main":"fr.openent.appointments.Appointments",
      "port": 8483,
      "app-name" : "Appointments",
      "app-address" : "/appointments",
      "app-icon" : "appointments-large",
      "host": "${host}",
      "ssl" : $ssl,
      "sql" : true,
      "auto-redeploy": false,
      "userbook-host": "${host}",
      "integration-mode" : "HTTP",
      "app-registry.port" : 8012,
      "mode": "${mode}",
      "entcore.port" : 8009,
      "closing-cron": "${closingCron}",
      "min-hours-before-cancellation": ${minHoursBeforeCancellation},
      "theme-platform": "${themePlatform}"
    }
}
</pre>

Dans votre springboard, ajoutez les variables d'envirronement suivantes :

<pre>
closingCron = ${String}
minHoursBeforeCancellation = ${int}
themePlatform = ${String}
</pre>

Voici un exemple de configuration :

<pre>
closingCron = 0 0 0 * * ?          # Tous les jours à minuit fermeture des rendez-vous passés
minHoursBeforeCancellation = 24    # Possibilité de supprimer un rendez-vous (confirmé) 24 heures avant le rendez-vous
themePlatform = crna               # Thème de la plateforme
</pre>

⚠️ La variable `themePlatform`, n'est pour le moment utilisé que sur rdv mais à terme, elle sera utilisé pour l'ensemble des modules utilisant nos themes cgi-ui.
