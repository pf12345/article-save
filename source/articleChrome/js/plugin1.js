if( document.getElementsByTagName('html')[0].id !== "inote_html"){
    void(function iNote(w, d, c, j, s, o) {
        h = document.getElementsByTagName('head')[0];
        u = 'http://file.ireadhome.com/plugins/';
        b = d.createElement('script');
        b.id = 'iread_googleJq';
        b.charset = 'utf-8';
        b.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js';
        h.appendChild(b);

        var id=setInterval(loadJs,500);

        function loadJs() {
//            if (w.jQuery) {
            clearInterval(id);
            if (!d.getElementById(j)) {
                b = d.createElement('script');
                b.id = j;
                b.charset = 'utf-8';
                b.src = u + 'inote_read_novel.js?'+Math.random();
                h.appendChild(b);
            }
            if (!d.getElementById(s)) {
                b = d.createElement('script');
                b.id = s;
                b.charset = 'utf-8';
                b.src = u + 'swfobject.min.js';
                h.appendChild(b);
            }
            if (!d.getElementById(c)) {
                l = d.createElement('link');
                l.id = c;
                l.className = 'iread_style';
                l.rel = 'stylesheet';
                l.type = 'text/css';
                l.href = u + 'inote.css?109';
                l.media = 'all';
                h.appendChild(l);
            }
            try{
                //if (!JSON) {
                f = d.createElement('script');
                f.id = o;
                f.charset = 'utf-8';
                f.src = u + 'json2.min.js';
                h.appendChild(f);
                //}
            }catch (err){}
        }
            iNote.read
//        }
    })(window, document, 'iread_note_css', 'iread_note_js', 'iread_note_swfobjectjs', 'iread_note_json2');
}

