<template>
  <div class="container flex flex-col items-center">
    <h1 class="headline">Transparenzranking 2021</h1>

    <div class="prose prose-lg text-center">
      <p class="max-w-screen-lg w-full text-center">
        Jede Person hat das Recht auf staatliche Informationen - doch die
        Umsetzung dieses Rechts unterscheidet sich innerhalb Deutschlands. Wir
        haben die Informationsfreiheits- und Transparenzgesetze in
        Bund und Ländern miteinander verglichen.
      </p>
    </div>

    <ranking-overview class="my-12" />

    <div class="prose prose-lg">
      <p>
        Transparenz erleichtert Korruptionsbekämpfung und Kontrolle und stärkt
        damit das Vertrauen der Bürger:innen in Politik und Verwaltung. Nur wer
        von einem Vorgang weiß, kann sich aktiv in politische Prozesse
        einbringen. Aber auch dem Staat selbst bringt Transparenz Vorteile, weil
        Informationen behördenintern besser zugänglich werden.
      </p>
      <p>
        Deshalb setzen sich Mehr Demokratie und die Open Knowledge Foundation
        für mehr Transparenz in allen Bundesländern ein. An Vorschlägen für gute
        Transparenzgesetze mangelt es nicht. Beispielsweise hat das Bündnis für
        ein Berliner Transparenzgesetz
        <a href="https://volksentscheid-transparenz.de/"
          >mit einem Antrag auf ein Volksbegehren 2019</a
        >
        einen Entwurf für ein modernes, progressives Auskunftsgesetz gemacht.
        Dafür, dass viele diesem Vorschlag folgen, werden wir weiter arbeiten.
      </p>

      <ranking-map />

      <p>
        Sie können <router-link to="/methodik/">hier</router-link> mehr über
        unsere Kriterien zur Erfassung des Rankings erfahren.
      </p>
    </div>
  </div>
</template>
