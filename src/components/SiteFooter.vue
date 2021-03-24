<template>
  <footer class="bg-darkblue text-light">
    <div class="max-w-screen-xl mx-auto px-4 py-8">
      <h2 class="text-3xl mb-8 mt-2 md:mt-8 font-semibold">
        Über das Transparenzranking
      </h2>

      <div class="w-full prose prose-md prose-dark">
        <div class="footer-grid">
          <div>
            <h3>Die Erhebung</h3>
            <p>
              Jede Person hat das Recht auf staatliche Informationen - doch die
              Umsetzung dieses Rechts unterscheidet sich innerhalb Deutschlands.
              Wir haben erstmalig die Informationsfreiheits- und
              Transparenzgesetze in den deutschen Bundesländern miteinander
              verglichen.
            </p>
            <p>
              Um mehr über Informationsfreiheit und Informationsfreiheitgesetze
              zu erfahren, informieren Sie
              <a
                href="https://fragdenstaat.de/info/informationsfreiheit/einfuehrung/"
                >sich bei FragDenStaat</a
              >.
            </p>
          </div>

          <div>
            <h3>Das Projekt</h3>
            <p>
              Das Transparenzranking ist ein Projekt der gemeinnützigen Vereine
              Open Knowledge Foundation Deutschland e.V. und Mehr Demokratie
              e.V.. Der Quellcode ist zu finden
              <a href="https://github.com/okfde/transparenzranking.de"
                >auf Github</a
              >. Verwendete Tools sind Vue.js und Tailwind CSS.
            </p>
            <div class="flex items-center">
              <a href="https://okfn.de" target="_blank" class="w-1/2">
                <img
                  class="mr-6 h-auto object-contain max-h-24"
                  src="../assets/img/okfde.svg"
                  alt="Open Knowledge Foundation Deutschland e.V."
                />
              </a>
              <a
                href="https://www.mehr-demokratie.de/"
                target="_blank"
                class="w-1/2"
              >
                <img
                  class="object-contain max-h-16"
                  src="../assets/img/mehr-demokratie.jpg"
                  alt="Mehr Demokratie e.V."
                />
              </a>
            </div>
          </div>
        </div>

        <div class="footer-grid">
          <div>
            <h3>Downloads</h3>
            <div class="footer-grid">
              <p>
                <i-mdi-file-pdf-outline class="mr-1" />
                <a href="/static/files/ifg-ranking.pdf"
                  >Die Broschüre zum Ranking</a
                >
              </p>
              <p>
                <i-mdi-github class="mr-1" />
                <a href="https://github.com/okfde/transparenzranking.de"
                  >Quellcode & Datensatz
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3>Copyright</h3>
            <p>
              Dieses Werk und die Daten sind lizenziert unter Creative Commons
              Namensnennung 4.0 International (<a
                href="https://creativecommons.org/licenses/by/4.0/"
                >CC BY 4.0</a
              >).
            </p>
          </div>
        </div>

        <div class="footer-grid">
          <div>
            <h3>Kontakt</h3>
            <p>
              Wir freuen uns sehr über Feedback, Kritik und Fragen. Kontaktieren
              Sie uns bitte unter
              <a href="mailto:info@fragdenstaat.de">info@fragdenstaat.de</a>
              (<a href="https://fragdenstaat.de/kontakt/#pgp-key"
                >PGP-Schlüssel</a
              >).
            </p>
          </div>
          <div>
            <h3>Impressum</h3>
            <p>
              Verantwortlicher Diensteanbieter für diese Homepage ist das
              Projekt FragDenStaat der Open Knowledge Foundation Deutschland.
            </p>
            <p>
              <a href="https://fragdenstaat.de/impressum/">Impressum</a>
              /
              <a href="https://fragdenstaat.de/datenschutzerklaerung/">
                Datenschutzerklärung
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
footer .footer-grid {
  @apply md:grid grid-cols-2 gap-x-4;
}
</style>