import path from 'path';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import config from './config';
import { formatDate } from './i18n';

export default function createWaiver(reg, format) {
  switch (format) {
    case 'pdf':
      return createPDF(reg);
    case 'html':
      return createHTML(reg);
    default:
      throw new Error(`Unsupported waiver format: ${format}`);
  }
}

function createPDF(reg) {
  const doc = new PDFDocument({
    size: 'a4',
    margins: { top: 40, left: 80, right: 40, bottom: 30 },
  });

  const title = `Einverständniserklärung für ${reg.child.firstName} ${reg.child.lastName}`;
  doc.info.Author = 'Kinderferienspiele Niedergründau';
  doc.info.Title = title;

  bold(doc).fontSize(18).text(`Kinderferienspiele Niedergründau ${config.year}`);

  bold(doc).fontSize(14).text(title);
  doc.moveDown();

  regular(doc).fontSize(11);

  const appendLines = (lines) =>
    lines.forEach((line) => {
      doc.text(line);
      doc.moveDown();
    });

  appendLines(createBody(reg));
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  appendLines(createFooter(reg));

  return doc;
}

function createHTML(reg) {
  const s = new Readable();
  createBody(reg)
    .map((line) => `<p>${line}</p>`)
    .forEach((line) => s.push(line));
  s.push(null);
  return s;
}

const fontsDir = path.resolve(__dirname, 'fonts');

function regular(doc) {
  return doc.font(path.resolve(fontsDir, 'OpenSans-Regular.ttf'));
}

function bold(doc) {
  return doc.font(path.resolve(fontsDir, 'OpenSans-Bold.ttf'));
}

function createBody(reg) {
  return `
Hiermit erkläre ich mich einverstanden, dass mein Kind an den Kinderferienspielen Niedergründau vom ${formatDate(
    config.startDate
  )} bis ${formatDate(config.endDate)} ${
    reg.uebernachtung && reg.uebernachtung.type === 'uebernachtung' ? 'mit anschließender Übernachtung ' : ''
  }teilnehmen darf.

Mir ist bekannt, dass die Anmeldung erst gültig ist, wenn diese Einverständniserklärung unterschrieben vorliegt und alle notwendigen Zahlungen geleistet sind.

Bei einer Absage durch teilnehmende Personen kann die Rückerstattung des Beitrages nach dem ${formatDate(
    config.registrationDeadline
  )} nicht garantiert werden.

Mein Kind ist von mir angewiesen, den Anordnungen der Aufsichtspersonen Folge zu leisten. Die Aufsichtsführenden haben das Recht, mein Kind bei fortwährender Missachtung von Regeln und Anweisungen nach Hause zu schicken und von der weiteren Teilnahme auszuschließen. Eine Beitragserstattung erfolgt in diesem Fall nicht.

Ich garantiere, dass unter der Telefonnummer des Notfallkontaktes jederzeit jemand erreichbar ist.

Mir ist bewusst, dass in Ausnahmefällen die Aufsicht für kurze Zeit auch von einer minderjährigen Person wahrgenommen werden wird.

Ich bin damit einverstanden, dass mein Kind in Ausnahmesituationen im privateigenen Pkw befördert wird.

Meine Angaben in Bezug auf Allergien und Unverträglichkeiten sind vollständig.

Die Veranstalter haften nicht für den Verlust oder die Beschädigung von Gegenständen.

Es werden während der Ferienspiele Fotos gemacht. Ich bin mit deren Veröffentlichung auf den Homepages und in den Gemeindebriefen der drei ausrichtenden Kirchengemeinden einverstanden.

Mir ist bekannt, dass zum Zeitpunkt der Anmeldung etwaige Corona-Maßnahmen noch nicht festgelegt werden können. Ich erkläre mich aber einverstanden, dass mein Kind getestet zu den Ferienspielen kommen wird, wenn das Veranstaltungsteam darum bittet.
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length);
}

function createFooter() {
  return `
Datum, Unterschrift

Bitte schicken Sie diese Einverständniserklärung bis zum ${formatDate(
    config.waiverDeadline
  )} unterschrieben an das Gemeindebüro Katholischen Kirchengemeinde Christkönig oder geben sie in einem verschlossenen Umschlag dort ab.

Gemeindebüro Christkönig, Niedergründauer Straße 20 (gegenüber Anton-Calaminus-Schule), 63584 Gründau. Einwurf in den Briefkasten genügt.`
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length);
}
