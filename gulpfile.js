// Definiere die Variable "preprocessor"
let preprocessor = 'scss'; // Auswahl des Präprozessors im Projekt - sass oder less


// Definieren der Gulp-Konstanten
const { src, dest, parallel, series, watch } = require('gulp');

// Verbinden von gulp-concat
const concat = require('gulp-concat');

// Verbinden von gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Verbinden der Module gulp-sass und gulp-less
const scss = require('gulp-sass')(require('sass'));
const less = require('gulp-less');

// Autoprefixer verbinden
const autoprefixer = require('gulp-autoprefixer');

// Verbinden des gulp-clean-css Moduls
const cleancss = require('gulp-clean-css');

// Verbinden von compress-images für die Arbeit mit Bildern
const imagecomp = require('compress-images');

// Verbinden des del-Moduls
const del = require('del');




function scripts() {
    return src([ // Nehmen von Dateien aus Quellen
        //'node_modules/jquery/dist/jquery.min.js', // Beispiel für eine Bibliotheksverbindung
        'src/scripts/*.js', // Benutzerdefinierte Skripte, die die Bibliothek verwenden, müssen am Ende der Datei
    ])
        .pipe(concat('scripts.min.js')) // Zusammenfassen in einer Datei
        .pipe(uglify()) // Komprimierung von JavaScript
        .pipe(dest('prod/js/')) // Hochladen der fertigen Datei in den Zielordner
}

function styles() {
    return src('src/' + preprocessor + '/*.' + preprocessor + '') // Auswahl der Quelle:  "src/sass/*.scss" oder
        // "src/less/*.less"
        .pipe(eval(preprocessor)()) // Den Wert der Variablen "preprocessor" in eine Funktion umwandeln
        .pipe(concat('styles.min.css')) // Zusammenfassen in einer Datei styles.min.js
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Präfixe mit Autoprefixer erstellen
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
            // Minimierung der Styles
        .pipe(dest('prod/css/')) // Das Ergebnis in den Ordner "pros/css/" hochladen
}

async function images() {
    imagecomp(
        "src/images/**/*", // Alle Bilder aus dem Quellordner nehmen
        "prod/images/", // Hochladen der optimierten Bilder in den Zielordner
        { compress_force: false, statistic: true, autoupdate: true }, false, // Einstellung der grundlegenden Parameter
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } }, // Bilder komprimieren und optimieren
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) { // Обновляем страницу по завершению
            if (completed === true) {
               console.log('Done!');
            }
        }
    )
}

function cleanimg() {
    return del('prod/images/**/*', { force: true }) // Alle Inhalte des Ordners "prod/images/**/" löschen
}

function cleanprod() {
    return del('prod/**/*', { force: true }) // Den gesamten Inhalt des Ordners "prod/" löschen
}




// Export der Funktion scripts() in eine Skriptaufgabe
exports.scripts = scripts;

// Export der Funktion styles() zu Aufgabenstilen
exports.styles = styles;

// Export von Bildern() in die Bilder-Taskleiste
exports.images = images;

// Exportieren von cleanimg() als cleanimg-Aufgabe
exports.cleanimg = cleanimg;

// Export function cleanprod() als cleanprod
exports.cleanprod = cleanprod;

// Eine neue "Build"-Aufgabe erstellen, die die erforderlichen Vorgänge nacheinander ausführt
exports.build = series(styles, scripts, images);




