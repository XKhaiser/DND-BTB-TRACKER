function caricaScripts() {
    var scriptJS = [
        'https://code.jquery.com/jquery-3.7.1.min.js',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
        'src/js/Global.js'
    ];

    var c = document.createDocumentFragment();
    for (var i = 0; i < scriptJS.length; i++) {
        var newscript = document.createElement('script');
        newscript.type = 'text/javascript';
        newscript.async = false;
        newscript.defer = false;
        newscript.src = scriptJS[i];
        c.appendChild(newscript);
    }
    document.body.appendChild(c);
}

function caricaLinks() {
    var linkCSS = [
        'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
        'src/css/Global.css'
    ];

    var c = document.createDocumentFragment();
    for (var i = 0; i < linkCSS.length; i++) {
        var newcss = document.createElement("link");
        newcss.type = 'text/css';
        newcss.rel = 'stylesheet';
        newcss.href = linkCSS[i];
        c.appendChild(newcss);
    }
    document.head.appendChild(c);
}

caricaLinks();
caricaScripts();