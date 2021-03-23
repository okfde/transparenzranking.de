<template>
  <div class="container">
    <h1 class="mb-0 headline">Was braucht ein gutes Transparenzgesetz?</h1>

    <div class="prose prose-lg mt-4">
      <h2>Unsere Kriterien</h2>

      <p>
        Bei der Punktevergabe kommt den Informationsrechten die größte Bedeutung
        zu, gefolgt von den Auskunftspflichten. Da umfangreiche
        Informationsrechte und Auskunftspflichten wenig bringen, wenn sie durch
        ausufernde Ausnahmebestimmungen wieder eingeschränkt werden, bekommen
        gut geregelte Ausnahmetatbestände ebenfalls eine hohe Punktzahl. Die
        Ausgestaltung von Antragstellung und Gebühren schließlich entscheidet
        mit darüber, inwieweit die Bürger/innen theoretisch garantierte
        Informations- und Auskunftsrechte auch praktisch nutzen können. Als
        Bewertungsmaßstab dienen die derzeit bestehenden gesetzlichen Regelungen
        im Vergleich untereinander.
      </p>

      <p>
        Gemeinsam ergeben die Bewertungen für die verschiedenen Bereiche die
        mögliche Höchstpunktzahl von 100 Prozent.
      </p>

      <methodology-heading :category="getCategory('informationsrechte')" />

      <p>
        Das stärkste Gewicht in dieser Kategorie hat die erstmals in Hamburg
        2012 eingeführte eigenständige („proaktive“) Veröffentlichung von
        Informationen. Dadurch muss man nicht mehr unbedingt einen Antrag
        stellen, um Informationen zu erhalten, was wir als die weitestgehende
        Neuentwicklung der letzten Jahre bewerten. Nicht sehr viel wert ist
        diese Bringschuld der Behörden allerdings, wenn Akten nicht
        ordnungsgemäß geführt werden. Zu guten Punktzahlen führen in dieser
        Kategorie weiterhin die Festlegung der Informationsfreiheit als
        Jedermenschrecht, die Verankerung von Auskunftsansprüchen in der
        Landesverfassung, eine Zusammenführung von Umwelt- und
        Informationsfreiheitsgesetz und das Recht auf Kopien.
      </p>

      <methodology-heading :category="getCategory('auskunftspflichten')" />
      <p>
        Aufgaben der Daseinsvorsorge sind oft in städtische Unternehmen
        ausgelagert und werden nicht von den Verwaltungen wahrgenommen. Dies
        darf kein Weg sein, die Transparenz-Pflicht zu umgehen. Ebenso müssen
        auf Landesebene etwa Hochschulen, der Rechnungshof, der
        Verfassungsschutz, staatlich kontrollierte Unternehmen, Sparkassen,
        staatliche Stiftungen oder der öffentlich-rechtliche Rundfunk vom
        Transparenz-Anspruch umfasst sein.
      </p>

      <methodology-heading :category="getCategory('ausnahmen')" />
      <p>
        Selbstverständlich ist der Anspruch auf Transparenz staatlichen Handelns
        nicht grenzenlos, sondern endet dort, wo Persönlichkeitsrechte betroffen
        sind oder zu weit in privatwirtschaftliche Interessen eingegriffen wird.
        Wichtig ist allerdings, dass diese Rechte nicht absolut geschützt sind.
        Ein Transparenz- oder Informationsfreiheitsgesetz muss Klauseln zur
        Abwägung des öffentlichen Interesses an einer Information enthalten.
        Gleiches gilt für den Schutz von Betriebs- und Geschäftsgeheimnissen.
        Selbstredend darf die Übernahme öffentlicher Aufgaben durch private
        Anbieter nicht zu massiven Nachteilen für den Anbieter auf dem Markt
        führen. Andererseits darf die pure Behauptung von Geschäftsgeheimnissen
        kein Argument für völlige Intransparenz sein.
      </p>

      <methodology-heading :category="getCategory('antragstellung')" />
      <p>
        Auch nachdem ein Transparenzgesetz in Kraft getreten ist, bleibt ein
        Antragsrecht für nicht aktiv veröffentlichte Informationen notwendig.
        Die Anfrage kann elektronisch und anonym erfolgen, gegebenenfalls
        unterstützt durch Behörden. Die Antwortfrist beträgt nur wenige Wochen.
        Verstößt eine Behörde gegen die gesetzlichen Regelungen, sind Sanktionen
        möglich.
      </p>

      <methodology-heading :category="getCategory('gebuehren')" />
      <p>
        Die Ablehnung einer Anfrage auf Informationsfreigabe kostet
        grundsätzlich nichts, ebenso wie die meisten Anfragen. So ist das
        international üblich. Gebühren werden höchstens in Ausnahmefällen
        verlangt und auf eine Maximalsumme von 500 Euro gedeckelt. Die Kosten
        sind vor Bearbeitung der Anfrage bekannt.
      </p>

      <methodology-heading
        :category="getCategory('informationsfreiheitsbeauftragte')"
      />
      <p>
        Der oder die Informationsfreiheitsbeauftragte ist erste Instanz der
        Klärung bei Konflikten in der Anwendung der Gesetze. Um diese Aufgabe
        erfüllen zu können, braucht er oder sie Einsichtsund Klagerechte und
        muss politisch unabhängig arbeiten können. Zu guter Letzt ist aber auch
        die Behörde des oder der Informationsfreiheitsbeauftragten selbst
        auskunftspflichtig. Die Auswahl und Gewichtung der Kriterien beruht auf
        der Abstimmung mit zahlreichen Expert/innen der Informationsfreiheit aus
        allen Bundesländern. Wir bedanken uns an dieser Stelle für alle
        Rückmeldungen und Verbesserungsvorschläge!
      </p>
    </div>
  </div>
</template>

<script setup>
import categories from '@data/categories';
import MethodologyHeading from '../components/MethodologyHeading.vue';

function getCategory(category) {
  return categories[category];
}
</script>