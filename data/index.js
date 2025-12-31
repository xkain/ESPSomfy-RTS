// --- CONFIGURATION GLOBALE ---

////////////var hst = '192.168.1.208';
var hst = '192.168.1.152';
//var hst = '192.168.1.159';
var _rooms = [];
let LANG = {};

// 1. Fonction de traduction globale (pour le JS)
window.tr = function(id) {
    return (LANG && LANG[id]) ? LANG[id] : id;
};

// 2. Traducteur automatique (pour le HTML dynamique)
const translator = {
    translate(el) {
        if (!el || !el.dataset.txt) return;
        const key = el.dataset.txt;
        const text = tr(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    },
    init() {
        // Traduit l'existant
        document.querySelectorAll('[data-txt]').forEach(el => this.translate(el));
        // Surveille le futur (MutationObserver)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(m => m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.dataset.txt) this.translate(node);
                    node.querySelectorAll('[data-txt]').forEach(el => this.translate(el));
                }
            }));
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// 3. Chargeur de langue sécurisé
function loadLang(callback) {
    fetch('/lang')
    .then(r => r.json())
    .then(dict => {
        LANG = dict;
        translator.init();
        if(callback) callback();
    })
    .catch(err => {
        console.error("Erreur langue, mode secours activé");
        LANG = { "BT_LOGIN": "Login", "LBL_HOME": "Maison" }; // Secours minimal
        translator.init();
        if(callback) callback();
    });
}








// --- FREQ STEP ---
function setFreqStep(stepValue) {
    const slider = document.getElementById("slidFrequency");
    if (!slider) return;

    slider.step = stepValue;

    document.querySelectorAll("#stepButtons .step-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`#stepButtons .step-btn[onclick="setFreqStep(${stepValue})"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

// --- RX BANDWIDTH STEP ---
function setRxBandwidthStep(stepValue) {
    const slider = document.getElementById("slidRxBandwidth");
    if (!slider) return;

    slider.step = stepValue;

    document.querySelectorAll("#stepButtonsRx .step-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`#stepButtonsRx .step-btn[onclick="setRxBandwidthStep(${stepValue})"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

// --- DEVIATION STEP ---
function setDeviationStep(stepValue) {
    const slider = document.getElementById("slidDeviation");
    if (!slider) return;

    slider.step = stepValue;

    document.querySelectorAll("#stepButtonsDeviation .step-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`#stepButtonsDeviation .step-btn[onclick="setDeviationStep(${stepValue})"]`);
    if (activeBtn) activeBtn.classList.add("active");
}

// --- INITIALISATION AU CHARGEMENT ---
document.addEventListener("DOMContentLoaded", () => {
    setFreqStep(1);            // bouton "1" actif par défaut
    setRxBandwidthStep(1);   // bouton actif par défaut exemple
    setDeviationStep(1);     // bouton actif par défaut exemple
});





document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const savedTheme = localStorage.getItem("theme") || "light";

    document.body.classList.remove("dark", "light");
    document.body.classList.add(savedTheme);

    toggle.checked = savedTheme === "dark";

    toggle.addEventListener("change", () => {
        const newTheme = toggle.checked ? "dark" : "light";

        document.body.classList.remove("dark", "light");
        document.body.classList.add(newTheme);

        localStorage.setItem("theme", newTheme);
    });
});






// --- INITIALISATION UNIQUE ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Gestion du Thème
    const toggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.add(savedTheme);
    if (toggle) {
        toggle.checked = savedTheme === "dark";
        toggle.addEventListener("change", () => {
            const newTheme = toggle.checked ? "dark" : "light";
            document.body.classList.remove("dark", "light");
            document.body.classList.add(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // 2. Gestion du sélecteur de langue (UI uniquement)
    const langSelect = document.getElementById("langSelect");
    if (langSelect) {
        langSelect.addEventListener("change", (e) => {
            const newLang = e.target.value;
            fetch("/setLang?lang=" + newLang)
            .then(r => r.json())
            .then(resp => {
                if(resp.status === "ok") loadLang(); // Recharge le dictionnaire JSON
            });
        });
    }
});



var errors = [
    { code: -10, desc: "Pin setting in use for Transceiver.  Output pins cannot be re-used." },
    { code: -11, desc: "Pin setting in use for Ethernet Adapter.  Output pins cannot be re-used." },
    { code: -12, desc: "Pin setting in use on another motor.  Output pins cannot be re-used." },
    { code: -21, desc: "Git Update: Flash write failed." },
    { code: -22, desc: "Git Update: Flash erase failed." },
    { code: -23, desc: "Git Update: Flash read failed." },
    { code: -24, desc: "Git Update: Not enough space." },
    { code: -25, desc: "Git Update: Invalid file size given." },
    { code: -26, desc: "Git Update: Stream read timeout." },
    { code: -27, desc: "Git Update: MD5 check failed." },
    { code: -28, desc: "Git Update: Wrong Magic Byte." },
    { code: -29, desc: "Git Update: Could not activate firmware." },
    { code: -30, desc: "Git Update: Partition could not be found." },
    { code: -31, desc: "Git Update: Bad Argument." },
    { code: -32, desc: "Git Update: Aborted." },
    { code: -40, desc: "Git Download: Http Error." },
    { code: -41, desc: "Git Download: Buffer Allocation Error." },
    { code: -42, desc: "Git Download: Download Connection Error." },
    { code: -43, desc: 'Git Download: Timeout Error.' }
]
document.oncontextmenu = (event) => {
    if (event.target && event.target.tagName.toLowerCase() === 'input' && (event.target.type.toLowerCase() === 'text' || event.target.type.toLowerCase() === 'password'))
        return;
    else {
        event.preventDefault(); event.stopPropagation(); return false;
    }
};
Date.prototype.toJSON = function () {
    let tz = this.getTimezoneOffset();
    let sign = tz > 0 ? '-' : '+';
    let tzHrs = Math.floor(Math.abs(tz) / 60).fmt('00');
    let tzMin = (Math.abs(tz) % 60).fmt('00');
    return `${this.getFullYear()}-${(this.getMonth() + 1).fmt('00')}-${this.getDate().fmt('00')}T${this.getHours().fmt('00')}:${this.getMinutes().fmt('00')}:${this.getSeconds().fmt('00')}.${this.getMilliseconds().fmt('000')}${sign}${tzHrs}${tzMin}`;
};
Date.prototype.fmt = function (fmtMask, emptyMask) {
    if (fmtMask.match(/[hHmt]/g) !== null) { if (this.isDateTimeEmpty()) return typeof emptyMask !== 'undefined' ? emptyMask : ''; }
    if (fmtMask.match(/[Mdy]/g) !== null) { if (this.isDateEmpty()) return typeof emptyMask !== 'undefined' ? emptyMask : ''; }
    let formatted = typeof fmtMask !== 'undefined' && fmtMask !== null ? fmtMask : 'MM-dd-yyyy HH:mm:ss';
    let letters = 'dMyHhmst'.split('');
    let temp = [];
    let count = 0;
    let regexA;
    let regexB = /\[(\d+)\]/;
    let year = this.getFullYear().toString();
    let formats = {
        d: this.getDate().toString(),
        dd: this.getDate().toString().padStart(2, '00'),
        ddd: this.getDay() >= 0 ? formatType.DAYS[this.getDay()].substring(0, 3) : '',
        dddd: this.getDay() >= 0 ? formatType.DAYS[this.getDay()] : '',
        M: (this.getMonth() + 1).toString(),
        MM: (this.getMonth() + 1).toString().padStart(2, '00'),
        MMM: this.getMonth() >= 0 ? formatType.MONTHS[this.getMonth()].substring(0, 3) : '',
        MMMM: this.getMonth() >= 0 ? formatType.MONTHS[this.getMonth()] : '',
        y: year.charAt(2) === '0' ? year.charAt(4) : year.substring(2, 4),
        yy: year.substring(2, 4),
        yyyy: year,
        H: this.getHours().toString(),
        HH: this.getHours().toString().padStart(2, '00'),
        h: this.getHours() === 0 ? '12' : this.getHours() > 12 ? Math.abs(this.getHours() - 12).toString() : this.getHours().toString(),
        hh: this.getHours() === 0 ? '12' : this.getHours() > 12 ? Math.abs(this.getHours() - 12).toString().padStart(2, '00') : this.getHours().toString().padStart(2, '00'),
        m: this.getMinutes().toString(),
        mm: this.getMinutes().toString().padStart(2, '00'),
        s: this.getSeconds().toString(),
        ss: this.getSeconds().toString().padStart(2, '00'),
        t: this.getHours() < 12 || this.getHours() === 24 ? 'a' : 'p',
        tt: this.getHours() < 12 || this.getHours() === 24 ? 'am' : 'pm'
    };
    for (let i = 0; i < letters.length; i++) {
        regexA = new RegExp('(' + letters[i] + '+)');
        while (regexA.test(formatted)) {
            temp[count] = RegExp.$1;
            formatted = formatted.replace(RegExp.$1, '[' + count + ']');
            count++;
        }
    }
    while (regexB.test(formatted))
        formatted = formatted.replace(regexB, formats[temp[RegExp.$1]]);
    //console.log({ formatted: formatted, fmtMask: fmtMask });
    return formatted;
};
Number.prototype.round = function (dec) { return Number(Math.round(this + 'e' + dec) + 'e-' + dec); };
Number.prototype.fmt = function (format, empty) {
    if (isNaN(this)) return empty || '';
    if (typeof format === 'undefined') return this.toString();
    let isNegative = this < 0;
    let tok = ['#', '0'];
    let pfx = '', sfx = '', fmt = format.replace(/[^#\.0\,]/g, '');
    let dec = fmt.lastIndexOf('.') > 0 ? fmt.length - (fmt.lastIndexOf('.') + 1) : 0,
        fw = '', fd = '', vw = '', vd = '', rw = '', rd = '';
    let val = String(Math.abs(this).round(dec));
    let ret = '', commaChar = ',', decChar = '.';
    for (var i = 0; i < format.length; i++) {
        let c = format.charAt(i);
        if (c === '#' || c === '0' || c === '.' || c === ',')
            break;
        pfx += c;
    }
    for (let i = format.length - 1; i >= 0; i--) {
        let c = format.charAt(i);
        if (c === '#' || c === '0' || c === '.' || c === ',')
            break;
        sfx = c + sfx;
    }
    if (dec > 0) {
        let dp = val.lastIndexOf('.');
        if (dp === -1) {
            val += '.'; dp = 0;
        }
        else
            dp = val.length - (dp + 1);
        while (dp < dec) {
            val += '0';
            dp++;
        }
        fw = fmt.substring(0, fmt.lastIndexOf('.'));
        fd = fmt.substring(fmt.lastIndexOf('.') + 1);
        vw = val.substring(0, val.lastIndexOf('.'));
        vd = val.substring(val.lastIndexOf('.') + 1);
        let ds = val.substring(val.lastIndexOf('.'), val.length);
        for (let i = 0; i < fd.length; i++) {
            if (fd.charAt(i) === '#' && vd.charAt(i) !== '0') {
                rd += vd.charAt(i);
                continue;
            } else if (fd.charAt(i) === '#' && vd.charAt(i) === '0') {
                var np = vd.substring(i);
                if (np.match('[1-9]')) {
                    rd += vd.charAt(i);
                    continue;
                }
                else
                    break;
            }
            else if (fd.charAt(i) === '0' || fd.charAt(i) === '#')
                rd += vd.charAt(i);
        }
        if (rd.length > 0) rd = decChar + rd;
    }
    else {
        fw = fmt;
        vw = val;
    }
    var cg = fw.lastIndexOf(',') >= 0 ? fw.length - fw.lastIndexOf(',') - 1 : 0;
    var nw = Math.abs(Math.floor(this.round(dec)));
    if (!(nw === 0 && fw.substr(fw.length - 1) === '#') || fw.substr(fw.length - 1) === '0') {
        var gc = 0;
        for (let i = vw.length - 1; i >= 0; i--) {
            rw = vw.charAt(i) + rw;
            gc++;
            if (gc === cg && i !== 0) {
                rw = commaChar + rw;
                gc = 0;
            }
        }
        if (fw.length > rw.length) {
            var pstart = fw.indexOf('0');
            if (pstart >= 0) {
                var plen = fw.length - pstart;
                var pos = fw.length - rw.length - 1;
                while (rw.length < plen) {
                    let pc = fw.charAt(pos);
                    if (pc === ',') pc = commaChar;
                    rw = pc + rw;
                    pos--;
                }
            }
        }
    }
    if (isNegative) rw = '-' + rw;
    if (rd.length === 0 && rw.length === 0) return '';
    return pfx + rw + rd + sfx;
};
var baseUrl = window.location.protocol === 'file:' ? `http://${hst}` : '';
//var baseUrl = '';
function makeBool(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'undefined') return false;
    if (typeof val === 'number') return val >= 1;
    if (typeof val === 'string') {
        if (val === '') return false;
        switch (val.toLowerCase().trim()) {
            case 'on':
            case 'true':
            case 'yes':
            case 'y':
                return true;
            case 'off':
            case 'false':
            case 'no':
            case 'n':
                return false;
        }
        if (!isNaN(parseInt(val, 10))) return parseInt(val, 10) >= 1;
    }
    return false;
}
var httpStatusText = {
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Required',
    '413': 'Request Entry Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': 'I\'m a teapot',
    '429': 'Too Many Requests',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
function getJSON(url, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ get: url });
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(xhr.response, null);
        }
        else {
            cb(null, xhr.response);
        }
    };
    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send();
}
function getJSONSync(url, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(xhr.response, null);
        }
        else {
            console.log({ get: url, obj:xhr.response });
            cb(null, xhr.response);
        }
        if (typeof overlay !== 'undefined') overlay.remove();
    };

    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
        if (typeof overlay !== 'undefined') overlay.remove();
    };
    xhr.onabort = (evt) => {
        console.log('Aborted');
        if (typeof overlay !== 'undefined') overlay.remove();
    };
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.send();
}
function getText(url, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ get: url });
    xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.responseType = 'text';
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `GET ${url}`;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
        }
        else
            cb(null, xhr.response);
    };
    xhr.onerror = (evt) => {
        let err = {
            htmlError: xhr.status || 500,
            service: `GET ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send();
}
function postJSONSync(url, data, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    try {
        let xhr = new XMLHttpRequest();
        console.log({ post: url, data: data });
        let fd = new FormData();
        for (let name in data) {
            fd.append(name, data[name]);
        }
        xhr.open('POST', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('apikey', security.apiKey);
        xhr.onload = () => {
            let status = xhr.status;
            console.log(xhr);
            if (status !== 200) {
                let err = xhr.response || {};
                err.htmlError = status;
                err.service = `POST ${url}`;
                err.data = data;
                if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                cb(err, null);
            }
            else {
                cb(null, xhr.response);
            }
            overlay.remove();
        };
        xhr.onerror = (evt) => {
            console.log(xhr);
            let err = {
                htmlError: xhr.status || 500,
                service: `POST ${url}`
            };
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
            overlay.remove();
        };
        xhr.send(fd);
    } catch (err) { ui.serviceError(document.getElementById('divContainer'), err); }
}
function putJSON(url, data, cb) {
    let xhr = new XMLHttpRequest();
    console.log({ put: url, data: data });
    xhr.open('PUT', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('apikey', security.apiKey);
    xhr.onload = () => {
        let status = xhr.status;
        if (status !== 200) {
            let err = xhr.response || {};
            err.htmlError = status;
            err.service = `PUT ${url}`;
            err.data = data;
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
        }
        else {
            cb(null, xhr.response);
        }
    };
    xhr.onerror = (evt) => {
        console.log(xhr);
        let err = {
            htmlError: xhr.status || 500,
            service: `PUT ${url}`
        };
        if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
        cb(err, null);
    };
    xhr.send(JSON.stringify(data));
}
function putJSONSync(url, data, cb) {
    let overlay = ui.waitMessage(document.getElementById('divContainer'));
    try {
        let xhr = new XMLHttpRequest();
        console.log({ put: url, data: data });
        //xhr.open('PUT', url, true);
        xhr.open('PUT', baseUrl.length > 0 ? `${baseUrl}${url}` : url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('apikey', security.apiKey);
        xhr.onload = () => {
            let status = xhr.status;
            if (status !== 200) {
                let err = xhr.response || {};
                err.htmlError = status;
                err.service = `PUT ${url}`;
                err.data = data;
                if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                cb(err, null);
            }
            else {
                cb(null, xhr.response);
            }
            overlay.remove();
        };
        xhr.onerror = (evt) => {
            console.log(xhr);
            let err = {
                htmlError: xhr.status || 500,
                service: `PUT ${url}`
            };
            if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
            cb(err, null);
            overlay.remove();
        };
        xhr.send(JSON.stringify(data));
    } catch (err) { ui.serviceError(document.getElementById('divContainer'), err); }
}
var socket;
var tConnect = null;
var sockIsOpen = false;
var connecting = false;
var connects = 0;
var connectFailed = 0;
async function initSockets() {
    if (connecting) return;
    console.log('Connecting to socket...');
    connecting = true;
    if (tConnect) clearTimeout(tConnect);
    tConnect = null;
    let wms = document.getElementsByClassName('socket-wait');
    for (let i = 0; i < wms.length; i++) {
        wms[i].remove();
    }
    ui.waitMessage(document.getElementById('divContainer')).classList.add('socket-wait');
    let host = window.location.protocol === 'file:' ? hst : window.location.hostname;
    try {
        socket = new WebSocket(`ws://${host}:8080/`);
        socket.onmessage = (evt) => {
            if (evt.data.startsWith('42')) {
                let ndx = evt.data.indexOf(',');
                let eventName = evt.data.substring(3, ndx);
                let data = evt.data.substring(ndx + 1, evt.data.length - 1);
                try {
                    var reISO = /^(\d{4}|\+010000)-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
                    var msg = JSON.parse(data, (key, value) => {
                        if (typeof value === 'string') {
                            var a = reISO.exec(value);
                            if (a) return new Date(value);
                            a = reMsAjax.exec(value);
                            if (a) {
                                var b = a[1].split(/[-+,.]/);
                                return new Date(b[0] ? +b[0] : 0 - +b[1]);
                            }
                        }
                        return value;
                    });
                    switch (eventName) {
                        case 'memStatus':
                            firmware.procMemoryStatus(msg);
                            break;
                        case 'updateProgress':
                            firmware.procUpdateProgress(msg);
                            break;
                        case 'fwStatus':
                            firmware.procFwStatus(msg);
                            break;
                        case 'remoteFrame':
                            somfy.procRemoteFrame(msg);
                            break;
                        case 'groupState':
                            somfy.procGroupState(msg);
                            break;
                        case 'shadeState':
                            somfy.procShadeState(msg);
                            break;
                        case 'shadeCommand':
                            console.log(msg);
                            break;
                        case 'roomRemoved':
                            somfy.procRoomRemoved(msg);
                            break;
                        case 'roomAdded':
                            somfy.procRoomAdded(msg);
                            break;
                        case 'shadeRemoved':
                            break;
                        case 'shadeAdded':
                            break;
                        case 'ethernet':
                            wifi.procEthernet(msg);
                            break;
                        case 'wifiStrength':
                            wifi.procWifiStrength(msg);
                            break;
                        case 'packetPulses':
                            console.log(msg);
                            break;
                        case 'frequencyScan':
                            somfy.procFrequencyScan(msg);
                            break;

                    }
                } catch (err) {
                    console.log({ eventName: eventName, data: data, err: err });
                }
            }
        };
        socket.onopen = (evt) => {
            if (tConnect) clearTimeout(tConnect);
            tConnect = null;
            console.log({ msg: 'open', evt: evt });
            sockIsOpen = true;
            connecting = false;
            connects++;
            connectFailed = 0;
            let wms = document.getElementsByClassName('socket-wait');
            for (let i = 0; i < wms.length; i++) {
                wms[i].remove();
            }
            let errs = document.getElementsByClassName('socket-error');
            for (let i = 0; i < errs.length; i++)
                errs[i].remove();
            if (general.reloadApp) {
                general.reload();
            }
            else {
                (async () => {
                    ui.clearErrors();
                    await general.loadGeneral();
                    await wifi.loadNetwork();
                    await somfy.loadSomfy();
                    await mqtt.loadMQTT();
                    if (ui.isConfigOpen()) socket.send('join:0');

                    //await general.init();
                    //await somfy.init();
                    //await mqtt.init();
                    //await wifi.init();
                })();
            }
        };
        socket.onclose = (evt) => {
            wifi.procWifiStrength({ ssid: '', channel: -1, strength: -100 });
            wifi.procEthernet({ connected: false, speed: 0, fullduplex: false });
            if (document.getElementsByClassName('socket-wait').length === 0)
                ui.waitMessage(document.getElementById('divContainer')).classList.add('socket-wait');
            if (evt.wasClean) {
                console.log({ msg: 'close-clean', evt: evt });
                connectFailed = 0;
                tConnect = setTimeout(async () => { await reopenSocket(); }, 7000);
                console.log('Reconnecting socket in 7 seconds');
            }
            else {
                console.log({ msg: 'close-died', reason: evt.reason, evt: evt, sock: socket });
                if (connects > 0) {
                    console.log('Reconnecting socket in 3 seconds');
                    tConnect = setTimeout(async () => { await reopenSocket(); }, 3000);
                }
                else {
                    if (connecting) {
                        connectFailed++;
                        let timeout = Math.min(connectFailed * 500, 10000);
                        console.log(`Initial socket did not connect try again (server was busy and timed out ${connectFailed} times)`);
                        tConnect = setTimeout(async () => { await reopenSocket(); }, timeout);
                        if (connectFailed === 5) {
                            ui.socketError('Too many clients connected.  A maximum of 5 clients may be connected at any one time.  Close some connections to the ESP Somfy RTS device to proceed.');
                        }
                        let spanAttempts = document.getElementById('spanSocketAttempts');
                        if (spanAttempts) spanAttempts.innerHTML = connectFailed.fmt("#,##0");

                    }
                    else {
                        console.log('Connecting socket in .5 seconds');
                        tConnect = setTimeout(async () => { await reopenSocket(); }, 500);
                    }

                }

            }
            connecting = false;
        };
        socket.onerror = (evt) => {
            console.log({ msg: 'socket error', evt: evt, sock: socket });
        };
    } catch (err) {
        console.log({
            msg: 'Websocket connection error', err: err
        });
        tConnect = setTimeout(async () => { await reopenSocket(); }, 5000);
    }
}
async function reopenSocket() {
    if (tConnect) clearTimeout(tConnect);
    tConnect = null;
    await initSockets();
}
async function init() {
    await security.init();
    general.init();
    wifi.init();
    somfy.init();
    mqtt.init();
    firmware.init();
}
class UIBinder {
    setValue(el, val) {
        if (el instanceof HTMLInputElement) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    el.checked = makeBool(val);
                    break;
                case 'range':
                    let dt = el.getAttribute('data-datatype');
                    let mult = parseInt(el.getAttribute('data-mult') || 1, 10);
                    switch (dt) {
                        // We always range with integers
                        case 'float':
                            el.value = Math.round(parseInt(val * mult, 10));
                            break;
                        case 'index':
                            let ivals = JSON.parse(el.getAttribute('data-values'));
                            for (let i = 0; i < ivals.length; i++) {
                                if (ivals[i].toString() === val.toString()) {
                                    el.value = i;
                                    break;
                                }
                            }
                            break;
                        default:
                            el.value = parseInt(val, 10) * mult;
                            break;
                    }
                    break;
                default:
                    el.value = val;
                    break;
            }
        }
        else if (el instanceof HTMLSelectElement) {
            let ndx = 0;
            for (let i = 0; i < el.options.length; i++) {
                let opt = el.options[i];
                if (opt.value === val.toString()) {
                    ndx = i;
                    break;
                }
            }
            el.selectedIndex = ndx;
        }
        else if (el instanceof HTMLElement) el.innerHTML = val;
    }
    getValue(el, defVal) {
        let val = defVal;
        if (el instanceof HTMLInputElement) {
            switch (el.type.toLowerCase()) {
                case 'checkbox':
                    val = el.checked;
                    break;
                case 'range':
                    let dt = el.getAttribute('data-datatype');
                    let mult = parseInt(el.getAttribute('data-mult') || 1, 10);
                    switch (dt) {
                        // We always range with integers
                        case 'float':
                            val = parseInt(el.value, 10) / mult;
                            break;
                        case 'index':
                            let ivals = JSON.parse(el.getAttribute('data-values'));
                            val = ivals[parseInt(el.value, 10)];
                            break;
                        default:
                            val = parseInt(el.value / mult, 10);
                            break;
                    }
                    break;
                default:
                    val = el.value;
                    break;
            }
        }
        else if (el instanceof HTMLSelectElement) val = el.value;
        else if (el instanceof HTMLElement) val = el.innerHTML;
        return val;
    }
    toElement(el, val) {
        let flds = el.querySelectorAll('*[data-bind]');
        flds.forEach((fld) => {
            let prop = fld.getAttribute('data-bind');
            let arr = prop.split('.');
            let tval = val;
            for (let i = 0; i < arr.length; i++) {
                var s = arr[i];
                if (typeof s === 'undefined' || !s) continue;
                let ndx = s.indexOf('[');
                if (ndx !== -1) {
                    ndx = parseInt(s.substring(ndx + 1, s.indexOf(']') - 1), 10);
                    s = s.substring(0, ndx - 1);
                }
                tval = tval[s];
                if (typeof tval === 'undefined') break;
                if (ndx >= 0) tval = tval[ndx];
            }
            if (typeof tval !== 'undefined') {
                if (typeof fld.val === 'function') this.val(tval);
                else {
                    switch (fld.getAttribute('data-fmttype')) {
                        case 'time':
                            {
                                var dt = new Date();
                                dt.setHours(0, 0, 0);
                                dt.addMinutes(tval);
                                tval = dt.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            }
                            break;
                        case 'date':
                        case 'datetime':
                            {
                                let dt = new Date(tval);
                                tval = dt.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            }
                            break;
                        case 'number':
                            if (typeof tval !== 'number') tval = parseFloat(tval);
                            tval = tval.fmt(fld.getAttribute('data-fmtmask'), fld.getAttribute('data-fmtempty') || '');
                            break;
                        case 'duration':
                            tval = ui.formatDuration(tval, $this.attr('data-fmtmask'));
                            break;
                    }
                    this.setValue(fld, tval);
                }
            }
        });
    }
    fromElement(el, obj, arrayRef) {
        if (typeof arrayRef === 'undefined' || arrayRef === null) arrayRef = [];
        if (typeof obj === 'undefined' || obj === null) obj = {};
        if (typeof el.getAttribute('data-bind') !== 'undefined') this._bindValue(obj, el, this.getValue(el), arrayRef);
        let flds = el.querySelectorAll('*[data-bind]');
        flds.forEach((fld) => {
            if (!makeBool(fld.getAttribute('data-setonly')))
                this._bindValue(obj, fld, this.getValue(fld), arrayRef);
        });
        return obj;
    }
    parseNumber(val) {
        if (val === null) return;
        if (typeof val === 'undefined') return val;
        if (typeof val === 'number') return val;
        if (typeof val.getMonth === 'function') return val.getTime();
        var tval = val.replace(/[^0-9\.\-]+/g, '');
        return tval.indexOf('.') !== -1 ? parseFloat(tval) : parseInt(tval, 10);
    }
    _bindValue(obj, el, val, arrayRef) {
        var binding = el.getAttribute('data-bind');
        var dataType = el.getAttribute('data-datatype');
        if (binding && binding.length > 0) {
            var sRef = '';
            var arr = binding.split('.');
            var t = obj;
            for (var i = 0; i < arr.length - 1; i++) {
                let s = arr[i];
                if (typeof s === 'undefined' || s.length === 0) continue;
                sRef += '.' + s;
                var ndx = s.lastIndexOf('[');
                if (ndx !== -1) {
                    var v = s.substring(0, ndx);
                    var ndxEnd = s.lastIndexOf(']');
                    var ord = parseInt(s.substring(ndx + 1, ndxEnd), 10);
                    if (isNaN(ord)) ord = 0;
                    if (typeof arrayRef[sRef] === 'undefined') {
                        if (typeof t[v] === 'undefined') {
                            t[v] = new Array();
                            t[v].push(new Object());
                            t = t[v][0];
                            arrayRef[sRef] = ord;
                        }
                        else {
                            k = arrayRef[sRef];
                            if (typeof k === 'undefined') {
                                a = t[v];
                                k = a.length;
                                arrayRef[sRef] = k;
                                a.push(new Object());
                                t = a[k];
                            }
                            else
                                t = t[v][k];
                        }
                    }
                    else {
                        k = arrayRef[sRef];
                        if (typeof k === 'undefined') {
                            a = t[v];
                            k = a.length;
                            arrayRef[sRef] = k;
                            a.push(new Object());
                            t = a[k];
                        }
                        else
                            t = t[v][k];
                    }
                }
                else if (typeof t[s] === 'undefined') {
                    t[s] = new Object();
                    t = t[s];
                }
                else
                    t = t[s];
            }
            if (typeof dataType === 'undefined') dataType = 'string';
            t[arr[arr.length - 1]] = this.parseValue(val, dataType);
        }
    }
    parseValue(val, dataType) {
        switch (dataType) {
            case 'int':
                return Math.floor(this.parseNumber(val));
            case 'uint':
                return Math.abs(this.parseNumber(val));
            case 'float':
            case 'real':
            case 'double':
            case 'decimal':
            case 'number':
                return this.parseNumber(val);
            case 'date':
                if (typeof val === 'string') return Date.parseISO(val);
                else if (typeof val === 'number') return new Date(number);
                else if (typeof val.getMonth === 'function') return val;
                return undefined;
            case 'time':
                var dt = new Date();
                if (typeof val === 'number') {
                    dt.setHours(0, 0, 0);
                    dt.addMinutes(tval);
                    return dt;
                }
                else if (typeof val === 'string' && val.indexOf(':') !== -1) {
                    var n = val.lastIndexOf(':');
                    var min = this.parseNumber(val.substring(n));
                    var nsp = val.substring(0, n).lastIndexOf(' ') + 1;
                    var hrs = this.parseNumber(val.substring(nsp, n));
                    dt.setHours(0, 0, 0);
                    if (hrs <= 12 && val.substring(n).indexOf('p')) hrs += 12;
                    dt.addMinutes(hrs * 60 + min);
                    return dt;
                }
                break;
            case 'duration':
                if (typeof val === 'number') return val;
                return Math.floor(this.parseNumber(val));
            default:
                return val;
        }
    }
    formatValue(val, dataType, fmtMask, emptyMask) {
        var v = this.parseValue(val, dataType);
        if (typeof v === 'undefined') return emptyMask || '';
        switch (dataType) {
            case 'int':
            case 'uint':
            case 'float':
            case 'real':
            case 'double':
            case 'decimal':
            case 'number':
                return v.fmt(fmtMask, emptyMask || '');
            case 'time':
            case 'date':
            case 'dateTime':
                return v.fmt(fmtMask, emptyMask || '');
        }
        return v;
    }
    waitMessage(el) {
        let div = document.createElement('div');
        div.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
        div.classList.add('wait-overlay');
        if (typeof el === 'undefined') el = document.getElementById('divContainer');
        el.appendChild(div);
        return div;
    }
    serviceError(el, err) {
        let title = 'Service Error'
        if (arguments.length === 1) {
            err = el;
            el = document.getElementById('divContainer');
        }
        let msg = '';
        if (typeof err === 'string' && err.startsWith('{')) {
            let e = JSON.parse(err);
            if (typeof e !== 'undefined' && typeof e.desc === 'string') msg = e.desc;
            else msg = err;
        }
        else if (typeof err === 'string') msg = err;
        else if (typeof err === 'number') {
            switch (err) {
                case 404:
                    msg = `404: Service not found`;
                    break;
                default:
                    msg = `${err}: Service Error`;
                    break;
            }
        }
        else if (typeof err !== 'undefined') {
            if (typeof err.desc === 'string') {
                msg = typeof err.desc !== 'undefined' ? err.desc : err.message;
                if (typeof err.code === 'number') {
                    let e = errors.find(x => x.code === err.code) || { code: err.code, desc: 'Unspecified error' };
                    msg = e.desc;
                    title = err.desc;
                }
            }
        }
        console.log(err);
        let div = this.errorMessage(`${err.htmlError || 500}:${title}`);
        let sub = div.querySelector('.sub-message');
        sub.innerHTML = `<div><label>Service:</label>${err.service}</div><div style="font-size:22px;">${msg}</div>`;
        return div;
    }



    socketError(el, msg) {
        if (arguments.length === 1) {
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = `<div id="divSocketAttempts" style="position:absolute;width:100%;left:0px;padding-right:24px;text-align:right;top:0px;font-size:18px;"><span>${tr('SOCKET_ATTEMPTS')}</span><span id="spanSocketAttempts"></span></div><div class="inner-error"><div>>${tr('ERR_SOCKET_CONNECT')}</div><hr><div style="font-size:.7em">${msg}</div></div>`;
        div.classList.add('error-message');
        div.classList.add('socket-error');
        div.classList.add('message-overlay');
        el.appendChild(div);

        return div;
    }




    errorMessage(el, msg) {
        if (arguments.length === 1) {
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = `<div class="inner-error">${msg}</div><div class="sub-message"></div><button class="bouton" type="button" onclick="ui.clearErrors();">${tr('BT_CLOSE')}</button></div>`;
        div.classList.add('error-message');
        div.classList.add('message-overlay');
        el.appendChild(div);

        return div;
    }
    promptMessage(el, msg, onYes) {
        if (arguments.length === 2) {
            onYes = msg;
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = `<div class="prompt-text">${msg}</div><div class="sub-message"></div><div class="button-container"><button id="btnYes" class="bouton" type="button">${tr('BT_YES')}</button><button class="boutonOutline" type="button" onclick="ui.clearErrors();">${tr('BT_NO')}</button></div></div>`;
        div.classList.add('prompt-message');
        div.classList.add('message-overlay');
        el.appendChild(div);

        div.querySelector('#btnYes').addEventListener('click', onYes);

        return div;
    }
    infoMessage(el, msg, onOk) {
        if (arguments.length === 1) {
            onOk = msg;
            msg = el;
            el = document.getElementById('divContainer');
        }
        let div = document.createElement('div');
        div.innerHTML = `<div class="info-text">${msg}</div><div class="sub-message"></div><div class="button-container" style="text-align:center;"><button id="btnOk" class="bouton" type="button" style="width:40%;display:inline-block;">${tr('BT_OK')}</button></div></div>`;
        div.classList.add('info-message');
        div.classList.add('message-overlay');
        el.appendChild(div);

        if (typeof onOk === 'function') div.querySelector('#btnOk').addEventListener('click', onOk);
        else div.querySelector('#btnOk').addEventListener('click', (e) => { div.remove() });
        //div.querySelector('#btnYes').addEventListener('click', onYes);
        return div;

    }
    clearErrors() {
        let errors = document.querySelectorAll('div.message-overlay');
        if (errors && errors.length > 0) errors.forEach((el) => { el.remove(); });
    }
    selectTab(elTab) {
        for (let tab of elTab.parentElement.children) {
            if (tab.classList.contains('selected')) tab.classList.remove('selected');
            document.getElementById(tab.getAttribute('data-grpid')).style.display = 'none';
        }
        if (!elTab.classList.contains('selected')) elTab.classList.add('selected');
        document.getElementById(elTab.getAttribute('data-grpid')).style.display = '';
    }
    wizSetPrevStep(el) { this.wizSetStep(el, Math.max(this.wizCurrentStep(el) - 1, 1)); }
    wizSetNextStep(el) { this.wizSetStep(el, this.wizCurrentStep(el) + 1); }
    wizSetStep(el, step) {
        let curr = this.wizCurrentStep(el);
        let max = parseInt(el.getAttribute('data-maxsteps'), 10);
        if (!isNaN(max)) {
            let next = el.querySelector(`#btnNextStep`);
            if (next) next.style.display = max < step ? 'flex' : 'none';
        }
        let prev = el.querySelector(`#btnPrevStep`);
        if (prev) prev.style.display = step <= 1 ? 'none' : 'flex';
        if (curr !== step) {
            el.setAttribute('data-stepid', step);
            let evt = new CustomEvent('stepchanged', { detail: { oldStep: curr, newStep: step }, bubbles: true, cancelable: true, composed: false });
            el.dispatchEvent(evt);
        }
    }
    wizCurrentStep(el) { return parseInt(el.getAttribute('data-stepid') || 1, 10); }
    pinKeyPressed(evt) {
        let parent = evt.srcElement.parentElement;
        let digits = parent.querySelectorAll('.pin-digit');
        switch (evt.key) {
            case 'Backspace':
                setTimeout(() => {
                    // Focus to the previous element.
                    for (let i = 0; i < digits.length; i++) {
                        if (digits[i] === evt.srcElement && i > 0) {
                            digits[i - 1].focus();
                            break;
                        }
                    }
                }, 0);
                return;
            case 'ArrowLeft':
                setTimeout(() => {
                    for (let i = 0; i < digits.length; i++) {
                        if (digits[i] === evt.srcElement && i > 0) {
                            digits[i - 1].focus();
                        }
                    }
                });
                return;
            case 'CapsLock':
            case 'Control':
            case 'Shift':
            case 'Enter':
            case 'Tab':
                return;
            case 'ArrowRight':
                if (evt.srcElement.value !== '') {
                    setTimeout(() => {
                        for (let i = 0; i < digits.length; i++) {
                            if (digits[i] === evt.srcElement && i < digits.length - 1) {
                                digits[i + 1].focus();
                            }
                        }
                    });
                }
                return;
            default:
                if (evt.srcElement.value !== '') evt.srcElement.value = '';
                setTimeout(() => {
                    let e = new CustomEvent('digitentered', { detail: {}, bubbles: true, cancelable: true, composed: false });
                    evt.srcElement.dispatchEvent(e);
                }, 100);
                break;
        }
        setTimeout(() => {
            // Focus to the first empty element.
            for (let i = 0; i < digits.length; i++) {
                if (digits[i].value === '') {
                    if (digits[i] !== evt.srcElement) digits[i].focus();
                    break;
                }
            }
        }, 0);

    }
    pinDigitFocus(evt) {
        // Find the first empty digit and place the cursor there.
        if (evt.srcElement.value !== '') return;
        let parent = evt.srcElement.parentElement;
        let digits = parent.querySelectorAll('.pin-digit');
        for (let i = 0; i < digits.length; i++) {
            if (digits[i].value === '') {
                if (digits[i] !== evt.srcElement) digits[i].focus();
                break;
            }
        }
    }


    isConfigOpen() { return window.getComputedStyle(document.getElementById('divConfigPnl')).display !== 'none'; }

    setConfigPanel() {
        if (this.isConfigOpen()) return;
        let divCfg = document.getElementById('divConfigPnl');
        let divHome = document.getElementById('divHomePnl');
        divHome.style.display = 'none';
        divCfg.style.display = '';
        somfy.checkEmptyState();
        document.querySelector('#btnConfig use').setAttribute('xlink:href', '#svgHome');


        if (sockIsOpen) socket.send('join:0');
        let overlay = ui.waitMessage(document.getElementById('divSecurityOptions'));
        overlay.style.borderRadius = '5px';
        getJSON('/getSecurity', (err, security) => {
            overlay.remove();
            if (err) ui.serviceError(err);
            else {
                console.log(security);
                general.setSecurityConfig(security);
            }
        });
    }

    setHomePanel() {
        if (!this.isConfigOpen()) return;
        let divCfg = document.getElementById('divConfigPnl');
        let divHome = document.getElementById('divHomePnl');
        divHome.style.display = '';
        divCfg.style.display = 'none';
        somfy.checkEmptyState();
        // Remplacement de .className par la mise à jour du xlink:href
        document.querySelector('#btnConfig use').setAttribute('xlink:href', '#svgSettings');

        if (sockIsOpen) socket.send('leave:0');
        general.setSecurityConfig({ type: 0, username: '', password: '', pin: '', permissions: 0 });
    }

    toggleConfig() {
        if (this.isConfigOpen())
            this.setHomePanel();
        else {
            if (!security.authenticated && security.type !== 0) {
                document.getElementById('divContainer').addEventListener('afterlogin', (evt) => {
                    if (security.authenticated) this.setConfigPanel();
                }, { once: true });
                    security.authUser();
            }
            else this.setConfigPanel();
        }
        somfy.showEditShade(false);
        somfy.showEditGroup(false);
    }
/*


    isConfigOpen() { return window.getComputedStyle(document.getElementById('divConfigPnl')).display !== 'none'; }
    setConfigPanel() {
        if (this.isConfigOpen()) return;
        const divCfg = document.getElementById('divConfigPnl');
        const divHome = document.getElementById('divHomePnl');

        if (divHome) divHome.style.display = 'none';
        if (divCfg) divCfg.style.display = '';

        // Utilisation de querySelector pour cibler le <use> à l'intérieur du bouton
        const btnUse = document.querySelector('#btnConfig use');
        if (btnUse) {
            // ON NE TOUCHE PAS à .className, on utilise uniquement setAttribute
            btnUse.setAttribute('xlink:href', '#svgHome');
        }

        if (sockIsOpen) socket.send('join:0');

        const target = document.getElementById('divSecurityOptions');
        if (target) {
            let overlay = ui.waitMessage(target);
            overlay.style.borderRadius = '5px';
            getJSON('/getSecurity', (err, security) => {
                if (overlay) overlay.remove();
                if (err) ui.serviceError(err);
                else {
                    // Remplacer console.log(security) par ceci pour débugger sans clonage :
                    console.log("Security loaded:", JSON.parse(JSON.stringify(security)));
                    general.setSecurityConfig(security);
                }
            });
        }
    }

    setHomePanel() {
        if (!this.isConfigOpen()) return;

        const divCfg = document.getElementById('divConfigPnl');
        const divHome = document.getElementById('divHomePnl');
        const divEmpty = document.getElementById('divEmptyHome');

        if (divCfg) divCfg.style.display = 'none';

        const btnUse = document.querySelector('#btnConfig use');
        if (btnUse) {
            btnUse.setAttribute('xlink:href', '#svgSettings');
        }

        // On utilise les variables globales pour éviter de recalculer sur le DOM
        const hasShades = typeof somfy !== 'undefined' && somfy.shades && somfy.shades.length > 0;
        const hasRooms = typeof _rooms !== 'undefined' && _rooms.length > 1;

        if (divHome) divHome.style.display = '';

        if (divEmpty) {
            // On gère l'affichage du bloc d'aide
            divEmpty.style.display = (!hasShades && !hasRooms) ? 'flex' : 'none';
        }

        if (sockIsOpen) socket.send('leave:0');
    }


    startConfiguration() {
        // 1. On prépare le terrain (nettoyage de la classe et de l'accueil)
        const container = document.getElementById('divContainer');
        if (container) container.classList.remove('is-empty');

        const divGetStarted = document.getElementById('divGetStarted');
        if (divGetStarted) divGetStarted.style.display = 'none';

        // 2. On affiche le conteneur parent pour être sûr que tout est visible
        const divAuth = document.getElementById('divAuthenticated');
        if (divAuth) divAuth.style.display = 'block';

        // 3. On force l'ouverture du panneau de config (comme le fait toggleConfig)
        // sans demander de mot de passe cette fois-ci
        this.setConfigPanel();

        // 4. On s'assure que les overlays de somfy sont fermés (copié de toggleConfig)
        if (typeof somfy !== 'undefined') {
            somfy.showEditShade(false);
            somfy.showEditGroup(false);
        }
    }


    showShadeConfig() {
        // 1. On ouvre le panneau de config principal
        this.setConfigPanel();

        // 2. On sélectionne l'onglet parent "Somfy"
        const parentTab = document.querySelector('.tab-container [data-grpid="divSomfySettings"]');
        if (parentTab) {
            this.selectTab(parentTab);
        }

        // 3. On sélectionne le sous-onglet "Shades" (Motors)
        // L'auteur utilise souvent la même fonction selectTab pour les sous-onglets
        const motorTab = document.querySelector('.subtab-container [data-grpid="divSomfyMotors"]');
        if (motorTab) {
            this.selectTab(motorTab);
        }

        // 4. On ouvre le formulaire d'ajout
        if (typeof somfy !== 'undefined' && typeof somfy.openEditShade === 'function') {
            somfy.openEditShade();
        }
    }

    showRoomConfig() {
        this.setConfigPanel();

        const parentTab = document.querySelector('.tab-container [data-grpid="divSomfySettings"]');
        if (parentTab) {
            this.selectTab(parentTab);
        }

        // Pour les pièces, on cherche l'onglet Rooms
        const roomTab = document.querySelector('.subtab-container [data-grpid="divSomfyRooms"]');
        if (roomTab) {
            this.selectTab(roomTab);
        }

        if (typeof somfy !== 'undefined' && typeof somfy.openEditRoom === 'function') {
            somfy.openEditRoom();
        }
    }

    //
  //  setHomePanel() {
    //    if (!this.isConfigOpen()) return;
      //  let divCfg = document.getElementById('divConfigPnl');
        //let divHome = document.getElementById('divHomePnl');
        //divHome.style.display = '';
        //divCfg.style.display = 'none';
        //document.getElementById('icoConfig').className = 'icss-gear';
        //if (sockIsOpen) socket.send('leave:0');
        //general.setSecurityConfig({ type: 0, username: '', password: '', pin: '', permissions: 0 });
    //}

    //
    toggleConfig() {
        if (this.isConfigOpen())
            this.setHomePanel();
        else {
            if (!security.authenticated && security.type !== 0) {
                document.getElementById('divContainer').addEventListener('afterlogin', (evt) => {
                    if (security.authenticated) this.setConfigPanel();
                }, { once: true });
                security.authUser();
            }
            else this.setConfigPanel();
        }
        somfy.showEditShade(false);
        somfy.showEditGroup(false);
    }

    */


}
var ui = new UIBinder();

class Security {
    type = 0;
    authenticated = false;
    apiKey = '';
    permissions = 0;
    async init() {
        let fld = document.getElementById('divUnauthenticated').querySelector('.pin-digit[data-bind="security.pin.d0"]');
        document.getElementById('divUnauthenticated').querySelector('.pin-digit[data-bind="login.pin.d3"]').addEventListener('digitentered', (evt) => {
            security.login();
        });
        await this.loadContext();
        if (this.type === 0 || (this.permissions & 0x01) === 0x01) { // No login required or only the config is protected.
            if (typeof socket === 'undefined' || !socket) (async () => { await initSockets(); })();
            //ui.setMode(mode);
            document.getElementById('divUnauthenticated').style.display = 'none';
            document.getElementById('divAuthenticated').style.display = '';
            document.getElementById('divContainer').setAttribute('data-auth', true);
        }
    }
    async loadContext() {
        let pnl = document.getElementById('divUnauthenticated');
        if (!pnl) return; // Sécurité si l'élément n'existe pas

        pnl.querySelector('#loginButtons').style.display = 'none';
        pnl.querySelector('#divLoginPassword').style.display = 'none';
        pnl.querySelector('#divLoginPin').style.display = 'none';

        await new Promise((resolve, reject) => {
            // ON CHARGE LA LANGUE AVANT TOUT
            loadLang(() => {
                getJSONSync('/loginContext', (err, ctx) => {
                    pnl.querySelector('#loginButtons').style.display = '';
                    resolve();

                    if (err) {
                        ui.serviceError(err);
                    } else {
                        console.log("Contexte reçu:", ctx);
                        document.getElementById('divContainer').setAttribute('data-securitytype', ctx.type);
                        this.type = ctx.type;
                        this.permissions = ctx.permissions;


                        switch (ctx.type) {
                            case 1:
                                pnl.querySelector('#divLoginPin').style.display = '';
                                pnl.querySelector('#divLoginPassword').style.display = 'none';
                                let pinFld = pnl.querySelector('.pin-digit[data-bind="login.pin.d0"]');
                                if (pinFld) pinFld.focus();
                                break;
                            case 2:
                                pnl.querySelector('#divLoginPassword').style.display = '';
                                pnl.querySelector('#divLoginPin').style.display = 'none';
                                let userFld = pnl.querySelector('#fldLoginUsername');
                                if (userFld) userFld.focus();
                                break;
                        }
                        let typeFld = pnl.querySelector('#fldLoginType');
                        if (typeFld) typeFld.value = ctx.type;
                    }
                });
            });
        });
    }
    authUser() {
        document.getElementById('divAuthenticated').style.display = 'none';
        document.getElementById('divUnauthenticated').style.display = '';
        this.loadContext();
        document.getElementById('btnCancelLogin').style.display = 'inline-block';
    }
    cancelLogin() {
        let evt = new CustomEvent('afterlogin', { detail: { authenticated: this.authenticated } });
        document.getElementById('divAuthenticated').style.display = '';
        document.getElementById('divUnauthenticated').style.display = 'none';
        document.getElementById('divContainer').dispatchEvent(evt);
    }
    login() {
        console.log('Logging in...');
        let pnl = document.getElementById('divUnauthenticated');
        let msg = pnl.querySelector('#spanLoginMessage');
        msg.innerHTML = '';
        let sec = ui.fromElement(pnl).login;
        console.log(sec);
        let pin = '';
        switch (sec.type) {
            case 1:
                for (let i = 0; i < 4; i++) {
                    pin += sec.pin[`d${i}`];
                }
                if (pin.length !== 4) return;
                break;
            case 2:
                break;
        }
        sec.pin = pin;
        putJSONSync('/login', sec, (err, log) => {
            if (err) ui.serviceError(err);
            else {
                console.log(log);
                if (log.success) {
                    if (typeof socket === 'undefined' || !socket) (async () => { await initSockets(); })();
                    //ui.setMode(mode);

                    document.getElementById('divUnauthenticated').style.display = 'none';
                    document.getElementById('divAuthenticated').style.display = '';
                    document.getElementById('divContainer').setAttribute('data-auth', true);
                    this.apiKey = log.apiKey;
                    this.authenticated = true;
                    let evt = new CustomEvent('afterlogin', { detail: { authenticated: true } });
                    document.getElementById('divContainer').dispatchEvent(evt);
                }
                else
                    msg.innerHTML = log.msg;
            }
        });
    }
}


//**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************

var security = new Security();

class General {
    initialized = false;
    appVersion = 'v2.4.7';
    reloadApp = false;
    init() {
        if (this.initialized) return;
        this.setAppVersion();
        this.setTimeZones();
        if (sockIsOpen && ui.isConfigOpen()) socket.send('join:0');
        ui.toElement(document.getElementById('divSystemSettings'), { general: { hostname: 'ESPSomfyRTS', username: '', password: '', posixZone: 'UTC0', ntpServer: 'pool.ntp.org' } });
        this.initialized = true;
    }
    getCookie(cname) {
        let n = cname + '=';
        let cookies = document.cookie.split(';');
        console.log(cookies);
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i];
            while (c.charAt(0) === ' ') c = c.substring(0);
            if (c.indexOf(n) === 0) return c.substring(n.length, c.length);
        }
        return '';
    }
    reload() {
        let addMetaTag = (name, content) => {
            let meta = document.createElement('meta');
            meta.httpEquiv = name;
            meta.content = content;
            document.getElementsByTagName('head')[0].appendChild(meta);
        };
        addMetaTag('pragma', 'no-cache');
        addMetaTag('expires', '0');
        addMetaTag('cache-control', 'no-cache');
        document.location.reload();
    }
    timeZones = [
        { city: 'Africa/Cairo', code: 'EET-2' },
        { city: 'Africa/Johannesburg', code: 'SAST-2' },
        { city: 'Africa/Juba', code: 'CAT-2' },
        { city: 'Africa/Lagos', code: 'WAT-1' },
        { city: 'Africa/Mogadishu', code: 'EAT-3' },
        { city: 'Africa/Tunis', code: 'CET-1' },
        { city: 'America/Adak', code: 'HST10HDT,M3.2.0,M11.1.0' },
        { city: 'America/Anchorage', code: 'AKST9AKDT,M3.2.0,M11.1.0' },
        { city: 'America/Asuncion', code: '<-04>4<-03>,M10.1.0/0,M3.4.0/0' },
        { city: 'America/Bahia_Banderas', code: 'CST6CDT,M4.1.0,M10.5.0' },
        { city: 'America/Barbados', code: 'AST4' },
        { city: 'America/Bermuda', code: 'AST4ADT,M3.2.0,M11.1.0' },
        { city: 'America/Cancun', code: 'EST5' },
        { city: 'America/Central_Time', code: 'CST6CDT,M3.2.0,M11.1.0' },
        { city: 'America/Chihuahua', code: 'MST7MDT,M4.1.0,M10.5.0' },
        { city: 'America/Eastern_Time', code: 'EST5EDT,M3.2.0,M11.1.0' },
        { city: 'America/Godthab', code: '<-03>3<-02>,M3.5.0/-2,M10.5.0/-1' },
        { city: 'America/Havana', code: 'CST5CDT,M3.2.0/0,M11.1.0/1' },
        { city: 'America/Mexico_City', code: 'CST6' },
        { city: 'America/Miquelon', code: '<-03>3<-02>,M3.2.0,M11.1.0' },
        { city: 'America/Mountain_Time', code: 'MST7MDT,M3.2.0,M11.1.0' },
        { city: 'America/Pacific_Time', code: 'PST8PDT,M3.2.0,M11.1.0' },
        { city: 'America/Phoenix', code: 'MST7' },
        { city: 'America/Santiago', code: '<-04>4<-03>,M9.1.6/24,M4.1.6/24' },
        { city: 'America/St_Johns', code: 'NST3:30NDT,M3.2.0,M11.1.0' },
        { city: 'Antarctica/Troll', code: '<+00>0<+02>-2,M3.5.0/1,M10.5.0/3' },
        { city: 'Asia/Amman', code: 'EET-2EEST,M2.5.4/24,M10.5.5/1' },
        { city: 'Asia/Beirut', code: 'EET-2EEST,M3.5.0/0,M10.5.0/0' },
        { city: 'Asia/Colombo', code: '<+0530>-5:30' },
        { city: 'Asia/Damascus', code: 'EET-2EEST,M3.5.5/0,M10.5.5/0' },
        { city: 'Asia/Gaza', code: 'EET-2EEST,M3.4.4/50,M10.4.4/50' },
        { city: 'Asia/Hong_Kong', code: 'HKT-8' },
        { city: 'Asia/Jakarta', code: 'WIB-7' },
        { city: 'Asia/Jayapura', code: 'WIT-9' },
        { city: 'Asia/Jerusalem', code: 'IST-2IDT,M3.4.4/26,M10.5.0' },
        { city: 'Asia/Kabul', code: '<+0430>-4:30' },
        { city: 'Asia/Karachi', code: 'PKT-5' },
        { city: 'Asia/Kathmandu', code: '<+0545>-5:45' },
        { city: 'Asia/Kolkata', code: 'IST-5:30' },
        { city: 'Asia/Makassar', code: 'WITA-8' },
        { city: 'Asia/Manila', code: 'PST-8' },
        { city: 'Asia/Seoul', code: 'KST-9' },
        { city: 'Asia/Shanghai', code: 'CST-8' },
        { city: 'Asia/Tehran', code: '<+0330>-3:30' },
        { city: 'Asia/Tokyo', code: 'JST-9' },
        { city: 'Atlantic/Azores', code: '<-01>1<+00>,M3.5.0/0,M10.5.0/1' },
        { city: 'Australia/Adelaide', code: 'ACST-9:30ACDT,M10.1.0,M4.1.0/3' },
        { city: 'Australia/Brisbane', code: 'AEST-10' },
        { city: 'Australia/Darwin', code: 'ACST-9:30' },
        { city: 'Australia/Eucla', code: '<+0845>-8:45' },
        { city: 'Australia/Lord_Howe', code: '<+1030>-10:30<+11>-11,M10.1.0,M4.1.0' },
        { city: 'Australia/Melbourne', code: 'AEST-10AEDT,M10.1.0,M4.1.0/3' },
        { city: 'Australia/Perth', code: 'AWST-8' },
        { city: 'Etc/GMT-1', code: '<+01>-1' },
        { city: 'Etc/GMT-2', code: '<+02>-2' },
        { city: 'Etc/GMT-3', code: '<+03>-3' },
        { city: 'Etc/GMT-4', code: '<+04>-4' },
        { city: 'Etc/GMT-5', code: '<+05>-5' },
        { city: 'Etc/GMT-6', code: '<+06>-6' },
        { city: 'Etc/GMT-7', code: '<+07>-7' },
        { city: 'Etc/GMT-8', code: '<+08>-8' },
        { city: 'Etc/GMT-9', code: '<+09>-9' },
        { city: 'Etc/GMT-10',code: '<+10>-10' },
        { city: 'Etc/GMT-11', code: '<+11>-11' },
        { city: 'Etc/GMT-12', code: '<+12>-12' },
        { city: 'Etc/GMT-13', code: '<+13>-13' },
        { city: 'Etc/GMT-14', code: '<+14>-14' },
        { city: 'Etc/GMT+0', code: 'GMT0' },
        { city: 'Etc/GMT+1', code: '<-01>1' },
        { city: 'Etc/GMT+2', code: '<-02>2' },
        { city: 'Etc/GMT+3', code: '<-03>3' },
        { city: 'Etc/GMT+4', code: '<-04>4' },
        { city: 'Etc/GMT+5', code: '<-05>5' },
        { city: 'Etc/GMT+6', code: '<-06>6' },
        { city: 'Etc/GMT+7', code: '<-07>7' },
        { city: 'Etc/GMT+8', code: '<-08>8' },
        { city: 'Etc/GMT+9', code: '<-09>9' },
        { city: 'Etc/GMT+10', code: '<-10>10' },
        { city: 'Etc/GMT+11', code: '<-11>11' },
        { city: 'Etc/GMT+12', code: '<-12>12' },
        { city: 'Etc/UTC', code: 'UTC0' },
        { city: 'Europe/Athens', code: 'EET-2EEST,M3.5.0/3,M10.5.0/4' },
        { city: "Europe/Berlin", code: "CEST-1CET,M3.2.0/2:00:00,M11.1.0/2:00:00" },
        { city: 'Europe/Brussels', code: 'CET-1CEST,M3.5.0,M10.5.0/3' },
        { city: 'Europe/Chisinau', code: 'EET-2EEST,M3.5.0,M10.5.0/3' },
        { city: 'Europe/Dublin', code: 'IST-1GMT0,M10.5.0,M3.5.0/1' },
        { city: 'Europe/Lisbon',  code: 'WET0WEST,M3.5.0/1,M10.5.0' },
        { city: 'Europe/London', code: 'GMT0BST,M3.5.0/1,M10.5.0' },
        { city: 'Europe/Moscow', code: 'MSK-3' },
        { city: 'Europe/Paris', code: 'CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00' },
        { city: 'Indian/Cocos',  code: '<+0630>-6:30' },
        { city: 'Pacific/Auckland', code: 'NZST-12NZDT,M9.5.0,M4.1.0/3' },
        { city: 'Pacific/Chatham', code: '<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45' },
        { city: 'Pacific/Easter', code: '<-06>6<-05>,M9.1.6/22,M4.1.6/22' },
        { city: 'Pacific/Fiji', code: '<+12>-12<+13>,M11.2.0,M1.2.3/99' },
        { city: 'Pacific/Guam',  code: 'ChST-10' },
        { city: 'Pacific/Honolulu', code: 'HST10' },
        { city: 'Pacific/Marquesas', code: '<-0930>9:30' },
        { city: 'Pacific/Midway',  code: 'SST11' },
        { city: 'Pacific/Norfolk', code: '<+11>-11<+12>,M10.1.0,M4.1.0/3' }
    ];
    loadGeneral() {
        const pnl = document.getElementById('divSystemOptions');

        getJSONSync('/modulesettings', (err, settings) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Settings reçus:", settings);

            // 1. Initialisation immédiate pour la radio (évite le bug de sauvegarde)
            if (typeof somfy !== 'undefined') somfy.initPins();

            // 2. Charger le dictionnaire de langue
            loadLang(() => {
                // Mise à jour des versions et attributs du container
                document.getElementById('spanFwVersion').innerText = settings.fwVersion;
                document.getElementById('spanHwVersion').innerText = settings.chipModel.length > 0 ? '-' + settings.chipModel : '';
                document.getElementById('divContainer').setAttribute('data-chipmodel', settings.chipModel);

                this.setAppVersion();

                // 3. Remplissage de l'UI (Data-binding)
                ui.toElement(pnl, { general: settings });

                // --- LES DEUX LIGNES À AJOUTER ICI ---
                if (typeof wifi !== 'undefined') wifi.init(); // Initialise le Wifi (et donc le menu Ethernet traduit)

                if (typeof somfy !== 'undefined') somfy.loadSomfy();
                // --- GESTION DE LA LANGUE ---
                const langSelect = document.getElementById('langSelect');
                if (langSelect) {
                    // Définit la valeur initiale (0=fr, 1=en)
                    langSelect.value = (settings.language === 0) ? 'fr' : 'en';

                    // Branchement de l'événement de changement
                    langSelect.onchange = (e) => {
                        this.onLanguageChanged(e.target.value);
                    };
                }

                // --- GESTION DE L'ACCENT COLOR (Temps Réel) ---
                if (settings.accentColor) {
                    // Appliquer la couleur enregistrée immédiatement au chargement
                    document.documentElement.style.setProperty('--accent-color', settings.accentColor);

                    const accentInput = document.getElementById('fldAccentColor');
                    if (accentInput) {
                        accentInput.value = settings.accentColor;

                        // Appliquer la couleur SANS recharger dès que l'utilisateur bouge le curseur
                        accentInput.addEventListener('input', (e) => {
                            document.documentElement.style.setProperty('--accent-color', e.target.value);
                        });
                    }
                }
            });
        });
    }
    loadLogin() {
        getJSONSync('/loginContext', (err, ctx) => {
            if (err) ui.serviceError(err);
            else {
                console.log(ctx);
                let pnl = document.getElementById('divContainer');
                pnl.setAttribute('data-securitytype', ctx.type);
                let fld;
                switch (ctx.type) {
                    case 1:
                        document.getElementById('divPinSecurity').style.display = '';
                        fld = document.getElementById('divPinSecurity').querySelector('.pin-digit[data-bind="security.pin.d0"]');
                        document.getElementById('divPinSecurity').querySelector('.pin-digit[data-bind="security.pin.d3"]').addEventListener('digitentered', (evt) => {
                            general.login();
                        });
                        break;
                    case 2:
                        document.getElementById('divPasswordSecurity').style.display = '';
                        fld = document.getElementById('fldUsername');
                        break;
                }
                if (fld) fld.focus();
            }
        });
    }
    setAppVersion() { document.getElementById('spanAppVersion').innerText = this.appVersion; }
    setTimeZones() {
        let dd = document.getElementById('selTimeZone');
        dd.length = 0;
        let maxLength = 0;
        for (let i = 0; i < this.timeZones.length; i++) {
            let opt = document.createElement('option');
            opt.text = this.timeZones[i].city;
            opt.value = this.timeZones[i].code;
            maxLength = Math.max(maxLength, this.timeZones[i].code.length);
            dd.add(opt);
        }
        dd.value = 'UTC0';
        console.log(`Max TZ:${maxLength}`);
    }
    setGeneral() {
        let valid = true;
        let pnl = document.getElementById('divSystemSettings');
        let obj = ui.fromElement(pnl).general;
        const msg = tr('ERR_HOSTNAME');
        if (typeof obj.hostname === 'undefined' || !obj.hostname || obj.hostname === '') {
            ui.errorMessage(msg).querySelector('.sub-message').innerHTML = tr('ERR_INVALID_HOSTNAME');
            valid = false;
        }

        if (valid && !/^[a-zA-Z0-9-]+$/.test(obj.hostname)) {
            ui.errorMessage(msg).querySelector('.sub-message').innerHTML = tr('ERR_HOSTNAME_CHARS');
            valid = false;
        }
        if (valid && obj.hostname.length > 32) {
            ui.errorMessage(msg).querySelector('.sub-message').innerHTML = tr('ERR_HOSTNAME_LENGTH');
            valid = false;
        }
        if (valid && typeof obj.ntpServer === 'string' && obj.ntpServer.length > 64) {
            ui.errorMessage(msg).querySelector('.sub-message').innerHTML = tr('ERR_NTP_LENGTH');
            valid = false;
        }
        if (valid) {
            putJSONSync('/setgeneral', obj, (err, response) => {
                if (err) ui.serviceError(err);
                console.log(response);
            });
        }
    }
    setSecurityConfig(security) {
        // We need to transform the security object so that it can be set to the configuration.
        let obj = {
            security: {
                type: security.type, username: security.username, password: security.password,
                permissions: { configOnly: makeBool(security.permissions & 0x01) },
                pin: {
                    d0: security.pin[0],
                    d1: security.pin[1],
                    d2: security.pin[2],
                    d3: security.pin[3]
                }
            }
        };
        ui.toElement(document.getElementById('divSecurityOptions'), obj);
        this.onSecurityTypeChanged();
    }

    rebootDevice() {
        ui.promptMessage(document.getElementById('divContainer'), tr('PROMPT_REBOOT_CONFIRM'), () => {
            if(typeof socket !== 'undefined') socket.close(3000, 'reboot');
            putJSONSync('/reboot', {}, (err, response) => {
                document.getElementById('btnSaveGeneral').classList.remove('disabled');
                console.log(response);
            });
            ui.clearErrors();
        });
    }

    onLanguageChanged(lang) {
        // On désactive temporairement le sélecteur pour éviter le double-clic/double-envoi
        const sel = document.getElementById('langSelect');
        if (sel) sel.disabled = true;

        fetch('/setLang?lang=' + lang)
        .then(r => r.json())
        .then(resp => {
            if (resp.status === "ok") {
                // Option A: Rechargement complet (Recommandé pour une UI propre)
                window.location.reload();
            }
        })
        .catch(err => {
            console.error("Erreur lors du changement de langue:", err);
            if (sel) sel.disabled = false;
        });
    }


    /***********************************************************************************/
    onModeThemeChanged() {
        const sel = document.getElementById('selThemeMode');
        const val = sel.value;

        localStorage.setItem('themeMode', val);

        if (val === '1') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (val === '2') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        }
    }

    onSecurityTypeChanged() {
        let pnl = document.getElementById('divSecurityOptions');
        let sec = ui.fromElement(pnl).security;
        switch (sec.type) {
            case 0:
                pnl.querySelector('#divPermissions').style.display = 'none';
                pnl.querySelector('#divPinSecurity').style.display = 'none';
                pnl.querySelector('#divPasswordSecurity').style.display = 'none';
                break;
            case 1:
                pnl.querySelector('#divPermissions').style.display = '';
                pnl.querySelector('#divPinSecurity').style.display = '';
                pnl.querySelector('#divPasswordSecurity').style.display = 'none';
                break;
            case 2:
                pnl.querySelector('#divPermissions').style.display = '';
                pnl.querySelector('#divPinSecurity').style.display = 'none';
                pnl.querySelector('#divPasswordSecurity').style.display = '';
                break;

        }
    }


    saveSecurity() {
        let security = ui.fromElement(document.getElementById('divSecurityOptions')).security;
        console.log(security);
        let sec = { type: security.type, username: security.username, password: security.password, pin: '', perm: 0 };
        // Pin entry.
        for (let i = 0; i < 4; i++) {
            sec.pin += security.pin[`d${i}`];
        }
        sec.permissions |= security.permissions.configOnly ? 0x01 : 0x00;
        let confirm = '';
        console.log(sec);
        if (security.type === 1) { // Pin Entry
            // Make sure our pin is 4 digits.
            if (sec.pin.length !== 4) {
                ui.errorMessage(tr('ERR_PIN_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_PIN_INVALID_DESC');
                return;
            }
            confirm =  `<p>${tr('SEC_PIN_WARNING')}</p><p>${tr('SEC_PIN_CONFIRM')}</p>`;
        }
        else if (security.type === 2) { // Password
            if (sec.username.length === 0) {
                ui.errorMessage(tr('ERR_USERNAME_MISSING')).querySelector('.sub-message').innerHTML = tr('ERR_USERNAME_MISSING_DESC');
                return;
            }
            if (sec.username.length > 32) {
                ui.errorMessage(tr('ERR_USERNAME_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_USERNAME_INVALID_DESC');
                return;
            }

            if (sec.password.length === 0) {
                ui.errorMessage(tr('ERR_PASSWORD_MISSING')).querySelector('.sub-message').innerHTML = tr('ERR_PASSWORD_MISSING_DESC');
                return;
            }
            if (sec.password.length > 32) {
                ui.errorMessage(tr('ERR_PASSWORD_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_PASSWORD_INVALID_DESC');
                return;
            }

            if (security.repeatpassword.length === 0) {
                ui.errorMessage(tr('ERR_PASSWORD_CONFIRM_MISSING')).querySelector('.sub-message').innerHTML = tr('ERR_PASSWORD_CONFIRM_MISSING_DESC');
                return;
            }
            if (sec.password !== security.repeatpassword) {
                ui.errorMessage(tr('ERR_PASSWORD_MISMATCH')).querySelector('.sub-message').innerHTML = tr('ERR_PASSWORD_MISMATCH_DESC');
                return;
            }
            confirm = `<p>${tr('SEC_PASSWORD_WARNING')}</p><p>${tr('SEC_PASSWORD_CONFIRM')}</p>`;
        }
        let prompt = ui.promptMessage(tr('PROMPT_SECURITY_CONFIRM'), () => {
            putJSONSync('/saveSecurity', sec, (err, objApiKey) => {
                prompt.remove();
                if (err) ui.serviceError(err);
                else {
                    console.log(objApiKey);
                }
            });
        });
        prompt.querySelector('.sub-message').innerHTML = confirm;

    }
}

//**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************
var general = new General();

class Wifi {
    initialized = false;
    ethBoardTypes = [];
    ethClockModes = [];
    ethPhyTypes = [];

    init() {
        // 1. Initialisation des données avec traductions
        // On le fait ICI pour être sûr que la fonction tr() est disponible
        this.ethBoardTypes = [
            { val: 0, label: tr("ETH_BOARD_MANUAL") || "Configuration Manuelle" },
            { val: 7, label: 'EST-PoE-32 - Everything Smart', clk: 3, ct: 0, addr: 0, pwr: 12, mdc: 23, mdio: 18 },
            { val: 3, label: 'ESP32-EVB - Olimex', clk: 0, ct: 0, addr: 0, pwr: -1, mdc: 23, mdio: 18 },
            { val: 2, label: 'ESP32-POE - Olimex', clk: 3, ct: 0, addr: 0, pwr: 12, mdc: 23, mdio: 18 },
            { val: 4, label: 'T-Internet POE - LILYGO', clk: 3, ct: 0, addr: 0, pwr: 16, mdc: 23, mdio: 18 },
            { val: 5, label: 'wESP32 v7+ - Silicognition', clk: 0, ct: 2, addr: 0, pwr: -1, mdc: 16, mdio: 17 },
            { val: 6, label: 'wESP32 < v7 - Silicognition', clk: 0, ct: 0, addr: 0, pwr: -1, mdc: 16, mdio: 17 },
            { val: 1, label: 'WT32-ETH01 - Wireless Tag', clk: 0, ct: 0, addr: 1, pwr: 16, mdc: 23, mdio: 18 }
        ];

        this.ethClockModes = [
            { val: 0, label: 'GPIO0 IN' },
            { val: 1, label: 'GPIO0 OUT' },
            { val: 2, label: 'GPIO16 OUT' },
            { val: 3, label: 'GPIO17 OUT' }
        ];

        this.ethPhyTypes = [
            { val: 0, label: 'LAN8720' },
            { val: 1, label: 'TLK110' },
            { val: 2, label: 'RTL8201' },
            { val: 3, label: 'DP83848' },
            { val: 4, label: 'DM9051' },
            { val: 5, label: 'KZ8081' }
        ];

        // 2. Mise à jour de l'interface
        const divStrength = document.getElementById("divNetworkStrength");
        //if (divStrength) divStrength.innerHTML = this.displaySignal(-100);
        // 2. Mise à jour de l'interface (Version svg)
        this.procWifiStrength({strength: -100, ssid: '', channel: -1});

        if (this.initialized) return;

        // 3. Chargement des menus déroulants (Dropdowns)
        this.loadETHDropdown(document.getElementById('selETHClkMode'), this.ethClockModes);
        this.loadETHDropdown(document.getElementById('selETHPhyType'), this.ethPhyTypes);
        this.loadETHDropdown(document.getElementById('selETHBoardType'), this.ethBoardTypes);

        // Adresses PHY (0 à 31)
        let addr = [];
        for (let i = 0; i < 32; i++) {
            addr.push({ val: i, label: `PHY ${i}` });
        }
        this.loadETHDropdown(document.getElementById('selETHAddress'), addr);

        // Configuration des Pins
        this.loadETHPins(document.getElementById('selETHPWRPin'), 'power');
        this.loadETHPins(document.getElementById('selETHMDCPin'), 'mdc', 23);
        this.loadETHPins(document.getElementById('selETHMDIOPin'), 'mdio', 18);

        // 4. Initialisation des valeurs par défaut dans l'interface
        ui.toElement(document.getElementById('divNetAdapter'), {
            wifi: { ssid: '', passphrase: '' },
            ethernet: {
                boardType: 1,
                wirelessFallback: false,
                dhcp: true,
                dns1: '',
                dns2: '',
                ip: '',
                gateway: ''
            }
        });

        // 5. Déclenchement du changement de type de carte pour configurer les pins par défaut
        this.onETHBoardTypeChanged(document.getElementById('selETHBoardType'));

        this.initialized = true;
    }
    loadETHPins(sel, type, selected) {
        let arr = [];
        switch (type) {
            case 'power':
                arr.push({ val: -1, label: 'None' });
                break;
        }
        for (let i = 0; i < 36; i++) {
            arr.push({ val: i, label: `GPIO ${i}` });
        }
        this.loadETHDropdown(sel, arr, selected);
    }
    loadETHDropdown(sel, arr, selected) {
        while (sel.firstChild) sel.removeChild(sel.firstChild);
        for (let i = 0; i < arr.length; i++) {
            let elem = arr[i];
            sel.options[sel.options.length] = new Option(elem.label, elem.val, elem.val === selected, elem.val === selected);
        }
    }
    onETHBoardTypeChanged(sel) {
        let type = this.ethBoardTypes.find(elem => parseInt(sel.value, 10) === elem.val);
        if (typeof type !== 'undefined') {
            // Change the values to represent what the board type says.
            if(typeof type.ct !== 'undefined') document.getElementById('selETHPhyType').value = type.ct;
            if (typeof type.clk !== 'undefined') document.getElementById('selETHClkMode').value = type.clk;
            if (typeof type.addr !== 'undefined') document.getElementById('selETHAddress').value = type.addr;
            if (typeof type.pwr !== 'undefined') document.getElementById('selETHPWRPin').value = type.pwr;
            if (typeof type.mdc !== 'undefined') document.getElementById('selETHMDCPin').value = type.mdc;
            if (typeof type.mdio !== 'undefined') document.getElementById('selETHMDIOPin').value = type.mdio;
            document.getElementById('divETHSettings').style.display = type.val === 0 ? '' : 'none';
        }
    }
    onDHCPClicked(cb) { document.getElementById('divStaticIP').style.display = cb.checked ? 'none' : ''; }
    loadNetwork() {
        let pnl = document.getElementById('divNetAdapter');
        getJSONSync('/networksettings', (err, settings) => {
            console.log(settings);
            if (err) {
                ui.serviceError(err);
            }
            else {
                document.getElementById('cbHardwired').checked = settings.connType >= 2;
                document.getElementById('cbFallbackWireless').checked = settings.connType === 3;
                ui.toElement(pnl, settings);
                /*
                if (settings.connType >= 2) {
                    document.getElementById('divWiFiMode').style.display = 'none';
                    document.getElementById('divEthernetMode').style.display = '';
                    document.getElementById('divRoaming').style.display = 'none';
                    document.getElementById('divFallbackWireless').style.display = 'inline-block';
                }
                else {
                    document.getElementById('divWiFiMode').style.display = '';
                    document.getElementById('divEthernetMode').style.display = 'none';
                    document.getElementById('divFallbackWireless').style.display = 'none';
                    document.getElementById('divRoaming').style.display = 'inline-block';
                }
                */
                ui.toElement(document.getElementById('divDHCP'), settings);
                document.getElementById('divETHSettings').style.display = settings.ethernet.boardType === 0 ? '' : 'none';
                document.getElementById('divStaticIP').style.display = settings.ip.dhcp ? 'none' : '';
                document.getElementById('spanCurrentIP').innerHTML = settings.ip.ip;
                this.useEthernetClicked();
                this.hiddenSSIDClicked();

            }
        });

    }
    useEthernetClicked() {
        let useEthernet = document.getElementById('cbHardwired').checked;
        document.getElementById('divWiFiMode').style.display = useEthernet ? 'none' : '';
        document.getElementById('hrIdName').style.display = useEthernet ? '' : 'none';
        document.getElementById('divEthernetMode').style.display = useEthernet ? '' : 'none';
        document.getElementById('divTypeCardMode').style.display = useEthernet ? '' : 'none';
        document.getElementById('divFallbackWireless').style.display = useEthernet ? '' : 'none';
        document.getElementById('divRoaming').style.display = useEthernet ? 'none' : '';
        document.getElementById('divHiddenSSID').style.display = useEthernet ? 'none' : '';
    }

    hiddenSSIDClicked() {
        let hidden = document.getElementById('cbHiddenSSID').checked;
        if (hidden) document.getElementById('cbRoaming').checked = false;
        document.getElementById('cbRoaming').disabled = hidden;
    }



    async loadAPs() {
        if (document.getElementById('btnScanAPs').classList.contains('disabled')) return;

        // On affiche un message de recherche avec le spinner
        document.getElementById('divAps').innerHTML = `
        <div class="no-wifi">
        <div style="display:flex;justify-content:center;align-items:center;margin-bottom:10px;">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        <div data-txt="LBL_SCANNING">${tr("LBL_SCANNING")}</div>
        </div>`;

        document.getElementById('btnScanAPs').classList.add('disabled');

        getJSON('/scanaps', (err, aps) => {
            document.getElementById('btnScanAPs').classList.remove('disabled');
            if (err) {
                this.displayAPs({ connected: { name: '', passphrase: '' }, accessPoints: [] });
            } else {
                this.displayAPs(aps);
            }
        });
    }
    displayAPs(aps) {
        let nets = [];
        // --- Ta logique de filtrage (inchangée) ---
        for (let i = 0; i < aps.accessPoints.length; i++) {
            let ap = aps.accessPoints[i];
            let p = nets.find(elem => elem.name === ap.name);
            if (typeof p !== 'undefined' && p) {
                p.channel = p.strength > ap.strength ? p.channel : ap.channel;
                p.macAddress = p.strength > ap.strength ? p.macAddress : ap.macAddress;
                p.strength = Math.max(p.strength, ap.strength);
            }
            else nets.push(ap);
        }
        nets.sort((a, b) => b.strength - a.strength);

        // --- MODIFICATION ICI ---
        // Si on a des réseaux, on commence avec le titre. Sinon, on commence vide.
        let div = (nets.length > 0) ? `<div class="aps-title" data-txt="LBL_WIFI_AVAILABLE">${tr("LBL_WIFI_AVAILABLE") || "Réseaux disponibles :"}</div><hr class="aps-divider">` : '';

        for (let i = 0; i < nets.length; i++) {
            let ap = nets[i];
            div += `<div class="wifiSignal" onclick="wifi.selectSSID(this);" data-channel="${ap.channel}" data-encryption="${ap.encryption}" data-strength="${ap.strength}" data-mac="${ap.macAddress}"><span class="ssid">${ap.name}</span><span class="strength">${this.displaySignal(ap.strength)}</span></div>`;
        }

        // Si après la boucle div est toujours vide (nets.length était 0), on met le message d'erreur
        if (div === '') {
            div = `<div class="no-wifi">${tr("ERR_NO_WIFI_FOUND")}</div>`;
        }

        let divAps = document.getElementById('divAps');
        divAps.setAttribute('data-lastloaded', new Date().getTime());
        divAps.innerHTML = div;
    }
    selectSSID(el) {
        let obj = {
            name: el.querySelector('span.ssid').innerHTML,
            encryption: el.getAttribute('data-encryption'),
            strength: parseInt(el.getAttribute('data-strength'), 10),
            channel: parseInt(el.getAttribute('data-channel'), 10)
        };
        console.log(obj);
        document.getElementsByName('ssid')[0].value = obj.name;
    }
    calcWaveStrength(sig) {
        let wave = 0;
        if (sig > -90) wave = 0; // Allume juste le point (wifi_0)
        if (sig > -80) wave = 1; // Point + 1ère onde (wifi_1)
        if (sig > -70) wave = 2; // Point + 2 ondes (wifi_2)
        if (sig > -60) wave = 3; // Tout allumé (wifi_3)
        return wave;
    }

    /*
     * displaySignal(sig) {
     *   return `<div class="signal waveStrength-${this.calcWaveStrength(sig)}"><div class="wv4 wave"><div class="wv3 wave"><div class="wv2 wave"><div class="wv1 wave"><div class="wv0 wave"></div></div></div></div></div></div>`;
}
     */
    displaySignal(sig) {
        let level = this.calcWaveStrength(sig);
        if (level > 3) level = 3;

        // Fonction locale pour générer chaque morceau proprement
        const getPart = (idNum) => {
            const active = idNum <= level;
            return `<use xlink:href="#icon-wifi-${idNum}" fill="${active ? '#069800' : '#ccc'}" style="opacity:${active ? '1' : '0.3'}" />`;
        };

        return `
        <div class="signal">
        <svg viewBox="0 0 24 24" width="24" height="24">
        ${getPart(0)}
        ${getPart(1)}
        ${getPart(2)}
        ${getPart(3)}
        </svg>
        </div>`;
    }
    saveIPSettings() {
        let pnl = document.getElementById('divDHCP');
        let obj = ui.fromElement(pnl).ip;
        console.log(obj);
        if (!obj.dhcp) {
            let fnValidateIP = (addr) => { return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr); };
            if (typeof obj.ip !== 'string' || obj.ip.length === 0 || obj.ip === '0.0.0.0') {
                ui.errorMessage(tr('ERR_STATIC_IP_REQUIRED'));
                return;
            }
            else if (!fnValidateIP(obj.ip)) {
                ui.errorMessage(tr('ERR_STATIC_IP_INVALID'));
                return;
            }
            if (typeof obj.subnet !== 'string' || obj.subnet.length === 0 || obj.subnet === '0.0.0.0') {
                ui.errorMessage(tr('ERR_NETMASK_REQUIRED'));
                return;
            }
            else if (!fnValidateIP(obj.subnet)) {
                ui.errorMessage(tr('ERR_NETMASK_INVALID'));
                return;
            }
            if (typeof obj.gateway !== 'string' || obj.gateway.length === 0 || obj.gateway === '0.0.0.0') {
                ui.errorMessage(tr('ERR_GATEWAY_REQUIRED'));
                return;
            }
            else if (!fnValidateIP(obj.gateway)) {
                ui.errorMessage(tr('ERR_GATEWAY_INVALID'));
                return;
            }
            if (obj.dns1.length !== 0 && !fnValidateIP(obj.dns1)) {
                ui.errorMessage(tr('ERR_DNS1_INVALID'));
                return;
            }
            if (obj.dns2.length !== 0 && !fnValidateIP(obj.dns2)) {
                ui.errorMessage(tr('ERR_DNS2_INVALID'));
                return;
            }
        }
        putJSONSync('/setIP', obj, (err, response) => {
            if (err) {
                ui.serviceError(err);
            }
            console.log(response);
        });
    }





    saveNetwork() {
        let pnl = document.getElementById('divNetAdapter');
        let obj = ui.fromElement(pnl);
        obj.connType = obj.ethernet.hardwired ? (obj.ethernet.wirelessFallback ? 3 : 2) : 1;
        console.log(obj);
        if (obj.connType >= 2) {
            let boardType = this.ethBoardTypes.find(elem => obj.ethernet.boardType === elem.val);
            let phyType = this.ethPhyTypes.find(elem => obj.ethernet.phyType === elem.val);
            let clkMode = this.ethClockModes.find(elem => obj.ethernet.CLKMode === elem.val);
            let div = document.createElement('div');
            let html = `<div id="divLanSettings" class="inst-overlay">
            <div style="width:100%;color:red;text-align:center;font-weight:bold;"><span style="padding:10px;display:inline-block;width:100%;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;">${tr("ETH_WARNING_TITLE")}</span></div>
            <p style="font-size:14px;">${tr("ETH_WARNING_DESC_1")}</p>
            <p style="font-size:14px;margin-bottom:0px;">${tr("ETH_WARNING_DESC_2")}</p>
            <hr><div>
            <div class="eth-setting-line"><label>${tr("LBL_BOARD_TYPE")}</label><span>${boardType.label} [${boardType.val}]</span></div>
            <div class="eth-setting-line"><label>${tr("LBL_PHY_TYPE")}</label><span>${phyType.label} [${phyType.val}]</span></div>
            <div class="eth-setting-line"><label>${tr("LBL_PHY_ADDRESS")}</label><span>${obj.ethernet.phyAddress}</span ></div >
            <div class="eth-setting-line"><label>${tr("LBL_CLOCK_MODE")}</label><span>${clkMode.label} [${clkMode.val}]</span></div >
            <div class="eth-setting-line"><label>${tr("LBL_POWER_PIN")}</label><span>${obj.ethernet.PWRPin === -1 ? tr("LBL_NONE") : obj.ethernet.PWRPin}</span></div>
            <div class="eth-setting-line"><label>${tr("LBL_MDC_PIN")}</label><span>${obj.ethernet.MDCPin}</span></div>
            <div class="eth-setting-line"><label>${tr("LBL_MDIO_PIN")}</label><span>${obj.ethernet.MDIOPin}</span></div>
            </div>
            <div class="button-container">
            <button id="btnSaveEthernet" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:orangered;">${tr("BT_SAVE_ETHERNET")}</button>
            <button id="btnCancel" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:lawngreen;color:gray" onclick="document.getElementById('divLanSettings').remove();">${tr("BT_CANCEL_1")}</button>
            </div>`;
            div.innerHTML = html;
            document.getElementById('divContainer').appendChild(div);
            div.querySelector('#btnSaveEthernet').addEventListener('click', (el, event) => {
                console.log(obj);
                this.sendNetworkSettings(obj);
                setTimeout(() => { div.remove(); }, 1);
            });
        }
        else {
            this.sendNetworkSettings(obj);
        }
    }
    sendNetworkSettings(obj) {
        putJSONSync('/setNetwork', obj, (err, response) => {
            if (err) {
                ui.serviceError(err);
            }
            console.log(response);
        });
    }
    connectWiFi() {
        if (document.getElementById('btnConnectWiFi').classList.contains('disabled')) return;
        document.getElementById('btnConnectWiFi').classList.add('disabled');
        let obj = {
            ssid: document.getElementsByName('ssid')[0].value,
            passphrase: document.getElementsByName('passphrase')[0].value
        };
        if (obj.ssid.length > 64) {
            ui.errorMessage(tr('ERR_WIFI_SSID_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_WIFI_SSID_MAX_LENGTH_64');
            return;
        }
        if (obj.passphrase.length > 64) {
            ui.errorMessage(tr('ERR_WIFI_PASSPHRASE_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_WIFI_PASSPHRASE_MAX_LENGTH_64');
            return;
        }
        let overlay = ui.waitMessage(document.getElementById('divNetAdapter'));
        putJSON('/connectwifi', obj, (err, response) => {
            overlay.remove();
            document.getElementById('btnConnectWiFi').classList.remove('disabled');
            console.log(response);

        });
    }

    procWifiStrength(strength) {
        if (!strength) return;

        const ssid = strength.ssid || strength.name;
        const sVal = parseInt(strength.strength);

        // Mise à jour des textes (avec les sécurités if)
        const elSSID = document.getElementById('spanNetworkSSID');
        const elChan = document.getElementById('spanNetworkChannel');
        const elStrength = document.getElementById('spanNetworkStrength');

        if (elSSID) elSSID.innerHTML = !ssid || ssid === '' ? '-------------' : ssid;
        if (elChan) elChan.innerHTML = isNaN(strength.channel) || strength.channel < 0 ? '--' : strength.channel;
        if (elStrength) elStrength.innerHTML = isNaN(sVal) || sVal <= -100 ? '----' : sVal;

        // Calcul du niveau
        let level = (isNaN(sVal) || sVal >= 0 || sVal <= -100) ? -1 : this.calcWaveStrength(sVal);
        if (level >= 3) level = 3;

        // Mise à jour visuelle via CSS
        for (let i = 0; i <= 3; i++) {
            const part = document.getElementById('wifi_' + i);
            if (part) {
                if (i <= level) {
                    part.classList.add('active');    // On allume
                } else {
                    part.classList.remove('active'); // On éteint
                }
            }
        }
    }

    /*
    procWifiStrength(strength) {
        //console.log(strength);
        let ssid = strength.ssid || strength.name;
        document.getElementById('spanNetworkSSID').innerHTML = !ssid || ssid === '' ? '-------------' : ssid;
        document.getElementById('spanNetworkChannel').innerHTML = isNaN(strength.channel) || strength.channel < 0 ? '--' : strength.channel;
        let cssClass = 'waveStrength-' + (isNaN(strength.strength) || strength > 0 ? -100 : this.calcWaveStrength(strength.strength));
        let elWave = document.getElementById('divNetworkStrength').children[0];
        if (typeof elWave !== 'undefined' && !elWave.classList.contains(cssClass)) {
            elWave.classList.remove('waveStrength-0', 'waveStrength-1', 'waveStrength-2', 'waveStrength-3', 'waveStrength-4');
            elWave.classList.add(cssClass);
        }
        document.getElementById('spanNetworkStrength').innerHTML = isNaN(strength.strength) || strength.strength <= -100 ? '----' : strength.strength;
    }
    */









    procEthernet(ethernet) {
        console.log(ethernet);
        document.getElementById('divEthernetStatus').style.display = ethernet.connected ? '' : 'none';
        document.getElementById('divWiFiStrength').style.display = ethernet.connected ? 'none' : '';
        document.getElementById('spanEthernetStatus').innerHTML = ethernet.connected ? 'Connected' : 'Disconnected';
        document.getElementById('spanEthernetSpeed').innerHTML = !ethernet.connected ? '--------' : `${ethernet.speed}Mbps ${ethernet.fullduplex ? 'Full-duplex' : 'Half-duplex'}`;
    }
}





var wifi = new Wifi();

class Somfy {

    initialized = false;
    frames = [];
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    shadeTypes = [
        { type: 0, name: 'Store enrouleur', svg: 'svg-window-shade', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 1, name: 'Store vénitien', svg: 'svg-window-blind', lift: true, tilt: true, sun: true, fcmd: true, fpos: true },
        { type: 2, name: 'Rideau (gauche)', svg: 'svg-ldrapery', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 3, name: 'Store banne', svg: 'svg-awning', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 4, name: 'Volet', svg: 'svg-shutter', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 5, name: 'Garage (1-bouton)', svg: 'svg-garage', lift: true, light: true, fpos: true },
        { type: 6, name: 'Garage (3-bouton)', svg: 'svg-garage', lift: true, light: true, fcmd: true, fpos: true },
        { type: 7, name: 'Rideau (droit)', svg: 'svg-rdrapery', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 8, name: 'Rideau (centre)', svg: 'svg-cdrapery', lift: true, sun: true, fcmd: true, fpos: true },
        { type: 9, name: 'Contact sec (1 bouton)', svg: 'svg-lightbulb', fpos: true },
        { type: 10, name: 'Contact sec (2 boutons)', svg: 'svg-lightbulb', fcmd: true, fpos: true },
        { type: 11, name: 'Portail (gauche)', svg: 'svg-lgate', lift: true, fcmd: true, fpos: true },
        { type: 12, name: 'Portail (centre)', svg: 'svg-cgate', lift: true, fcmd: true, fpos: true },
        { type: 13, name: 'Portail (droit)', svg: 'svg-rgate', lift: true, fcmd: true, fpos: true },
        { type: 14, name: 'Portail (1 bouton gauche)', svg: 'svg-lgate', lift: true, fcmd: true, fpos: true },
        { type: 15, name: 'Portail (1 bouton centre)', svg: 'svg-cgate', lift: true, fcmd: true, fpos: true },
        { type: 16, name: 'Portail (1 bouton droit)', svg: 'svg-rgate', lift: true, fcmd: true, fpos: true },
    ];



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Profils GPIO
    radioBoardTypes = [{ val: 0, label: 'Default' },
        { val: 1, label: 'CC1101 – ESP32-D1',SCKPin: 18, CSNPin: 5, MOSIPin: 23, MISOPin: 19, TXPin: 21, RXPin: 22},
        { val: 2, label: 'CC1101 – ESP32-S3',SCKPin: 12, CSNPin: 10, MOSIPin: 11, MISOPin: 13, TXPin: 15, RXPin: 14},
        { val: 3, label: 'CC1101 – ESP32-S2',SCKPin: 36, CSNPin: 34, MOSIPin: 35, MISOPin: 37, TXPin: 15, RXPin: 14},
        { val: 4, label: 'CC1101 – ESP32-C3',SCKPin: 15, CSNPin: 14, MOSIPin: 16, MISOPin: 17, TXPin: 13, RXPin: 12},
    ];
    init() {
        if (this.initialized) return;
        this.initialized = true;
    }

    initPins() {
        // 🔹 Chargement du select de type radio
        //this.loadRadioBoardTypes(document.getElementById('selRadioBoardType'));
        document
            .getElementById('selRadioBoardType')
            .addEventListener('change', e => this.onRadioBoardTypeChanged(e.target));

        // 🔹 Chargement des pins
        this.loadPins('inout', document.getElementById('selTransSCKPin'));
        this.loadPins('inout', document.getElementById('selTransCSNPin'));
        this.loadPins('inout', document.getElementById('selTransMOSIPin'));
        this.loadPins('input', document.getElementById('selTransMISOPin'));
        this.loadPins('out', document.getElementById('selTransTXPin'));
        this.loadPins('input', document.getElementById('selTransRXPin'));

        ui.toElement(document.getElementById('divTransceiverSettings'), {
            transceiver: { config: { proto: 0, SCKPin: 18, CSNPin: 5, MOSIPin: 23, MISOPin: 19, TXPin: 12, RXPin: 13, frequency: 433.42, rxBandwidth: 97.96, type: 56, deviation: 11.43, txPower: 10, enabled: false } }
        });

        this.loadPins('out', document.getElementById('selShadeGPIOUp'));
        this.loadPins('out', document.getElementById('selShadeGPIODown'));
        this.loadPins('out', document.getElementById('selShadeGPIOMy'));
        this.hiddenGPIOClicked();
    }

    // 🔹 Remplit le select
    loadRadioBoardTypes(sel) {
        while (sel.firstChild) sel.removeChild(sel.firstChild);
        this.radioBoardTypes.forEach(t => {
            sel.options.add(new Option(t.label, t.val));
        });
    }

    // 🔹 Applique les pins si profil ≠ 0
    onRadioBoardTypeChanged(sel) {

        const type = this.radioBoardTypes.find(
            t => parseInt(sel.value, 10) === t.val
        );

        if (!type || type.val === 0) return;

        const map = {
            SCKPin: 'selTransSCKPin', CSNPin: 'selTransCSNPin',MOSIPin: 'selTransMOSIPin',MISOPin: 'selTransMISOPin',TXPin: 'selTransTXPin',RXPin: 'selTransRXPin'
        };

        for (const k in map) {
            if (type[k] !== undefined) {
                document.getElementById(map[k]).value = type[k];
            }
        }
    }
    hiddenGPIOClicked() {
        const swShowGpio = document.getElementById('swShowGpio').checked;
        console.log('switch =', swShowGpio);
        console.log('data-bind =', ui.fromElement(document.getElementById('divTransceiverSettings')).somfy.swShowGpio);
        document.getElementById('divShowGpio').style.display = swShowGpio ? '' : 'none';
        document.getElementById('hrShowgpio').style.display = swShowGpio ? '' : 'none';

    }


    async loadSomfy() {
        getJSONSync('/controller', (err, somfy) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            } else {

                document.getElementById('spanMaxRooms').innerText = somfy.maxRooms || 0;
                document.getElementById('spanMaxShades').innerText = somfy.maxShades;
                document.getElementById('spanMaxGroups').innerText = somfy.maxGroups;

                ui.toElement(document.getElementById('divTransceiverSettings'), somfy);

                const cbRadio = document.getElementById('cbEnableRadio');
                const txtStatus = document.getElementById('divRadioEnableStatus');
                const row = document.getElementById('divRadioEnableColor');

                const updateRadioText = () => {
                    const active = cbRadio.checked;
                    txtStatus.textContent = active
                        ? tr('RADIO_ENABLED')
                        : tr('RADIO_DISABLED');
                    row.style.backgroundColor = active ? "color-mix(in srgb, var(--accent-color) 30%,var(--unibloc-color)" : "var(--unibloc-color)";
                };

                updateRadioText();
                cbRadio.addEventListener('change', updateRadioText);

                document.getElementById('divRadioError').style.display =
                    somfy.transceiver.config.radioInit ? 'none' : '';

                this.setRoomsList(somfy.rooms);
                this.setShadesList(somfy.shades);
                this.setGroupsList(somfy.groups);
                this.setRepeaterList(somfy.repeaters);

                if (typeof somfy.version !== 'undefined') {
                    firmware.procFwStatus(somfy.version);
                }
            }
        });
    }

    saveRadio() {
        let valid = true;
        let getIntValue = (fld) => { return parseInt(document.getElementById(fld).value, 10); };
        const form = ui.fromElement(document.getElementById('divTransceiverSettings'));
        console.log('swShowGpio =', form.somfy?.swShowGpio);

        let trans = ui.fromElement(document.getElementById('divTransceiverSettings')).transceiver;
        // Check to make sure we have a trans type.
        if (typeof trans.config.type === 'undefined' || trans.config.type === '' || trans.config.type === 'none') {
            ui.errorMessage(tr('ERR_RADIO_TYPE_REQUIRED'));
            valid = false;
        }
        // Check to make sure no pins were duplicated and defined
        if (valid) {
            let fnValDup = (o, name) => {
                let val = o[name];
                if (typeof val === 'undefined' || isNaN(val)) {
                    ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_RADIO_PINS_REQUIRED'));
                    return false;
                }
                for (let s in o) {
                    if (s.endsWith('Pin') && s !== name) {
                        let sval = o[s];
                        if (typeof sval === 'undefined' || isNaN(sval)) {
                            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_RADIO_PINS_REQUIRED'));
                            return false;
                        }
                        if (sval === val) {
                            if ((name === 'TXPin' && s === 'RXPin') ||
                                (name === 'RXPin' && s === 'TXPin'))
                                continue; // The RX and TX pins can share the same value.  In this instance the radio will only use GDO0.
                            else {
                                ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_GPIO_PIN_DUPLICATED').replace('%1', name.replace('Pin', '')).replace('%2', s.replace('Pin', ''))
                                );
                                valid = false;
                                return false;
                            }
                        }
                    }
                }
                return true;
            };
            if (valid) valid = fnValDup(trans.config, 'SCKPin');
            if (valid) valid = fnValDup(trans.config, 'CSNPin');
            if (valid) valid = fnValDup(trans.config, 'MOSIPin');
            if (valid) valid = fnValDup(trans.config, 'MISOPin');
            if (valid) valid = fnValDup(trans.config, 'TXPin');
            if (valid) valid = fnValDup(trans.config, 'RXPin');
            if (valid) {
                putJSONSync('/saveRadio', trans, (err, trans) => {
                    if (err)
                        ui.serviceError(err);
                    else {
                        document.getElementById('btnSaveRadio').classList.remove('disabled');
                        if (trans.config.radioInit) {
                            document.getElementById('divRadioError').style.display = 'none';
                        }
                        else {
                            document.getElementById('divRadioError').style.display = '';
                        }
                    }
                    console.log(trans);
                });
            }
        }
    }
    procFrequencyScan(scan) {
        //console.log(scan);
        let div = this.scanFrequency();
        let spanTestFreq = document.getElementById('spanTestFreq');
        let spanTestRSSI = document.getElementById('spanTestRSSI');
        let spanBestFreq = document.getElementById('spanBestFreq');
        let spanBestRSSI = document.getElementById('spanBestRSSI');
        if (spanBestFreq) {
            spanBestFreq.innerHTML = scan.RSSI !== -100 ? scan.frequency.fmt('###.00') : '----';
        }
        if (spanBestRSSI) {
            spanBestRSSI.innerHTML = scan.RSSI !== -100 ? scan.RSSI : '----';
        }
        if (spanTestFreq) {
            spanTestFreq.innerHTML = scan.testFreq.fmt('###.00');
        }
        if (spanTestRSSI) {
            spanTestRSSI.innerHTML = scan.testRSSI !== -100 ? scan.testRSSI : '----';
        }
        if (scan.RSSI !== -100)
            div.setAttribute('data-frequency', scan.frequency);
    }







    scanFrequency(initScan) {
        let div = document.getElementById('divScanFrequency');
        if (!div || typeof div === 'undefined') {
            div = document.createElement('div');
            div.setAttribute('id', 'divScanFrequency');
            div.classList.add('prompt-message');
            let html = `<div class="sub-message">${tr("SCAN_FREQ_DESC")}</div>
            <hr style="width:100%;margin:0px;">
            <div style="width:100%;text-align:center;">
            <div class="" style="font-size:20px;"><label style="padding-right:7px;display:inline-block;width:87px;">${tr("LBL_SCAN")}</label><span id="spanTestFreq" style="display:inline-block;width:4em;text-align:right;">433.00</span><span>${tr("LBL_MHZ")}</span><label style="padding-left:12px;padding-right:7px;">${tr("LBL_RSSI")}</label><span id="spanTestRSSI">----</span><span>dBm</span></div>
            <div class="" style="font-size:20px;"><label style="padding-right:7px;display:inline-block;width:87px;">${tr("LBL_FREQUENCY")}</label><span id="spanBestFreq" style="display:inline-block;width:4em;text-align:right;">---.--</span><span>${tr("LBL_MHZ")}</span><label style="padding-left:12px;padding-right:7px;">${tr("LBL_RSSI")}</label><span id="spanBestRSSI">----</span><span>dBm</span></div>
            </div>
            <div class="button-container">
            <button id="btnStopScanning" class="bouton" type="button" style="padding-left:20px;padding-right:20px;" onclick="somfy.stopScanningFrequency(true);">${tr("BT_STOP_SCAN")}</button>
            <button id="btnRestartScanning" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:none;" onclick="somfy.scanFrequency(true);">${tr("BT_START_SCAN")}</button>
            <button id="btnCopyFrequency" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:none;" onclick="somfy.setScannedFrequency();">${tr("BT_COPY_FREQUENCY")}</button>
            <button id="btnCloseScanning" class="boutonOutline" type="button" style="padding-left:20px;padding-right:20px;width:100%;display:none;" onclick="document.getElementById('divScanFrequency').remove();">${tr("BT_CLOSE")}</button>
            </div>`;
            div.innerHTML = html;
            document.getElementById('divRadioSettings').appendChild(div); // append avant traduction

            // Appliquer la traduction


        }
        if (initScan) {
            div.setAttribute('data-initscan', true);
            putJSONSync('/beginFrequencyScan', {}, (err, trans) => {
                if (!err) {
                    document.getElementById('btnStopScanning').style.display = '';
                    document.getElementById('btnRestartScanning').style.display = 'none';
                    document.getElementById('btnCopyFrequency').style.display = 'none';
                    document.getElementById('btnCloseScanning').style.display = 'none';
                }
            });
        }
        return div;
    }





    setScannedFrequency() {
        let div = document.getElementById('divScanFrequency');
        let freq = parseFloat(div.getAttribute('data-frequency'));
        let slid = document.getElementById('slidFrequency');
        slid.value = Math.round(freq * 1000);
        somfy.frequencyChanged(slid);
        div.remove();
    }
    stopScanningFrequency(killScan) {
        let div = document.getElementById('divScanFrequency');
        if (div && killScan !== true) {
            div.remove();
        }
        else {
            putJSONSync('/endFrequencyScan', {}, (err, trans) => {
                if (err) ui.serviceError(err);
                else {
                    let freq = parseFloat(div.getAttribute('data-frequency'));
                    document.getElementById('btnStopScanning').style.display = 'none';
                    document.getElementById('btnRestartScanning').style.display = '';
                    if (typeof freq === 'number' && !isNaN(freq)) document.getElementById('btnCopyFrequency').style.display = '';
                    document.getElementById('btnCloseScanning').style.display = '';
                }
            });
        }
    }
    btnDown = null;
    btnTimer = null;



 //****************************************************************************************************************************************************
    checkEmptyState() {
        const divGetStarted = document.getElementById('divGetStarted');
        const divGroupControls = document.getElementById('divGroupControls');
        const divShadeControls = document.getElementById('divShadeControls');
        const divRoomSelector = document.getElementById('divRoomSelector');
        const showLogoHeader = document.getElementById('showLogoHeader');
        const divConfigPnl = document.getElementById('divConfigPnl');

        if (!divGetStarted || !divGroupControls || !divShadeControls) return;

        const hasGroups = divGroupControls.children.length > 0;
        const hasShades = divShadeControls.children.length > 0;
        const hasRealRooms = (typeof _rooms !== 'undefined' && _rooms.filter(r => r.roomId !== 0).length > 0);

        const isDashboardEmpty = !hasGroups && !hasShades && !hasRealRooms;
        const isConfigOpen = divConfigPnl && divConfigPnl.style.display !== 'none';

        // LOGIQUE DU LOGO :
        // On l'affiche SI (la config est ouverte) OU SI (le dashboard n'est pas vide)
        if (showLogoHeader) {
            showLogoHeader.style.visibility = (isConfigOpen || !isDashboardEmpty) ? 'visible' : 'hidden';
        }

        if (isDashboardEmpty) {
            // Mode Accueil (GetStarted) - on ne l'affiche que si la config est fermée
            divGetStarted.style.display = isConfigOpen ? 'none' : 'flex';

            divGroupControls.style.display = 'none';
            divShadeControls.style.display = 'none';
            if (divRoomSelector) divRoomSelector.style.display = 'none';
        } else {
            // Mode Dashboard (avec contenu)
            divGetStarted.style.display = 'none';
            divGroupControls.style.display = hasGroups ? '' : 'none';
            divShadeControls.style.display = hasShades ? '' : 'none';
            if (divRoomSelector) divRoomSelector.style.display = hasRealRooms ? '' : 'none';
        }
    }

//***************************************************************************************************************************************************

    procRoomAdded(room) {
        let r = _rooms.find(x => x.roomId === room.roomId);
        if (typeof r === 'undefined' || !r) {
            _rooms.push(room);
            _rooms.sort((a, b) => { return a.sortOrder - b.sortOrder });
            this.setRoomsList(_rooms);
            this.checkEmptyState();
        }
    }
    procRoomRemoved(room) {
        if (room.roomId === 0) return;
        let r = _rooms.find(x => x.roomId === room.roomId);
        if (typeof r !== 'undefined' && r.roomId === room.roomId) {
            _rooms = _rooms.filter(x => x.roomId === room.roomId);
            _rooms.sort((a, b) => { return a.sortOrder - b.sortOrder });
            this.setRoomsList(_rooms);
            this.checkEmptyState();
            let rs = document.getElementById('divRoomSelector');
            let ss = document.getElementById('divShadeControls');
            let gs = document.getElementById('divGroupControls');
            let ctls = ss.querySelectorAll('.somfyShadeCtl');
            for (let i = 0; i < ctls.length; i++) {
                let x = ctls[i];
                if (parseInt(x.getAttribute('data-roomid'), 10) === room.roomId)
                    x.setAttribute('data-roomid', '0');
            }
            ctls = gs.querySelectorAll('.somfyGroupCtl');
            for (let i = 0; i < ctls.length; i++) {
                let x = ctls[i];
                if (parseInt(x.getAttribute('data-roomid'), 10) === room.roomId)
                    x.setAttribute('data-roomid', '0');
            }
            if (parseInt(rs.getAttribute('data-roomid'), 10) === room.roomId) this.selectRoom(0);
        }
    }
    selectRoom(roomId) {
        let room = _rooms.find(x => x.roomId === roomId) || { roomId: 0, name: '' };
        let rs = document.getElementById('divRoomSelector');
        rs.setAttribute('data-roomid', roomId);
        rs.querySelector('span').innerHTML = room.name;
        document.getElementById('divRoomSelector-list').style.display = 'none';
        let ss = document.getElementById('divShadeControls');
        ss.setAttribute('data-roomid', roomId);
        let ctls = ss.querySelectorAll('.somfyShadeCtl');
        for (let i = 0; i < ctls.length; i++) {
            let x = ctls[i];
            if (roomId !== 0 && parseInt(x.getAttribute('data-roomid'), 10) !== roomId)
                x.style.display = 'none';
            else
                x.style.display = '';
        }
        let gs = document.getElementById('divGroupControls');
        ctls = gs.querySelectorAll('.somfyGroupCtl');
        for (let i = 0; i < ctls.length; i++) {
            let x = ctls[i];
            if (roomId !== 0 && parseInt(x.getAttribute('data-roomid'), 10) !== roomId)
                x.style.display = 'none';
            else
                x.style.display = '';
        }
    }


    setRoomsList(rooms) {
        let divCfg = '';

        // 1. On récupère le nom traduit maintenant (car le JSON est chargé)
        const homeName = tr('LBL_HOME');

        // 2. On utilise homeName pour les templates
        let divCtl = `<div class='room-row' data-roomid="0" onclick="somfy.selectRoom(0);event.stopPropagation();">${homeName}</div>`;
        let divOpts = `<option value="0">${homeName}</option>`;

        // 3. On réinitialise la variable globale avec le nom traduit
        _rooms = [{ roomId: 0, name: homeName }];

        rooms.sort((a, b) => { return a.sortOrder - b.sortOrder });
            for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            divCfg += `<div class="somfyRoom room-draggable" draggable="true" data-roomid="${room.roomId}">`;
            divCfg += `<div class="button-outline-svg" onclick="somfy.openEditRoom(${room.roomId});"><svg class="icon-svg"><use xlink:href="#pen-edit"></use></svg></div>`;
            divCfg += `<span class="room-name">${room.name}</span>`;
            divCfg += `<div class="button-outline-svg" onclick="somfy.deleteRoom(${room.roomId});"><svg class="icon-svg"><use xlink:href="#trash-edit"></use></svg></div>`;
            divCfg += '</div>';

            divOpts += `<option value="${room.roomId}">${room.name}</option>`;
            _rooms.push(room);
            divCtl += `<div class='room-row' data-roomid="${room.roomId}" onclick="somfy.selectRoom(${room.roomId});event.stopPropagation();">${room.name}</div>`;
        }
        document.getElementById('divRoomSelector').style.display = rooms.length === 0 ? 'none' : '';
        document.getElementById('divRoomSelector-list').innerHTML = divCtl;
        document.getElementById('divRoomList').innerHTML = divCfg;
        document.getElementById('selShadeRoom').innerHTML = divOpts;
        document.getElementById('selGroupRoom').innerHTML = divOpts;
        //roomControls.innerHTML = divCtl;
        this.checkEmptyState();
        this.setListDraggable(document.getElementById('divRoomList'), '.room-draggable', (list) => {
            // Get the shade order
            let items = list.querySelectorAll('.room-draggable');
            let order = [];
            for (let i = 0; i < items.length; i++) {
                order.push(parseInt(items[i].getAttribute('data-roomid'), 10));
                // Reorder the shades on the main page.
            }
            putJSONSync('/roomSortOrder', order, (err) => {
                if (err) ui.serviceError(err);
                else this.updateRoomsList();
            });
        });
    }
    setRepeaterList(addresses) {
        let divCfg = '';
        if (typeof addresses !== 'undefined') {
            for (let i = 0; i < addresses.length; i++) {
                divCfg += `<div class="somfyRepeater" data-address="${addresses[i]}"><div class="repeater-name">${addresses[i]}</div>`;
                divCfg += `<div class="button-outline" onclick="somfy.unlinkRepeater(${addresses[i]});"><i class="icss-trash"></i></div>`;
                divCfg += '</div>';
            }
        }
        document.getElementById('divRepeatList').innerHTML = divCfg;

    }
    setShadesList(shades) {
        let divCfg = '';
        let divCtl = '';
        shades.sort((a, b) => { return a.sortOrder - b.sortOrder });
        console.log(shades);
        let roomId = parseInt(document.getElementById('divRoomSelector').getAttribute('data-roomid'), 10)

        let vrList = document.getElementById('selVRMotor');
        let optGroup = document.getElementById('optgrpVRShades');
        if (typeof shades === 'undefined' || shades.length === 0) {
            if (optGroup && typeof optGroup !== 'undefined') optGroup.remove();
        }
        else {
            if (typeof optGroup === 'undefined' || !optGroup) {
                optGroup = document.createElement('optgroup');
                optGroup.setAttribute('id', 'optgrpVRShades');
                optGroup.setAttribute('label', 'Shades');
                vrList.appendChild(optGroup);
            }
            else {
                optGroup.innerHTML = '';
            }
        }

        for (let i = 0; i < shades.length; i++) {
            let shade = shades[i];
            let room = _rooms.find(x => x.roomId === shade.roomId) || { roomId: 0, name: '' };
            // On utilise st.svg défini dans ton nouveau tableau shadeTypes
            let st = this.shadeTypes.find(x => x.type === shade.shadeType) || { type: shade.shadeType, svg: 'svg-window-shade' };

            // Calcul de la position pour les icônes
            let pos = shade.flipPosition ? 100 - shade.position : shade.position;

            // SECTION CONFIGURATION (Liste de gauche)
            divCfg += `<div class="somfyShade shade-draggable" draggable="true" data-roomid="${shade.roomId}" data-mypos="${shade.myPos}" data-shadeid="${shade.shadeId}" data-remoteaddress="${shade.remoteAddress}" data-tilt="${shade.tiltType}" data-shadetype="${shade.shadeType}" data-flipposition="${shade.flipPosition ? 'true' : 'false'}">`;
            divCfg += `<div class="button-outline-svg" onclick="somfy.openEditShade(${shade.shadeId});"><svg class="icon-svg"><use xlink:href="#pen-edit"></use></svg></div>`;
            divCfg += '<div class="shade-name">';
            divCfg += `<div class="cfg-room">${room.name}</div>`;
            divCfg += `<div class="">${shade.name}</div>`;
            divCfg += '</div>'
            divCfg += `<span class="shade-address">${shade.remoteAddress}</span>`;
            divCfg += `<div class="button-outline-svg" onclick="somfy.deleteShade(${shade.shadeId});"><svg class="icon-svg"><use xlink:href="#trash-edit"></use></svg></div>`;
            divCfg += '</div>';

            // SECTION CONTROLE (Interface principale)
            divCtl += `<div class="somfyShadeCtl" style="${roomId === 0 || roomId === room.roomId ? '' : 'display:none'}" data-shadeId="${shade.shadeId}" data-roomid="${shade.roomId}" data-direction="${shade.direction}" data-remoteaddress="${shade.remoteAddress}" data-position="${shade.position}" data-target="${shade.target}" data-mypos="${shade.myPos}" data-mytiltpos="${shade.myTiltPos}" data-shadetype="${shade.shadeType}" data-tilt="${shade.tiltType}" data-flipposition="${shade.flipPosition ? 'true' : 'false'}"`;
            divCtl += ` data-windy="${(shade.flags & 0x10) === 0x10 ? 'true' : 'false'}" data-sunny=${(shade.flags & 0x20) === 0x20 ? 'true' : 'false'}`;
            if (shade.tiltType !== 0) {
                divCtl += ` data-tiltposition="${shade.tiltPosition}" data-tiltdirection="${shade.tiltDirection}" data-tilttarget="${shade.tiltTarget}"`;
            }
            divCtl += `><div class="shade-icon" data-shadeid="${shade.shadeId}" onclick="event.stopPropagation(); somfy.openSetPosition(${shade.shadeId});">`;

            // REMPLACEMENT : Appel du SVG générique pour TOUS les types
            divCtl += `
            <svg class="somfy-shade-icon-svg" data-shadeid="${shade.shadeId}" viewBox="0 0 48 48" style="--shade-position: ${pos}; --fpos: ${shade.position}%; width:48px; height:48px; vertical-align: top;">
            <use href="#${st.svg}"></use>
            </svg>`;

            divCtl += shade.tiltType !== 0 ? `<i class="icss-window-tilt" data-shadeid="${shade.shadeId}" data-tiltposition="${shade.tiltPosition}"></i></div>` : '</div>';
            divCtl += `<div class="indicator indicator-wind"><i class="icss-warning"></i></div><div class="indicator indicator-sun"><i class="icss-sun"></i></div>`;
            divCtl += `<div class="shade-name">`;
            divCtl += `<span class="shadectl-room">${room.name}</span>`;
            divCtl += `<span class="shadectl-name">${shade.name}</span>`;
            divCtl += `<span class="shadectl-mypos"><label class="my-pos"></label><span class="my-pos">${shade.myPos === -1 ? '---' : shade.myPos + '%'}</span><label class="my-pos-tilt"></label><span class="my-pos-tilt">${shade.myTiltPos === -1 ? '---' : shade.myTiltPos + '%'}</span >`;
            divCtl += '</div>';
            divCtl += `<div class="shadectl-buttons" data-shadeType="${shade.shadeType}">`;
            divCtl += `<div class="button-light cmd-button" data-cmd="light" data-shadeid="${shade.shadeId}" data-on="${shade.flags & 0x08 ? 'true' : 'false'}" style="${!shade.light ? 'display:none' : ''}"><i class="icss-lightbuld-c"></i><i class="icss-lightbulb-o"></i></div>`;
            divCtl += `<div class="button-sunflag cmd-button" data-cmd="sunflag" data-shadeid="${shade.shadeId}" data-on="${shade.flags & 0x01 ? 'true' : 'false'}" style="${!shade.sunSensor ? 'display:none' : ''}"><i class="icss-sun-c"></i><i class="icss-sun-o"></i></div>`;
            divCtl += `<div class="button-outline cmd-button btn-somfy-svg" data-cmd="my" data-shadeid="${shade.shadeId}" style="font-size:1.5em;padding:7px;"><svg><use href="#icon-my"></use></svg></div>`;
            divCtl += `<div class="button-outline cmd-button btn-somfy-svg" data-cmd="up" data-shadeid="${shade.shadeId}"><svg><use href="#icon-up"></use></svg></div>`;
            divCtl += `<div class="button-outline cmd-button btn-somfy-svg" data-cmd="down" data-shadeid="${shade.shadeId}"><svg><use href="#icon-down"></use></svg></div>`;
            divCtl += `<div class="button-outline cmd-button btn-somfy-svg-wide" style="width:127px;text-align:center;border-radius:33%;font-size:2em;padding:10px;" data-cmd="toggle" data-shadeid="${shade.shadeId}"><svg><use href="#icon-toggle"></use></svg></div>`;
            divCtl += '</div></div>';
            divCtl += '</div>';

            let opt = document.createElement('option');
            opt.innerHTML = shade.name;
            opt.setAttribute('data-address', shade.remoteAddress);
            opt.setAttribute('data-type', 'shade');
            opt.setAttribute('data-shadetype', shade.shadeType);
            opt.setAttribute('data-shadeid', shade.shadeId);
            opt.setAttribute('data-bitlength', shade.bitLength);
            optGroup.appendChild(opt);
        }

        let sopt = vrList.options[vrList.selectedIndex];
        document.getElementById('divVirtualRemote').setAttribute('data-bitlength', sopt ? sopt.getAttribute('data-bitlength') : 'none');
        document.getElementById('divShadeList').innerHTML = divCfg;
        let shadeControls = document.getElementById('divShadeControls');
        shadeControls.innerHTML = divCtl;
        this.checkEmptyState();

        // Gestion des événements (identique à l'original)
        let btns = shadeControls.querySelectorAll('div.cmd-button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('mouseup', (event) => {
                let cmd = event.currentTarget.getAttribute('data-cmd');
                let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                if (this.btnTimer) {
                    clearTimeout(this.btnTimer);
                    this.btnTimer = null;
                    if (new Date().getTime() - this.btnDown > 2000) event.preventDefault();
                    else this.sendCommand(shadeId, cmd);
                }
                else if (cmd === 'light') {
                    event.currentTarget.setAttribute('data-on', !makeBool(event.currentTarget.getAttribute('data-on')));
                }
                else if (cmd === 'sunflag') {
                    if (makeBool(event.currentTarget.getAttribute('data-on')))
                        this.sendCommand(shadeId, 'flag');
                    else
                        this.sendCommand(shadeId, 'sunflag');
                }
                else this.sendCommand(shadeId, cmd);
            }, true);

                btns[i].addEventListener('mousedown', (event) => {
                    if (this.btnTimer) {
                        clearTimeout(this.btnTimer);
                        this.btnTimer = null;
                    }
                    let elShade = event.currentTarget.closest('div.somfyShadeCtl');
                    let cmd = event.currentTarget.getAttribute('data-cmd');
                    let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                    let el = event.currentTarget.closest('.somfyShadeCtl');
                    this.btnDown = new Date().getTime();

                    if (cmd === 'my') {
                        if (parseInt(el.getAttribute('data-direction'), 10) === 0) {
                            this.btnTimer = setTimeout(() => {
                                this.openSetMyPosition(shadeId);
                            }, 2000);
                        }
                    }
                    else if (cmd === 'light') return;
                    else if (cmd === 'sunflag') return;
                    else if (makeBool(elShade.getAttribute('data-tilt'))) {
                        this.btnTimer = setTimeout(() => {
                            this.sendTiltCommand(shadeId, cmd);
                        }, 2000);
                    }
                }, true);

                btns[i].addEventListener('touchstart', (event) => {
                    if (this.btnTimer) {
                        clearTimeout(this.btnTimer);
                        this.btnTimer = null;
                    }
                    let elShade = event.currentTarget.closest('div.somfyShadeCtl');
                    let cmd = event.currentTarget.getAttribute('data-cmd');
                    let shadeId = parseInt(event.currentTarget.getAttribute('data-shadeid'), 10);
                    let el = event.currentTarget.closest('.somfyShadeCtl');
                    this.btnDown = new Date().getTime();
                    if (parseInt(el.getAttribute('data-direction'), 10) === 0) {
                        if (cmd === 'my') {
                            this.btnTimer = setTimeout(() => {
                                this.openSetMyPosition(shadeId);
                            }, 2000);
                        }
                        else {
                            if (makeBool(elShade.getAttribute('data-tilt'))) {
                                this.btnTimer = setTimeout(() => {
                                    this.sendTiltCommand(shadeId, cmd);
                                }, 2000);
                            }
                        }
                    }
                }, true);
        }

        this.setListDraggable(document.getElementById('divShadeList'), '.shade-draggable', (list) => {
            let items = list.querySelectorAll('.shade-draggable');
            let order = [];
            for (let i = 0; i < items.length; i++) {
                order.push(parseInt(items[i].getAttribute('data-shadeid'), 10));
            }
            putJSONSync('/shadeSortOrder', order, (err) => {
                for (let i = order.length - 1; i >= 0; i--) {
                    let el = shadeControls.querySelector(`.somfyShadeCtl[data-shadeid="${order[i]}"`);
                    if (el) {
                        shadeControls.prepend(el);
                    }
                }
            });
        });
    }

    setListDraggable(list, itemclass, onChanged) {
        let items = list.querySelectorAll(itemclass);
        let changed = false;
        let timerStart = null;
        let dragDiv = null;
        let fnDragStart = function (e) {
            //console.log({ evt: 'dragStart', e: e, this: this });
            if (typeof e.dataTransfer !== 'undefined') {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
                this.style.opacity = '0.4';
                this.classList.add('dragging');
            }
            else {
                timerStart = setTimeout(() => {
                    this.style.opacity = '0.4';
                    dragDiv = document.createElement('div');
                    dragDiv.innerHTML = this.innerHTML;
                    dragDiv.style.position = 'absolute';
                    dragDiv.classList.add('somfyShade');
                    dragDiv.style.left = `${this.offsetLeft}px`;
                    dragDiv.style.width = `${this.clientWidth}px`;
                    dragDiv.style.top = `${this.offsetTop}px`;
                    dragDiv.style.border = 'dotted 1px silver';
                    //dragDiv.style.background = 'gainsboro';
                    list.appendChild(dragDiv);
                    this.classList.add('dragging');
                    timerStart = null;
                }, 1000);
            }
            e.stopPropagation();
        };
        let fnDragEnter = function (e) {
            //console.log({ evt: 'dragEnter', e: e, this: this });
            this.classList.add('over');
        };
        let fnDragOver = function (e) {
            //console.log({ evt: 'dragOver', e: e, this: this });
            if (timerStart) {
                clearTimeout(timerStart);
                timerStart = null;
                return;
            }
            e.preventDefault();
            if (typeof e.dataTransfer !== 'undefined') e.dataTransfer.dropEffect = 'move';
            else if (dragDiv) {
                let rc = list.getBoundingClientRect();
                let pageY = e.targetTouches[0].pageY;
                let y = pageY - rc.top;
                if (y < 0) y = 0;
                else if (y > rc.height) y = rc.height;
                dragDiv.style.top = `${y}px`;
                // Now lets calculate which element we are over.
                let ndx = -1;
                for (let i = 0; i < items.length; i++) {
                    let irc = items[i].getBoundingClientRect();
                    if (pageY <= irc.bottom - (irc.height / 2)) {
                        ndx = i;
                        break;
                    }
                }
                let over = items[ndx];
                if (ndx < 0) [].forEach.call(items, (item) => { item.classList.remove('over') });
                else if (!over.classList.contains['over']) {
                    [].forEach.call(items, (item) => { item.classList.remove('over') });
                    over.classList.add('over');
                }
            }
            return false;
        };
        let fnDragLeave = function (e) {
            console.log({ evt: 'dragLeave', e: e, this: this });
            this.classList.remove('over');
        };
        let fnDrop = function (e) {
            // Shift around the items.
            console.log({ evt: 'drop', e: e, this: this });
            let elDrag = list.querySelector('.dragging');
            if (elDrag !== this) {
                let curr = 0, end = 0;
                for (let i = 0; i < items.length; i++) {
                    if (this === items[i]) end = i;
                    if (elDrag === items[i]) curr = i;
                }
                if (curr !== end) {
                    this.before(elDrag);
                    changed = true;
                }
            }
        };
        let fnDragEnd = function (e) {
            console.log({ evt: 'dragEnd', e: e, this: this });
            let elOver = list.querySelector('.over');
            [].forEach.call(items, (item) => { item.classList.remove('over') });
            this.style.opacity = '1';
            //overCounter = 0;
            if (timerStart) {
                clearTimeout(timerStart);
                timerStart = null;
            }
            if (dragDiv) {
                dragDiv.remove();
                dragDiv = null;
                if (elOver && typeof elOver !== 'undefined') fnDrop.call(elOver, e);
            }
            if (changed && typeof onChanged === 'function') {
                onChanged(list);
            }
            this.classList.remove('dragging');
        };
        [].forEach.call(items, (item) => {
            if (firmware.isMobile()) {
                item.addEventListener('touchstart', fnDragStart);
                //item.addEventListener('touchenter', fnDragEnter);
                item.addEventListener('touchmove', fnDragOver);
                item.addEventListener('touchleave', fnDragLeave);
                item.addEventListener('drop', fnDrop);
                item.addEventListener('touchend', fnDragEnd);

            }
            else {
                item.addEventListener('dragstart', fnDragStart);
                item.addEventListener('dragenter', fnDragEnter);
                item.addEventListener('dragover', fnDragOver);
                item.addEventListener('dragleave', fnDragLeave);
                item.addEventListener('drop', fnDrop);
                item.addEventListener('dragend', fnDragEnd);
            }
        });
    }
    setGroupsList(groups) {
        let divCfg = '';
        let divCtl = '';
        let vrList = document.getElementById('selVRMotor');
        // First get the optiongroup for the shades.
        let optGroup = document.getElementById('optgrpVRGroups');
        if (typeof groups === 'undefined' || groups.length === 0) {
            if (optGroup && typeof optGroup !== 'undefined') optGroup.remove();
        }
        else {
            if (typeof optGroup === 'undefined' || !optGroup) {
                optGroup = document.createElement('optgroup');
                optGroup.setAttribute('id', 'optgrpVRGroups');
                optGroup.setAttribute('label', 'Groups');
                vrList.appendChild(optGroup);
            }
            else {
                optGroup.innerHTML = '';
            }
        }
        let roomId = parseInt(document.getElementById('divRoomSelector').getAttribute('data-roomid'), 10)

        if (typeof groups !== 'undefined') {
            groups.sort((a, b) => { return a.sortOrder - b.sortOrder });


            for (let i = 0; i < groups.length; i++) {
                let group = groups[i];
                let room = _rooms.find(x => x.roomId === group.roomId) || { roomId: 0, name: '' };

                divCfg += `<div class="somfyGroup group-draggable" draggable="true" data-roomid="${group.roomId}" data-groupid="${group.groupId}" data-remoteaddress="${group.remoteAddress}">`;
                divCfg += `<div class="button-outline-svg" onclick="somfy.openEditGroup(${group.groupId});"><svg class="icon-svg"><use xlink:href="#pen-edit"></use></svg></div>`;
                //divCfg += `<i class="Group-icon" data-position="${Group.position || 0}%"></i>`;
                divCfg += '<div class="group-name">';
                divCfg += `<div class="cfg-room">${room.name}</div>`;
                divCfg += `<div class="">${group.name}</div>`;
                divCfg += '</div>'
                divCfg += `<span class="group-address">${group.remoteAddress}</span>`;
                divCfg += `<div class="button-outline-svg" onclick="somfy.deleteGroup(${group.groupId});"><svg class="icon-svg"><use xlink:href="#trash-edit"></use></svg></div>`;
                divCfg += '</div>';

                divCtl += `<div class="somfyGroupCtl" style="${roomId === 0 || roomId === room.roomId ? '' : 'display:none'}" data-groupId="${group.groupId}" data-roomid="${group.roomId}" data-remoteaddress="${group.remoteAddress}">`;
                divCtl += `<div class="group-name">`;
                divCtl += `<span class="groupctl-room">${room.name}</span>`;
                divCtl += `<span class="groupctl-name">${group.name}</span>`;
                divCtl += `<div class="groupctl-shades">`;
                if (typeof group.linkedShades !== 'undefined') {
                    divCtl += `<label>Members:</label><span>${group.linkedShades.length}`;
                    /*
                    for (let j = 0; j < group.linkedShades.length; j++) {
                        divCtl += '<span>';
                        if (j !== 0) divCtl += ', ';
                        divCtl += group.linkedShades[j].name;
                        divCtl += '</span>';
                    }
                    */
                }
                divCtl += '</div></div>';
                divCtl += `<div class="groupctl-buttons">`;
                divCtl += `<div class="button-sunflag cmd-button" data-cmd="sunflag" data-groupid="${group.groupId}" data-on="${group.flags & 0x20 ? 'true' : 'false'}" style="${!group.sunSensor ? 'display:none' : ''}"><i class="icss-sun-c"></i><i class="icss-sun-o"></i></div>`;
                divCtl += `<div class="button-outline cmd-button my-button" data-cmd="my" data-groupid="${group.groupId}" style="font-size:1.5em;padding:7px;"><span>my</span></div>`;
                divCtl += `<div class="button-outline cmd-button" data-cmd="up" data-groupid="${group.groupId}"><i class="icss-somfy-up"></i></div>`;
                divCtl += `<div class="button-outline cmd-button" data-cmd="down" data-groupid="${group.groupId}"><i class="icss-somfy-down" style="margin-top:-4px;"></i></div>`;
                divCtl += '</div></div>';
                let opt = document.createElement('option');
                opt.innerHTML = group.name;
                opt.setAttribute('data-address', group.remoteAddress);
                opt.setAttribute('data-type', 'group');
                opt.setAttribute('data-groupid', group.groupId);
                opt.setAttribute('data-bitlength', group.bitLength);
                optGroup.appendChild(opt);
            }
        }
        let sopt = vrList.options[vrList.selectedIndex];
        document.getElementById('divVirtualRemote').setAttribute('data-bitlength', sopt ? sopt.getAttribute('data-bitlength') : 'none');

        document.getElementById('divGroupList').innerHTML = divCfg;
        let groupControls = document.getElementById('divGroupControls');
        groupControls.innerHTML = divCtl;
        this.checkEmptyState();
        // Attach the timer for setting the My Position for the Group.
        let btns = groupControls.querySelectorAll('div.cmd-button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', (event) => {
                console.log(this);
                console.log(event);
                let groupId = parseInt(event.currentTarget.getAttribute('data-groupid'), 10);
                let cmd = event.currentTarget.getAttribute('data-cmd');
                if (cmd === 'sunflag') {
                    if (makeBool(event.currentTarget.getAttribute('data-on')))
                        this.sendGroupCommand(groupId, 'flag');
                    else
                        this.sendGroupCommand(groupId, 'sunflag');
                }
                else
                    this.sendGroupCommand(groupId, cmd);
            }, true);
        }
        this.setListDraggable(document.getElementById('divGroupList'), '.group-draggable', (list) => {
            // Get the shade order
            let items = list.querySelectorAll('.group-draggable');
            let order = [];
            for (let i = 0; i < items.length; i++) {
                order.push(parseInt(items[i].getAttribute('data-groupid'), 10));
                // Reorder the shades on the main page.
            }
            putJSONSync('/groupSortOrder', order, (err) => {
                for (let i = order.length - 1; i >= 0; i--) {
                    let el = groupControls.querySelector(`.somfyGroupCtl[data-groupid="${order[i]}"`);
                    if (el) {
                        groupControls.prepend(el);
                    }
                }
            });
        });

    }
    closeShadePositioners() {
        let ctls = document.querySelectorAll('.shade-positioner');
        for (let i = 0; i < ctls.length; i++) {
            console.log('Closing shade positioner');
            ctls[i].remove();
        }
    }
    openSetMyPosition(shadeId) {
        if (typeof shadeId === 'undefined') return;
        else {
            let shade = document.querySelector(`div.somfyShadeCtl[data-shadeid="${shadeId}"]`);
            if (shade) {
                this.closeShadePositioners();
                let currPos = parseInt(shade.getAttribute('data-position'), 10);
                let currTiltPos = parseInt(shade.getAttribute('data-tiltposition'), 10);
                let myPos = parseInt(shade.getAttribute('data-mypos'), 10);
                let tiltType = parseInt(shade.getAttribute('data-tilt'), 10);
                let myTiltPos = parseInt(shade.getAttribute('data-mytiltpos'), 10);
                let elname = shade.querySelector(`.shadectl-name`);
                let shadeName = elname.innerHTML;
                let html = `<div class="shade-name"><span>${shadeName}</span><div style="float:right;vertical-align:top;cursor:pointer;font-size:12px;margin-top:4px;">`;
                if (myPos >= 0 && tiltType !== 3)
                    html += `<div onclick="document.getElementById('slidShadeTarget').value = ${myPos}; document.getElementById('slidShadeTarget').dispatchEvent(new Event('change'));"><span style="display:inline-block;width:47px;">${tr("LBL_CURRENT")}</span><span>${myPos}</span><span>%</span></div>`;
                if (myTiltPos >= 0 && tiltType > 0)
                    html += `<div onclick="document.getElementById('slidShadeTiltTarget').value = ${myTiltPos}; document.getElementById('slidShadeTiltTarget').dispatchEvent(new Event('change'));"><span style="display:inline-block;width:47px;">${tr("LBL_TILT")}</span><span>${myTiltPos}</span><span>%</span></div>`;
                html += `</div></div>
                <div id="divShadeTarget">
                <input id="slidShadeTarget" name="shadeTarget" type="range" min="0" max="100" step="1" oninput="document.getElementById('spanShadeTarget').innerHTML = this.value;" />
                <label for="slidShadeTarget"><span>${tr("LBL_TARGET_POSITION")}</span><span><span id="spanShadeTarget" class="shade-target">${currPos}</span><span>%</span></span></label>
                </div>
                <div id="divTiltTarget" style="display:none;">
                <input id="slidShadeTiltTarget" name="shadeTiltTarget" type="range" min="0" max="100" step="1" oninput="document.getElementById('spanShadeTiltTarget').innerHTML = this.value;" />
                <label for="slidShadeTiltTarget"><span>${tr("LBL_TARGET_TILT")}</span><span><span id="spanShadeTiltTarget" class="shade-target">${currTiltPos}</span><span>%</span></span></label>
                </div>
                <hr></hr>
                <div style="text-align:right;width:100%;">
                <button id="btnSetMyPosition" type="button" style="width:auto;display:inline-block;padding-left:10px;padding-right:10px;margin-top:0px;margin-bottom:10px;margin-right:7px;">${tr("BT_SET_MY_POSITION")}</button>
                <button id="btnCancel" type="button" onclick="somfy.closeShadePositioners();" style="width:auto;display:inline-block;padding-left:10px;padding-right:10px;margin-top:0px;margin-bottom:10px;">${tr("BT_CANCEL_1")}</button>
                </div></div>`;
                let div = document.createElement('div');
                div.setAttribute('class', 'shade-positioner shade-my-positioner');
                div.setAttribute('data-shadeid', shadeId);
                div.style.height = 'auto';
                div.innerHTML = html;
                shade.appendChild(div);
                let elTarget = div.querySelector('input#slidShadeTarget');
                let elTiltTarget = div.querySelector('input#slidShadeTiltTarget');
                elTarget.value = currPos;
                elTiltTarget.value = currTiltPos;
                let elBtn = div.querySelector('button#btnSetMyPosition');
                if (tiltType === 3) {
                    div.querySelector('div#divTiltTarget').style.display = '';
                    div.querySelector('div#divShadeTarget').style.display = 'none';
                }
                else if (tiltType > 0) div.querySelector('div#divTiltTarget').style.display = '';
                let fnProcessChange = () => {
                    let pos = parseInt(elTarget.value, 10);
                    let tilt = parseInt(elTiltTarget.value, 10);
                    if (tiltType === 3 && tilt === myTiltPos) {
                        elBtn.innerHTML = tr('BT_CLEAR_MY_POSITION');
                        elBtn.style.background = 'orangered';
                    }
                    else if (pos === myPos && (tiltType === 0 || tilt === myTiltPos)) {
                        elBtn.innerHTML = tr('BT_CLEAR_MY_POSITION');
                        elBtn.style.background = 'orangered';
                    }
                    else {
                        elBtn.innerHTML = tr('BT_SET_MY_POSITION');
                        elBtn.style.background = '';
                    }
                    document.getElementById('spanShadeTiltTarget').innerHTML = tilt;
                    document.getElementById('spanShadeTarget').innerHTML = pos;
                };
                let fnSetMyPosition = () => {
                    let pos = parseInt(elTarget.value, 10);
                    let tilt = parseInt(elTiltTarget.value, 10);
                    somfy.sendShadeMyPosition(shadeId, pos, tilt);
                };
                fnProcessChange();
                elTarget.addEventListener('change', (event) => { fnProcessChange(); });
                elTiltTarget.addEventListener('change', (event) => { fnProcessChange(); });
                elBtn.addEventListener('click', (event) => { fnSetMyPosition(); });

            }
        }
    }
    sendShadeMyPosition(shadeId, pos, tilt) {
        console.log(`Sending My Position for shade id ${shadeId} to ${pos} and ${tilt}`);
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        putJSON('/setMyPosition', { shadeId: shadeId, pos: pos, tilt: tilt }, (err, response) => {
            this.closeShadePositioners();
            overlay.remove();
            console.log(response);
        });
    }
    setLinkedRemotesList(shade) {
        let divCfg = '';
        for (let i = 0; i < shade.linkedRemotes.length; i++) {
            let remote = shade.linkedRemotes[i];
            divCfg += `<div class="somfyLinkedRemote" data-shadeid="${shade.shadeId}" data-remoteaddress="${remote.remoteAddress}" style="text-align:center;">`;
            divCfg += `<span class="linkedremote-address" style="display:inline-block;width:127px;text-align:left;">${remote.remoteAddress}</span>`;
            divCfg += `<span class="linkedremote-code" style="display:inline-block;width:77px;text-align:left;">${remote.lastRollingCode}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.unlinkRemote(${shade.shadeId}, ${remote.remoteAddress});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';
        }
        document.getElementById('divLinkedRemoteList').innerHTML = divCfg;
    }
    setLinkedShadesList(group) {
        let divCfg = '';
        for (let i = 0; i < group.linkedShades.length; i++) {
            let shade = group.linkedShades[i];
            divCfg += `<div class="linked-shade" data-shadeid="${shade.shadeId}" data-remoteaddress="${shade.remoteAddress}">`;
            divCfg += `<span class="linkedshade-name">${shade.name}</span>`;
            divCfg += `<span class="linkedshade-address">${shade.remoteAddress}</span>`;
            divCfg += `<div class="button-outline" onclick="somfy.unlinkGroupShade(${group.groupId}, ${shade.shadeId});"><i class="icss-trash"></i></div>`;
            divCfg += '</div>';
        }
        document.getElementById('divLinkedShadeList').innerHTML = divCfg;
    }
    pinMaps = [
        { name: '', maxPins: 39, inputs: [0, 1, 6, 7, 8, 9, 10, 11, 37, 38], outputs: [3, 6, 7, 8, 9, 10, 11, 34, 35, 36, 37, 38, 39] },
        { name: 's2', maxPins: 46, inputs: [0, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 45], outputs: [0, 19, 20, 26, 27, 28, 29, 30, 31, 32, 45, 46]},
        { name: 's3', maxPins: 48, inputs: [19, 20, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32], outputs: [19, 20, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32] },
        { name: 'c3', maxPins: 21, inputs: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], outputs: [11, 12, 13, 14, 15, 16, 17, 21] }
    ];

    loadPins(type, sel, opt) {
        while (sel.firstChild) sel.removeChild(sel.firstChild);
        let cm = document.getElementById('divContainer').getAttribute('data-chipmodel');
        let pm = this.pinMaps.find(x => x.name === cm) || { name: '', maxPins: 39, inputs: [0, 1, 6, 7, 8, 9, 10, 11, 37, 38], outputs: [3, 6, 7, 8, 9, 10, 11, 34, 35, 36, 37, 38, 39] };
        //console.log({ cm: cm, pm: pm });
        for (let i = 0; i <= pm.maxPins; i++) {
            if (type.includes('in') && pm.inputs.includes(i)) continue;
            if (type.includes('out') && pm.outputs.includes(i)) continue;
            sel.options[sel.options.length] = new Option(`GPIO-${i > 9 ? i.toString() : '0' + i.toString()}`, i, typeof opt !== 'undefined' && opt === i);
        }
    }
    procGroupState(state) {
        console.log(state);
        let flags = document.querySelectorAll(`.button-sunflag[data-groupid="${state.groupId}"]`);
        for (let i = 0; i < flags.length; i++) {
            flags[i].style.display = state.sunSensor ? '' : 'none';
            flags[i].setAttribute('data-on', state.flags & 0x20 === 0x20 ? 'true' : 'false');
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    procShadeState(state) {
        console.log("Update state for:", state.shadeId, state);

        // 1. Mise à jour de tous les SVG (tous types : volets, stores, rideaux, etc.)
        // On cible la classe somfy-shade-icon-svg que nous avons mise dans setShadesList
        let svgIcons = document.querySelectorAll(`.somfy-shade-icon-svg[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < svgIcons.length; i++) {
            let pos = state.flipPosition ? 100 - state.position : state.position;

            // On envoie un NOMBRE PUR (sans %) pour le calc() CSS à l'intérieur du SVG
            svgIcons[i].style.setProperty('--shade-position', pos);
            // On garde --fpos au cas où certains de tes nouveaux SVG en auraient besoin
            svgIcons[i].style.setProperty('--fpos', `${state.position}%`);
        }

        // 2. Gestion du Tilt (inclinaison) - Si applicable
        if (state.tiltType !== 0) {
            let tilts = document.querySelectorAll(`.icss-window-tilt[data-shadeid="${state.shadeId}"]`);
            for (let i = 0; i < tilts.length; i++) {
                tilts[i].setAttribute('data-tiltposition', `${state.tiltPosition}`);
            }
        }

        // 3. Gestion des capteurs de soleil (Boutons de drapeaux)
        let flags = document.querySelectorAll(`.button-sunflag[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < flags.length; i++) {
            flags[i].style.display = state.sunSensor ? '' : 'none';
            flags[i].setAttribute('data-on', (state.flags & 0x01) === 0x01 ? 'true' : 'false');
        }

        // 4. Mise à jour des attributs des conteneurs SomfyShadeCtl
        let divs = document.querySelectorAll(`.somfyShadeCtl[data-shadeid="${state.shadeId}"]`);
        for (let i = 0; i < divs.length; i++) {
            divs[i].setAttribute('data-direction', state.direction);
            divs[i].setAttribute('data-position', state.position);
            divs[i].setAttribute('data-target', state.target);
            divs[i].setAttribute('data-mypos', state.myPos);
            divs[i].setAttribute('data-windy', (state.flags & 0x10) === 0x10 ? 'true' : 'false');
            divs[i].setAttribute('data-sunny', (state.flags & 0x20) === 0x20 ? 'true' : 'false');

            if (typeof state.myTiltPos !== 'undefined') {
                divs[i].setAttribute('data-mytiltpos', state.myTiltPos);
            } else {
                divs[i].setAttribute('data-mytiltpos', -1);
            }

            if (state.tiltType !== 0) {
                divs[i].setAttribute('data-tiltdirection', state.tiltDirection);
                divs[i].setAttribute('data-tiltposition', state.tiltPosition);
                divs[i].setAttribute('data-tilttarget', state.tiltTarget);
            }

            // Mise à jour des textes d'affichage (Position Favorite)
            let span = divs[i].querySelector('span.my-pos');
            if (span) {
                span.innerHTML = typeof state.myPos !== 'undefined' && state.myPos >= 0 ? `${state.myPos}%` : '---';
            }
            span = divs[i].querySelector('span.my-pos-tilt');
            if (span) {
                span.innerHTML = typeof state.myTiltPos !== 'undefined' && state.myTiltPos >= 0 ? `${state.myTiltPos}%` : '---';
            }
        }
    }
    procRemoteFrame(frame) {
        //console.log(frame);
        document.getElementById('spanRssi').innerHTML = frame.rssi;
        document.getElementById('spanFrameCount').innerHTML = parseInt(document.getElementById('spanFrameCount').innerHTML, 10) + 1;
        let lnk = document.getElementById('divLinking');
        if (lnk) {
            let obj = {
                shadeId: parseInt(lnk.dataset.shadeid, 10),
                remoteAddress: frame.address,
                rollingCode: frame.rcode
            };
            let overlay = ui.waitMessage(document.getElementById('divLinking'));
            putJSON('/linkRemote', obj, (err, shade) => {
                console.log(shade);
                overlay.remove();
                lnk.remove();
                this.setLinkedRemotesList(shade);
            });
        }
        else {
            lnk = document.getElementById('divLinkRepeater');
            if (lnk) {
                putJSONSync(`/linkRepeater`, {address:frame.address}, (err, repeaters) => {
                    lnk.remove();
                    if (err) ui.serviceError(err);
                    else this.setRepeaterList(repeaters);
                });
            }
        }
        let frames = document.getElementById('divFrames');
        let row = document.createElement('div');
        row.classList.add('frame-row');
        row.setAttribute('data-valid', frame.valid);
        // The socket is not sending the current date so we will snag the current receive date from
        // the browser.
        let fnFmtDate = (dt) => {
            return `${(dt.getMonth() + 1).fmt('00')}/${dt.getDate().fmt('00')} ${dt.getHours().fmt('00')}:${dt.getMinutes().fmt('00')}:${dt.getSeconds().fmt('00')}.${dt.getMilliseconds().fmt('000')}`;
        };
        let fnFmtTime = (dt) => {
            return `${dt.getHours().fmt('00')}:${dt.getMinutes().fmt('00')}:${dt.getSeconds().fmt('00')}.${dt.getMilliseconds().fmt('000')}`;
        };
        frame.time = new Date();
        let proto = '-S';
        switch (frame.proto) {
            case 1:
                proto = '-W';
                break;
            case 2:
                proto = '-V';
                break;
        }
        let html = `<span>${frame.encKey}</span><span>${frame.address}</span><span>${frame.command}<sup>${frame.stepSize ? frame.stepSize : ''}</sup></span><span>${frame.rcode}</span><span>${frame.rssi}dBm</span><span>${frame.bits}${proto}</span><span>${fnFmtTime(frame.time)}</span><div class="frame-pulses">`;
        for (let i = 0; i < frame.pulses.length; i++) {
            if (i !== 0) html += ',';
            html += `${frame.pulses[i]}`;
        }
        html += '</div>';
        row.innerHTML = html;
        frames.prepend(row);
        this.frames.push(frame);
    }
    JSONPretty(obj, indent = 2) {
        if (Array.isArray(obj)) {
            let output = '[';
            for (let i = 0; i < obj.length; i++) {
                if (i !== 0) output += ',\n';
                output += this.JSONPretty(obj[i], indent);
            }
            output += ']';
            return output;
        }
        else {
            let output = JSON.stringify(obj, function (k, v) {
                if (Array.isArray(v)) return JSON.stringify(v);
                return v;
            }, indent).replace(/\\/g, '')
                .replace(/\"\[/g, '[')
                .replace(/\]\"/g, ']')
                .replace(/\"\{/g, '{')
                .replace(/\}\"/g, '}')
                .replace(/\{\n\s+/g, '{');
            return output;
        }
    }
    framesToClipboard() {
        if (typeof navigator.clipboard !== 'undefined')
            navigator.clipboard.writeText(this.JSONPretty(this.frames, 2));
        else {
            let dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = this.JSONPretty(this.frames, 2);
            dummy.focus();
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
        }
    }
    onShadeTypeChanged(el) {
        let sel = document.getElementById('selShadeType');
        let tilt = parseInt(document.getElementById('selTiltType').value, 10);
        let svg = document.getElementById('svgShade'); // Cet élément doit être ou contenir ton SVG d'aperçu
        let type = parseInt(sel.value, 10);

        document.getElementById('somfyShade').setAttribute('data-shadetype', type);
        document.getElementById('divSomfyButtons').setAttribute('data-shadetype', type);

        let st = this.shadeTypes.find(x => x.type === type) || { type: type, svg: 'svg-window-shade' };

        // --- MISE À JOUR DE L'ICÔNE SVG ---
        // On cherche la balise <use> à l'intérieur de l'élément icoShade
        let useTag = svg.querySelector('use');
        if (useTag) {
            // On change la référence vers le nouveau SVG (ex: #svg-shutter)
            useTag.setAttribute('href', '#' + st.svg);
        }

        // --- GESTION DES OPTIONS D'AFFICHAGE (LIFT, TILT, SUN...) ---
        document.getElementById('divTiltSettings').style.display = st.tilt !== false ? '' : 'none';
        let lift = st.lift || false;
        if (lift && tilt == 3) lift = false;
        if (!st.tilt) tilt = 0;

        document.getElementById('fldTiltTime').parentElement.style.display = tilt ? 'inline-block' : 'none';
        document.getElementById('divLiftSettings').style.display = lift ? '' : 'none';
        document.getElementById('hrLiftSettings').style.display = lift ? '' : 'none';
        document.getElementById('divTiltSettings').style.display = st.tilt ? '' : 'none';

        // Icône de tilt dans les boutons d'aperçu
        let tiltIcon = document.querySelector('#divSomfyButtons i.icss-window-tilt');
        if (tiltIcon) tiltIcon.style.display = tilt ? '' : 'none';

        document.getElementById('divSunSensor').style.display = st.sun ? '' : 'none';
        document.getElementById('divLightSwitch').style.display = st.light ? '' : 'none';
        document.getElementById('divFlipPosition').style.display = st.fpos ? '' : 'none';
        document.getElementById('divFlipCommands').style.display = st.fcmd ? '' : 'none';

        if (!st.light) document.getElementById('cbHasLight').checked = false;
        if (!st.sun) document.getElementById('cbHasSunsensor').checked = false;
    }

    onShadeBitLengthChanged(el) {
        document.getElementById('somfyShade').setAttribute('data-bitlength', el.value);
        //document.getElementById('divStepSettings').style.display = parseInt(el.value, 10) === 80 ? '' : 'none';
    }
    onShadeProtoChanged(el) {
        document.getElementById('somfyShade').setAttribute('data-proto', el.value);
    }
    openEditRoom(roomId) {
        
        if (typeof roomId === 'undefined') {
            document.getElementById('btnSaveRoom').innerText = tr('BT_ADD_ROOM');
            getJSONSync('/getNextRoom', (err, room) => {
                document.getElementById('spanRoomId').innerText = '*';
                if (err) ui.serviceError(err);
                else {
                    console.log(room);
                    let elRoom = document.getElementById('somfyRoom');
                    room.name = '';
                    ui.toElement(elRoom, room);
                    this.showEditRoom(true);
                }
            });
        }
        //************************************************************************************************************************
        else {
            document.getElementById('btnSaveRoom').innerText = tr('BT_SAVE_ROOM');
            getJSONSync(`/room?roomId=${roomId}`, (err, room) => {
                if (err) ui.serviceError(err);
                else {
                    console.log(room);
                    document.getElementById('spanRoomId').innerText = roomId;
                    ui.toElement(document.getElementById('somfyRoom'), room);
                    this.showEditRoom(true);
                    document.getElementById('btnSaveRoom').style.display = 'inline-block';
                }
            });

        }
    }
    openEditShade(shadeId) {
        if (typeof shadeId === 'undefined') {
            getJSONSync('/getNextShade', (err, shade) => {
                document.getElementById('btnPairShade').style.display = 'none';
                document.getElementById('btnUnpairShade').style.display = 'none';
                document.getElementById('btnLinkRemote').style.display = 'none';
                document.getElementById('btnSaveShade').innerText = tr('BT_SAVE_SHADE');
                document.getElementById('spanShadeId').innerText = '*';
                document.getElementById('divLinkedRemoteList').innerHTML = '';
                document.getElementById('btnSetRollingCode').style.display = 'none';

                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(shade);
                    let elShade = document.getElementById('somfyShade');
                    shade.name = '';
                    shade.downTime = shade.upTime = 10000;
                    shade.tiltTime = 7000;
                    shade.bitLength = 56;
                    shade.flipCommands = shade.flipPosition = false;
                    ui.toElement(elShade, shade);
                    this.showEditShade(true);
                    elShade.setAttribute('data-bitlength', shade.bitLength);

                    // Initialisation du SVG d'aperçu pour un nouveau volet
                    let svg = document.getElementById('svgShade');
                    if (svg) {
                        svg.style.setProperty('--shade-position', 0);
                        svg.style.setProperty('--fpos', '0%');
                    }
                }
            });
        }
        else {
            // Chargement d'un volet existant
            document.getElementById('btnSaveShade').style.display = 'none';
            document.getElementById('btnPairShade').style.display = 'none';
            document.getElementById('btnUnpairShade').style.display = 'none';
            document.getElementById('btnLinkRemote').style.display = 'none';

            document.getElementById('btnSaveShade').innerText = tr('BT_SAVE_SHADE');
            document.getElementById('spanShadeId').innerText = shadeId;
            getJSONSync(`/shade?shadeId=${shadeId}`, (err, shade) => {
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(shade);
                    ui.toElement(document.getElementById('somfyShade'), shade);
                    this.showEditShade(true);
                    document.getElementById('btnSaveShade').style.display = 'inline-block';
                    document.getElementById('btnLinkRemote').style.display = '';

                    // On met à jour le type d'icône (le symbole <use>)
                    this.onShadeTypeChanged(document.getElementById('selShadeType'));

                    // --- Mise à jour de l'aperçu SVG ---
                    let svg = document.getElementById('svgShade');
                    if (svg) {
                        let pos = shade.flipPosition ? 100 - shade.position : shade.position;
                        // On envoie le nombre pur pour le calc() du SVG
                        svg.style.setProperty('--shade-position', pos);
                        svg.style.setProperty('--fpos', `${shade.position}%`);
                        svg.setAttribute('data-shadeid', shade.shadeId);
                    }

                    // --- Mise à jour du Tilt (Texte overlay) ---
                    // On cherche le i.icss-window-tilt qui est le frère du SVG ou dans le même parent
                    let tilt = document.querySelector('#divSomfyButtons i.icss-window-tilt');
                    if (tilt) {
                        tilt.style.display = shade.tiltType !== 0 ? '' : 'none';
                        tilt.setAttribute('data-tiltposition', shade.tiltPosition);
                        tilt.setAttribute('data-shadeid', shade.shadeId);
                    }

                    somfy.onShadeBitLengthChanged(document.getElementById('selShadeBitLength'));
                    somfy.onShadeProtoChanged(document.getElementById('selShadeProto'));
                    document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                    if (shade.paired) {
                        document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    }
                    else {
                        document.getElementById('btnPairShade').style.display = 'inline-block';
                    }
                    this.setLinkedRemotesList(shade);
                }
            });
        }
    }
    openEditGroup(groupId) {
        document.getElementById('btnLinkShade').style.display = 'none';
        if (typeof groupId === 'undefined') {
            getJSONSync('/getNextGroup', (err, group) => {
                document.getElementById('btnSaveGroup').innerText = tr('BT_ADD_GROUP');
                document.getElementById('spanGroupId').innerText = '*';
                document.getElementById('divLinkedShadeList').innerHTML = '';
                //document.getElementById('btnSetRollingCode').style.display = 'none';
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(group);
                    group.name = '';
                    group.flipCommands = false;
                    ui.toElement(document.getElementById('somfyGroup'), group);
                    this.showEditGroup(true);
                }
            });
        }
        else {
            // Load up an existing group.
            document.getElementById('btnSaveGroup').style.display = 'none';
            document.getElementById('btnSaveGroup').innerText = tr('BT_SAVE_GROUP');
            document.getElementById('spanGroupId').innerText = groupId;
            getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
                if (err) {
                    ui.serviceError(err);
                }
                else {
                    console.log(group);
                    ui.toElement(document.getElementById('somfyGroup'), group);
                    this.showEditGroup(true);
                    document.getElementById('btnSaveGroup').style.display = 'inline-block';
                    document.getElementById('btnLinkShade').style.display = '';
                    document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                    this.setLinkedShadesList(group);
                }
            });
        }
    }
    showEditRoom(bShow) {
        let el = document.getElementById('divLinking');
        if (el) el.remove();
        el = document.getElementById('divLinkRepeater');
        if (el) el.remove();
        el = document.getElementById('divPairing');
        if (el) el.remove();
        el = document.getElementById('divRollingCode');
        if (el) el.remove();
        el = document.getElementById('somfyRoom');
        if (el) el.style.display = bShow ? '' : 'none';
        el = document.getElementById('divRoomListContainer');
        if (el) el.style.display = bShow ? 'none' : '';
        if (bShow) {
            this.showEditGroup(false);
            this.showEditShade(false);
        }
    }
    showEditShade(bShow) {
        let el = document.getElementById('divLinking');
        if (el) el.remove();
        el = document.getElementById('divLinkRepeater');
        if (el) el.remove();
        el = document.getElementById('divPairing');
        if (el) el.remove();
        el = document.getElementById('divRollingCode');
        if (el) el.remove();
        el = document.getElementById('somfyShade');
        if (el) el.style.display = bShow ? '' : 'none';
        el = document.getElementById('divShadeListContainer');
        if (el) el.style.display = bShow ? 'none' : '';
        if (bShow) {
            this.showEditGroup(false);
            this.showEditRoom(false);
        }
    }
    showEditGroup(bShow) {
        let el = document.getElementById('divLinking');
        if (el) el.remove();
        el = document.getElementById('divLinkRepeater');
        if (el) el.remove();
        el = document.getElementById('divPairing');
        if (el) el.remove();
        el = document.getElementById('divRollingCode');
        if (el) el.remove();
        el = document.getElementById('somfyGroup');
        if (el) el.style.display = bShow ? '' : 'none';
        el = document.getElementById('divGroupListContainer');
        if (el) el.style.display = bShow ? 'none' : '';
        if (bShow) {
            this.showEditRoom(false);
            this.showEditShade(false);
        }

    }
    saveRoom() {
        let roomId = parseInt(document.getElementById('spanRoomId').innerText, 10);
        let obj = ui.fromElement(document.getElementById('somfyRoom'));
        let valid = true;
        if (valid && (typeof obj.name !== 'string' || obj.name === '' || obj.name.length > 20)) {
            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_ROOM_NAME_INVALID'));
            valid = false;
        }
        if (valid) {
            if (isNaN(roomId) || roomId === 0) {
                // We are adding.
                putJSONSync('/addRoom', obj, (err, room) => {
                    if (err) {
                        ui.serviceError(err);
                        console.log(err);
                    }
                    else {
                        console.log(room);
                        document.getElementById('spanRoomId').innerText = room.roomId;
                        document.getElementById('btnSaveRoom').innerText = tr('BT_SAVE_ROOM');
                        document.getElementById('btnSaveRoom').style.display = 'inline-block';
                        this.updateRoomsList();
                    }
                });
            }
            else {
                obj.roomId = roomId;
                putJSONSync('/saveRoom', obj, (err, room) => {
                    if (err) ui.serviceError(err);
                    else this.updateRoomsList();
                    console.log(room);
                });
            }
        }
    }
    saveShade() {
        let shadeId = parseInt(document.getElementById('spanShadeId').innerText, 10);
        let obj = ui.fromElement(document.getElementById('somfyShade'));
        let valid = true;

        // --- VALIDATIONS ---
        if (valid && (isNaN(obj.remoteAddress) || obj.remoteAddress < 1 || obj.remoteAddress > 16777215)) {
            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_REMOTE_ADDRESS_INVALID'));
            valid = false;
        }
        if (valid && (typeof obj.name !== 'string' || obj.name === '' || obj.name.length > 20)) {
            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_SHADE_NAME_INVALID'));
            valid = false;
        }
        if (valid && (isNaN(obj.upTime) || obj.upTime < 1 || obj.upTime > 4294967295)) {
            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_UP_TIME_INVALID'));
            valid = false;
        }
        if (valid && (isNaN(obj.downTime) || obj.downTime < 1 || obj.downTime > 4294967295)) {
            ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_DOWN_TIME_INVALID'));
            valid = false;
        }

        // --- GESTION PROTOCOLES / GPIO ---
        if (obj.proto === 8 || obj.proto === 9) {
            switch (obj.shadeType) {
                case 5: // Garage 1-button
                case 14: // Gate left 1-button
                case 15: // Gate center 1-button
                case 16: // Gate right 1-button
                case 10: // Two button dry contact
                    if (obj.proto !== 9 && obj.gpioUp === obj.gpioDown) {
                        ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_GPIO_UP_DOWN_NOT_UNIQUE'));
                        valid = false;
                    }
                    break;
                case 9: // Dry contact.
                    break;
                default:
                    if (obj.gpioUp === obj.gpioDown) {
                        ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_GPIO_UP_DOWN_NOT_UNIQUE'));
                        valid = false;
                    }
                    else if (obj.proto === 9 && (obj.gpioMy === obj.gpioUp || obj.gpioMy === obj.gpioDown)) {
                        ui.errorMessage(document.getElementById('divSomfySettings'), tr('ERR_GPIO_UP_DOWN_MY_NOT_UNIQUE'));
                        valid = false;
                    }
                    break;
            }
        }

        // --- ENREGISTREMENT ---
        if (valid) {
            if (isNaN(shadeId) || shadeId >= 255) {
                // AJOUT D'UN NOUVEAU VOLET
                putJSONSync('/addShade', obj, (err, shade) => {
                    if (err) {
                        ui.serviceError(err);
                        console.log(err);
                    }
                    else {
                        console.log(shade);
                        document.getElementById('spanShadeId').innerText = shade.shadeId;
                        document.getElementById('btnSaveShade').innerText = tr('BT_SAVE_SHADE');
                        document.getElementById('btnSaveShade').style.display = 'inline-block';
                        document.getElementById('btnLinkRemote').style.display = '';
                        document.getElementById(shade.paired ? 'btnUnpairShade' : 'btnPairShade').style.display = 'inline-block';
                        document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                        this.updateShadeList();
                    }
                });
            }
            else {
                // MISE À JOUR D'UN VOLET EXISTANT
                obj.shadeId = shadeId;
                putJSONSync('/saveShade', obj, (err, shade) => {
                    if (err) {
                        ui.serviceError(err);
                    } else {
                        this.updateShadeList();
                        console.log("Shade saved:", shade);

                        // --- MISE À JOUR DE L'APERÇU (svgShade remplace icoShade) ---
                        let svg = document.getElementById('svgShade');
                        if (svg) {
                            let pos = shade.flipPosition ? 100 - shade.position : shade.position;
                            let tpos = shade.flipPosition ? 100 - shade.tiltPosition : shade.tiltPosition;

                            // On envoie des nombres purs pour les calculs SVG
                            svg.style.setProperty('--shade-position', pos);
                            svg.style.setProperty('--fpos', `${shade.position}%`);
                            svg.style.setProperty('--tilt-position', tpos);
                            svg.setAttribute('data-shadeid', shade.shadeId);

                            // Mise à jour de l'overlay de texte Tilt si présent
                            let tilt = svg.parentElement.querySelector('i.icss-window-tilt');
                            if (tilt) {
                                tilt.style.display = shade.tiltType !== 0 ? '' : 'none';
                                tilt.setAttribute('data-tiltposition', shade.tiltPosition);
                                tilt.setAttribute('data-shadeid', shade.shadeId);
                            }
                        }
                    }
                });
            }
        }
    }
    saveGroup() {
        let groupId = parseInt(document.getElementById('spanGroupId').innerText, 10);
        let obj = ui.fromElement(document.getElementById('somfyGroup'));
        let valid = true;
        if (valid && (isNaN(obj.remoteAddress) || obj.remoteAddress < 1 || obj.remoteAddress > 16777215)) {
            ui.errorMessage(tr('ERR_REMOTE_ADDRESS_INVALID'));
            valid = false;
        }
        if (valid && (typeof obj.name !== 'string' || obj.name === '' || obj.name.length > 20)) {
            ui.errorMessage(tr('ERR_SHADE_NAME_INVALID'));
            valid = false;
        }
        if (valid) {
            if (isNaN(groupId) || groupId >= 255) {
                // We are adding.
                putJSONSync('/addGroup', obj, (err, group) => {
                    if (err) ui.serviceError(err);
                    else {
                        console.log(group);
                        document.getElementById('spanGroupId').innerText = group.groupId;
                        document.getElementById('btnSaveGroup').innerText = tr('BT_SAVE_GROUP');
                        document.getElementById('btnSaveGroup').style.display = 'inline-block';
                        document.getElementById('btnLinkShade').style.display = '';
                        //document.getElementById('btnSetRollingCode').style.display = 'inline-block';
                        this.updateGroupList();
                    }
                });
            }
            else {
                obj.groupId = groupId;
                putJSONSync('/saveGroup', obj, (err, shade) => {
                    if (err) ui.serviceError(err);
                    else this.updateGroupList();
                    console.log(shade);
                });
            }
        }
    }
    updateRoomsList() {
        getJSONSync('/rooms', (err, shades) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                this.setRoomsList(shades);
                
            }
        });
    }
    updateShadeList() {
        getJSONSync('/shades', (err, shades) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                //console.log(shades);
                // Create the shades list.
                this.setShadesList(shades);
            }
        });
    }
    updateGroupList() {
        getJSONSync('/groups', (err, groups) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else {
                console.log(groups);
                // Create the groups list.
                this.setGroupsList(groups);
            }
        });
    }
    updateRepeatList() {
        getJSONSync('/repeaters', (err, repeaters) => {
            if (err) {
                console.log(err);
                ui.serviceError(err);
            }
            else this.setRepeaterList(repeaters);
        });
    }
    deleteRoom(roomId) {
        let valid = true;
        if (isNaN(roomId) || roomId >= 255 || roomId <= 0) {
            ui.errorMessage(tr('ERR_ROOM_ID_REQUIRED'));
            valid = false;
        }
        if (valid) {
            getJSONSync(`/room?roomId=${roomId}`, (err, room) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage(tr('PROMPT_DELETE_ROOM'), () => {
                        ui.clearErrors();
                        putJSONSync('/deleteRoom', { roomId: roomId }, (err, room) => {
                            prompt.remove();
                            if (err) ui.serviceError(err);
                            else
                                this.updateRoomsList();
                        });
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<p>${tr("PROMPT_DELETE_ROOM_WARNING")}</p>`;
                }
            });
        }
    }
    deleteShade(shadeId) {
        let valid = true;
        if (isNaN(shadeId) || shadeId >= 255 || shadeId <= 0) {
            ui.errorMessage(tr('ERR_SHADE_ID_REQUIRED'));
            valid = false;
        }
        if (valid) {
            getJSONSync(`/shade?shadeId=${shadeId}`, (err, shade) => {
                if (err) ui.serviceError(err);
                else if (shade.inGroup) ui.errorMessage(tr('ERR_SHADE_IN_GROUP'));
                else {
                    let prompt = ui.promptMessage(tr('PROMPT_DELETE_SHADE'), () => {
                        ui.clearErrors();
                        putJSONSync('/deleteShade', { shadeId: shadeId }, (err, shade) => {
                            this.updateShadeList();
                            prompt.remove;
                        });
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<p>${tr("PROMPT_DELETE_SHADE_WARNING")}</p><p>${tr("PROMPT_DELETE_SHADE_CONFIRM").replace("{SHADE_NAME}", shade.name)}</p>`;
                }
            });
        }
    }
    deleteGroup(groupId) {
        let valid = true;
        if (isNaN(groupId) || groupId >= 255 || groupId <= 0) {
            ui.errorMessage(tr('ERR_INVALID_GROUP_ID'));
            valid = false;
        }
        if (valid) {
            getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
                if (err) ui.serviceError(err);
                else {
                    if (group.linkedShades.length > 0) {
                        ui.errorMessage(tr('ERR_GROUP_NOT_EMPTY'));
                    }
                    else {
                        let prompt = ui.promptMessage(tr('PROMPT_DELETE_GROUP'), () => {
                            putJSONSync('/deleteGroup', { groupId: groupId }, (err, g) => {
                                if (err) ui.serviceError(err);
                                this.updateGroupList();
                                prompt.remove();
                            });

                        });
                        prompt.querySelector('.sub-message').innerHTML = `<p>${tr("PROMPT_DELETE_GROUP_CONFIRM").replace("{GROUP_NAME}", group.name)}</p>`;

                    }
                }
            });
        }
    }
    sendPairCommand(shadeId) {
        putJSON('/pairShade', { shadeId: shadeId }, (err, shade) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(shade);
                document.getElementById('somfyMain').style.display = 'none';
                document.getElementById('somfyShade').style.display = '';
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';

                // Mise à jour des champs du formulaire
                document.getElementsByName('shadeAddress')[0].value = shade.remoteAddress;
                document.getElementsByName('shadeName')[0].value = shade.name;
                document.getElementsByName('shadeUpTime')[0].value = shade.upTime;
                document.getElementsByName('shadeDownTime')[0].value = shade.downTime;

                // --- Mise à jour de l'aperçu SVG ---
                let svg = document.getElementById('svgShade');
                if (svg) {
                    let pos = shade.flipPosition ? 100 - shade.position : shade.position;

                    // On envoie le nombre pur pour le calc() interne du SVG
                    svg.style.setProperty('--shade-position', pos);
                    svg.style.setProperty('--fpos', `${shade.position}%`);
                    svg.setAttribute('data-shadeid', shade.shadeId);
                }

                // Gestion de l'affichage des boutons Pair/Unpair
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }

                this.setLinkedRemotesList(shade);

                // Suppression de la fenêtre modale de pairing
                let divPairing = document.getElementById('divPairing');
                if (divPairing) divPairing.remove();
            }
        });
    }
    sendUnpairCommand(shadeId) {
        putJSON('/unpairShade', { shadeId: shadeId }, (err, shade) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(shade);
                document.getElementById('somfyMain').style.display = 'none';
                document.getElementById('somfyShade').style.display = '';
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';

                // Mise à jour des champs du formulaire
                document.getElementsByName('shadeAddress')[0].value = shade.remoteAddress;
                document.getElementsByName('shadeName')[0].value = shade.name;
                document.getElementsByName('shadeUpTime')[0].value = shade.upTime;
                document.getElementsByName('shadeDownTime')[0].value = shade.downTime;

                // --- Mise à jour de l'aperçu SVG (svgShade remplace icoShade) ---
                let svg = document.getElementById('svgShade');
                if (svg) {
                    let pos = shade.flipPosition ? 100 - shade.position : shade.position;

                    // On envoie le nombre pur pour le calc() interne du SVG
                    svg.style.setProperty('--shade-position', pos);
                    svg.style.setProperty('--fpos', `${shade.position}%`);
                    svg.setAttribute('data-shadeid', shade.shadeId);
                }

                // Gestion de l'affichage des boutons Pair/Unpair (État après dissociation)
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }

                this.setLinkedRemotesList(shade);

                // Suppression de la fenêtre modale de pairing
                let divPairing = document.getElementById('divPairing');
                if (divPairing) divPairing.remove();
            }
        });
    }
    setRollingCode(shadeId, rollingCode) {
        putJSONSync('/setRollingCode', { shadeId: shadeId, rollingCode: rollingCode }, (err, shade) => {
            if (err) ui.serviceError(document.getElementById('divSomfySettings'), err);
            else {
                let dlg = document.getElementById('divRollingCode');
                if (dlg) dlg.remove();
            }
        });
    }
    openSetRollingCode(shadeId) {
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        getJSON(`/shade?shadeId=${shadeId}`, (err, shade) => {
            overlay.remove();
            if (err) {
                ui.serviceError(err);
            }
            else {
                console.log(shade);
                let div = document.createElement('div');
                div.setAttribute('id', 'divRollingCode');
                let html = `<div class="instructions" data-shadeid="${shadeId}">
                <div style="width:100%;color:red;text-align:center;font-weight:bold;"><span style="background:yellow;padding:10px;display:inline-block;border-radius:5px;background:white;">${tr("ROLLING_CODE_WARNING_TITLE")}</span></div>
                <hr style="width:100%;margin:0px;">
                <p style="font-size:14px;">${tr("ROLLING_CODE_WARNING_DESC_1")}</p>
                <p style="font-size:14px;">${tr("ROLLING_CODE_WARNING_DESC_2")}</p>
                <div class="field-group" style="border-radius:5px;background:white;width:50%;margin-left:25%;text-align:center">
                <input id="fldNewRollingCode" min="0" max="65535" name="newRollingCode" type="number" length="12" style="text-align:center;font-size:24px;" placeholder="${tr("PL_ROLLING_CODE_NEW")}" value="${shade.lastRollingCode}">
                <label for="fldNewRollingCode">${tr("BT_ROLLING_CODE")}</label>
                </div>
                <div class="button-container">
                <button id="btnChangeRollingCode" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:red;" onclick="somfy.setRollingCode(${shadeId}, parseInt(document.getElementById('fldNewRollingCode').value, 10));">${tr("BT_SET_ROLLING_CODE")}</button>
                <button id="btnCancel" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;background:lawngreen;color:gray" onclick="document.getElementById('divRollingCode').remove();">${tr("BT_CANCEL_1")}</button>
                </div>`;
                div.innerHTML = html;
                document.getElementById('divContainer').appendChild(div);
            }
        });
    }
    setPaired(shadeId, paired) {
        let obj = { shadeId: shadeId, paired: paired || false };
        let div = document.getElementById('divPairing');
        let overlay = typeof div === 'undefined' ? undefined : ui.waitMessage(div);
        putJSONSync('/setPaired', obj, (err, shade) => {
            if (overlay) overlay.remove();
            if (err) {
                console.log(err);
                ui.errorMessage(err.message);
            }
            else if (div) {
                console.log(shade);
                this.showEditShade(true);
                document.getElementById('btnSaveShade').style.display = 'inline-block';
                document.getElementById('btnLinkRemote').style.display = '';
                if (shade.paired) {
                    document.getElementById('btnUnpairShade').style.display = 'inline-block';
                    document.getElementById('btnPairShade').style.display = 'none';
                }
                else {
                    document.getElementById('btnPairShade').style.display = 'inline-block';
                    document.getElementById('btnUnpairShade').style.display = 'none';
                }
                this.setLinkedRemotesList(shade);
                div.remove();
            }
        });
    }
    pairShade(shadeId) {
        let shadeType = parseInt(document.getElementById('somfyShade').getAttribute('data-shadetype'), 10);
        let div = document.createElement('div');

        // 1. On ouvre la div principale
        let html = `<div id="divPairing" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">`;

        // 2. On utilise le IF en JavaScript (en dehors des backticks)
        if (shadeType === 5 || shadeType === 6) {
            html += `
            <div>${tr("PAIR_GARAGE_TITLE")}</div>
            <hr style="width:100%;margin:0px;">
            <ul style="width:100%;margin:0px;padding-left:20px;font-size:14px;">
            <li>${tr("PAIR_GARAGE_STEP_1")}</li>
            <li>${tr("PAIR_GARAGE_STEP_2")}</li>
            <li>${tr("PAIR_GARAGE_STEP_3")}</li>
            </ul>
            <div class="button-container">
            <button id="btnSendPairing" class="bouton" type="button">${tr("BT_PROG")}</button>
            <button id="btnMarkPaired" class="bouton" type="button" onclick="somfy.setPaired(${shadeId}, true);">${tr("BT_GATE_PAIRED")}</button>
            <button id="btnStopPairing" class="bouton" type="button">${tr("BT_CLOSE")}</button>
            </div>`;
        }
        else {
            html += `
            <div>${tr("PAIR_SHADE_TITLE")}</div>
            <hr style="width:100%;margin:0px;">
            <ul style="width:100%;margin:0px;padding-left:20px;font-size:14px;">
            <li>${tr("PAIR_SHADE_STEP_1")}</li>
            <li>${tr("PAIR_SHADE_STEP_2")}</li>
            <li>${tr("PAIR_SHADE_STEP_3")}</li>
            <li>${tr("PAIR_SHADE_STEP_4")}</li>
            <li>${tr("PAIR_SHADE_STEP_5")}</li>
            </ul>
            <div class="button-container">
            <button id="btnSendPairing" class="bouton" type="button">${tr("BT_PROG")}</button>
            <button id="btnMarkPaired" class="bouton" type="button" onclick="somfy.setPaired(${shadeId}, true);">${tr("BT_SHADE_PAIRED")}</button>
            <button id="btnStopPairing" class="bouton" type="button">${tr("BT_CLOSE")}</button>
            </div>`;
        }
        let fnRepeatProg = (err, shade) => {
            if (this.btnTimer) {
                clearTimeout(this.btnTimer);
                this.btnTimer = null;
            }
            if (err) return;
            if (mouseDown) {
                somfy.sendCommandRepeat(shadeId, 'prog', null, fnRepeatProg);
            }
        }
        div.innerHTML = html;

        document.getElementById('divContainer').appendChild(div);

        document.getElementById('btnStopPairing').addEventListener('click', (event) => {
            console.log(this);
            console.log(event);
            console.log('close');
            if (this.btnTimer) {
                clearInterval(this.btnTimer);
                this.btnTimer = null;
            }
            document.getElementById('divPairing').remove();
        });
        let btn = document.getElementById('btnSendPairing');
        btn.addEventListener('mousedown', (event) => {
            console.log(this);
            console.log(event);
            console.log('mousedown');
            somfy.sendCommand(shadeId, 'prog', null, (err, shade) => { fnRepeatProg(err, shade); });
        }, true);
        btn.addEventListener('touchstart', (event) => {
            console.log(this);
            console.log(event);
            console.log('touchstart');
            somfy.sendCommand(shadeId, 'prog', null, (err, shade) => { fnRepeatProg(err, shade); });
        }, true);
        return div;
    }

//*******************************************************************************************************************************************************************

    unpairShade(shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divPairing" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">
        <div>${tr("UNPAIR_SHADE_DESC_1")}</div>
        <hr style="width:100%;margin:0px;">
        <ul style="width:100%;margin:0px;padding-left:20px;font-size:14px;">
        <li>${tr("UNPAIR_SHADE_STEP_1")}</li>
        <li>${tr("UNPAIR_SHADE_STEP_2")}</li>
        <li>${tr("UNPAIR_SHADE_STEP_3")}</li>
        <li>${tr("UNPAIR_SHADE_STEP_4")}</li>
        <li>${tr("UNPAIR_SHADE_STEP_5")}</li>
        <li>${tr("UNPAIR_SHADE_STEP_6")}</li>
        </ul>
        <div class="button-container">
        <button id="btnSendUnpairing" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;">${tr("BT_PROG")}</button>
        <button id="btnMarkPaired" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:inline-block;" onclick="somfy.setPaired(${shadeId}, false);">${tr("BT_SHADE_UNPAIRED")}</button>
        <button id="btnStopUnpairing" class="bouton" type="button" style="padding-left:20px;padding-right:20px;display:inline-block" onclick="document.getElementById('divPairing').remove();">${tr("BT_CLOSE")}</button>
        </div>`;
        div.innerHTML = html;
        let fnRepeatProg = (err, shade) => {
            if (this.btnTimer) {
                clearTimeout(this.btnTimer);
                this.btnTimer = null;
            }
            if (err) return;
            if (mouseDown) {
                somfy.sendCommandRepeat(shadeId, 'prog', null, fnRepeatProg);
            }
        }
        document.getElementById('divContainer').appendChild(div);

        let btn = document.getElementById('btnSendUnpairing');
        btn.addEventListener('mousedown', (event) => {
            console.log(this);
            console.log(event);
            console.log('mousedown');
            somfy.sendCommand(shadeId, 'prog', null, (err, shade) => { fnRepeatProg(err, shade); });
        }, true);
        btn.addEventListener('touchstart', (event) => {
            console.log(this);
            console.log(event);
            console.log('touchstart');
            somfy.sendCommand(shadeId, 'prog', null, (err, shade) => { fnRepeatProg(err, shade); });
        }, true);

        return div;
    }
    sendCommand(shadeId, command, repeat, cb) {
        let obj = {};
        if (typeof shadeId.shadeId !== 'undefined') {
            obj = shadeId;
            cb = command;
            shadeId = obj.shadeId;
            repeat = obj.repeat;
            command = obj.command;
        }
        else {
            obj = { shadeId: shadeId };
            if (isNaN(parseInt(command, 10))) obj.command = command;
            else obj.target = parseInt(command, 10);
            if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        }
        putJSON('/shadeCommand', obj, (err, shade) => {
            if (typeof cb === 'function') cb(err, shade);
        });
    }
    sendCommandRepeat(shadeId, command, repeat, cb) {
        //console.log(`Sending Shade command ${shadeId}-${command}`);
        let obj = {};
        if (typeof shadeId.shadeId !== 'undefined') {
            obj = shadeId;
            cb = command;
            shadeId = obj.shadeId;
            repeat = obj.repeat;
            command = obj.command;
        }
        else {
            obj = { shadeId: shadeId, command: command };
            if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        }
        putJSON('/repeatCommand', obj, (err, shade) => {
            if (typeof cb === 'function') cb(err, shade);
        });

        /*
        putJSON(`/repeatCommand?shadeId=${shadeId}&command=${command}`, null, (err, shade) => {
            if(typeof cb === 'function') cb(err, shade);
        });
        */
    }
    sendGroupRepeat(groupId, command, repeat, cb) {
        let obj = { groupId: groupId, command: command };
        if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        putJSON(`/repeatCommand?groupId=${groupId}&command=${command}`, null, (err, group) => {
            if (typeof cb === 'function') cb(err, group);
        });
    }
    sendVRCommand(el) {
        let pnl = document.getElementById('divVirtualRemote');
        let dd = pnl.querySelector('#selVRMotor');
        let opt = dd.selectedOptions[0];
        let o = {
            type: opt.getAttribute('data-type'),
            address: opt.getAttribute('data-address'),
            cmd: el.getAttribute('data-cmd')
        };
        ui.fromElement(el.parentElement.parentElement, o);
        switch (o.type) {
            case 'shade':
                o.shadeId = parseInt(opt.getAttribute('data-shadeId'), 10);
                o.shadeType = parseInt(opt.getAttribute('data-shadeType'), 10);
                break;
            case 'group':
                o.groupId = parseInt(opt.getAttribute('data-groupId'), 10);
                break;
        }
        console.log(o);
        let fnRepeatCommand = (err, shade) => {
            if (this.btnTimer) {
                clearTimeout(this.btnTimer);
                this.btnTimer = null;
            }
            if (err) return;
            if (mouseDown) {
                if (o.cmd === 'Sensor')
                    somfy.sendSetSensor(o);
                else if (o.type === 'group')
                    somfy.sendGroupRepeat(o.groupId, o.cmd, null, fnRepeatCommand);
                else
                    somfy.sendCommandRepeat(o, fnRepeatCommand);
            }
        }
        o.command = o.cmd;
        if (o.cmd === 'Sensor') {
            somfy.sendSetSensor(o);
        }
        else if (o.type === 'group')
            somfy.sendGroupCommand(o.groupId, o.cmd, null, (err, group) => { fnRepeatCommand(err, group); });
        else
            somfy.sendCommand(o, (err, shade) => { fnRepeatCommand(err, shade); });
    }
    sendSetSensor(obj, cb) {
        putJSON('/setSensor', obj, (err, device) => {
            if (typeof cb === 'function') cb(err, device);
        });
    }
    sendGroupCommand(groupId, command, repeat, cb) {
        console.log(`Sending Group command ${groupId}-${command}`);
        let obj = { groupId: groupId };
        if (isNaN(parseInt(command, 10))) obj.command = command;
        if (typeof repeat === 'number') obj.repeat = parseInt(repeat);
        putJSON('/groupCommand', obj, (err, group) => {
            if (typeof cb === 'function') cb(err, group);
        });
    }
    sendTiltCommand(shadeId, command, cb) {
        console.log(`Sending Tilt command ${shadeId}-${command}`);
        if (isNaN(parseInt(command, 10)))
            putJSON('/tiltCommand', { shadeId: shadeId, command: command }, (err, shade) => {
                if (typeof cb === 'function') cb(err, shade);
            });
        else
            putJSON('/tiltCommand', { shadeId: shadeId, target: parseInt(command, 10) }, (err, shade) => {
                if (typeof cb === 'function') cb(err, shade);
            });
    }

    linkRemote(shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divLinking" class="instructions" data-type="link-remote" data-shadeid="${shadeId}">
        <div>${tr("LINK_REMOTE_DESC_1")}</div>
        <hr>
        <div><div class="button-container"><button id="btnStopLinking" class="bouton" type="button" onclick="document.getElementById('divLinking').remove();">${tr("BT_CANCEL_1")}</button></div>
        </div>`;
        div.innerHTML = html;

        document.getElementById('divContainer').appendChild(div);

        return div;
    }

    linkRepeatRemote() {
        let div = document.createElement('div');
        let html = `<div id="divLinkRepeater" class="instructions" data-type="link-repeatremote" style="border-radius:27px;font-size:14px;">
        <div>${tr("REPEAT_REMOTE_DESC_1")}</div>
        <div class="sub-message">${tr("REPEAT_REMOTE_DESC_2")}</div>
        <div class="sub-message" style="font-size:14px;">${tr("REPEAT_REMOTE_DESC_3")}</div>
        <div class="sub-message" style="font-size:14px;">${tr("REPEAT_REMOTE_DESC_4")}</div>
        <div class="sub-message">${tr("REPEAT_REMOTE_DESC_5")}</div>
        <hr>
        <div><div class="button-container"><button id="btnStopLinking" class="bouton" type="button" onclick="document.getElementById('divLinkRepeater').remove();">${tr("BT_CANCEL_1")}</button></div>
        </div>`;
        div.innerHTML = html;

        document.getElementById('divConfigPnl').appendChild(div);

        return div;
    }

    linkGroupShade(groupId) {
        let div = document.createElement('div');

        // On ouvre avec ` au début
        let html = `<div id="divLinkGroup" class="inst-overlay wizard" data-type="link-shade" data-groupid="${groupId}" data-stepid="1">
        <div style="width:100%;text-align:center;font-weight:bold;">
        <div style="padding:10px;display:inline-block;width:100%;color:#43bbda;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;">
        <div>${tr("TXT_ADD_SHADE_TO_GROUP_TITLE")}</div>
        <div id="divGroupName" style="font-size:14px;"></div>
        </div>
        </div>

        <div class="wizard-step" data-stepid="1">
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP1_DESC_1")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP1_DESC_2")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP1_DESC_3")}</p>
        <hr>
        </div>

        <div class="wizard-step" data-stepid="2">
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP2_DESC_1")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP2_DESC_2")}</p>
        <hr>
        <div class="field-group" style="text-align:center;background-color:white;border-radius:5px;">
        <select id="selAvailShades" style="font-size:22px;min-width:277px;text-align:center;" data-bind="shadeId" data-datatype="int" onchange="document.getElementById('divWizShadeName').innerHTML = this.options[this.selectedIndex].text;">
        <options style="color:black;"></options>
        </select>
        <label for="selAvailShades">${tr("LBL_SELECT_SHADE")}</label>
        </div>
        </div>

        <div class="wizard-step" data-stepid="3">
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP3_DESC_1")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP3_DESC_2")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP3_DESC_3")}</p>
        <hr>
        <div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>
        <div class="button-container">
        <button class="bouton" type="button" id="btnOpenMemory">${tr("BT_OPEN_MEMORY")}</button>
        </div>
        <hr>
        </div>

        <div class="wizard-step" data-stepid="4">
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP4_DESC_1")}</p>
        <p style="font-size:14px;">${tr("WIZ_LINK_STEP4_DESC_2")}</p>
        <hr>
        <div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>
        <div class="button-container">
        <button class="bouton" type="button" id="btnPairToGroup">${tr("BT_PAIR_TO_GROUP")}</button>
        </div>
        <hr>
        </div>

        <div class="button-container" style="text-align:center;">
        <button id="btnPrevStep" class="boutonOutline" type="button" onclick="ui.wizSetPrevStep(document.getElementById('divLinkGroup'));">${tr("BT_GO_BACK")}</button>
        <button id="btnNextStep" class="bouton" type="button" onclick="ui.wizSetNextStep(document.getElementById('divLinkGroup'));">${tr("BT_NEXT")}</button>
        </div>
        <div class="button-container" style="text-align:center;">
        <button id="btnStopLinking" class="boutonOutline" type="button"  onclick="document.getElementById('divLinkGroup').remove();">${tr("BT_CANCEL_1")}</button>
        </div>
        </div>`; // On ferme avec ` à la toute fin

        div.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
        ui.wizSetStep(div, 1);

        let btnOpenMemory = div.querySelector('#btnOpenMemory');
        btnOpenMemory.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            console.log(obj);
            putJSONSync('/shadeCommand', { shadeId: obj.shadeId, command: 'prog', repeat: 40 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage(tr('PROMPT_CONFIRM_MOTOR_RESPONSE'), () => {
                        ui.wizSetNextStep(document.getElementById('divLinkGroup'));
                        prompt.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr><p>${tr("PROMPT_SHADE_MOVE_CONFIRM")}</p><p>${tr("TXT_SHADE_MEMORY_READY_FOR_GROUP")}</p>`;
                }
            });
        });
        let btnPairToGroup = div.querySelector('#btnPairToGroup');
        let fnRepeatProgCommand = (err, o) => {
            console.log(o);
            if (this.btnTimer) {
                clearTimeout(this.btnTimer);
                this.btnTimer = null;
            }
            if (err) return;
            if (mouseDown) {
                if (o.cmd === 'Sensor')
                    somfy.sendSetSensor(o);
                else if (typeof o.groupId !== 'undefined')
                    somfy.sendGroupRepeat(o.groupId, 'prog', null, fnRepeatProgCommand);
                else
                    somfy.sendCommandRepeat(o.shadeId, 'prog', null, fnRepeatProgCommand);
            }
        }
        btnPairToGroup.addEventListener('mousedown', (evt) => {
            mouseDown = true;
            somfy.sendGroupCommand(groupId, 'prog', null, fnRepeatProgCommand);
        });
        btnPairToGroup.addEventListener('mouseup', (evt) => {
            mouseDown = false;
            let obj = ui.fromElement(div);
            let prompt = ui.promptMessage(tr('PROMPT_CONFIRM_MOTOR_RESPONSE'), () => {
                putJSONSync('/linkToGroup', { groupId: groupId, shadeId: obj.shadeId }, (err, group) => {
                    console.log(group);
                    somfy.setLinkedShadesList(group);
                    this.updateGroupList();
                });
                prompt.remove();
                div.remove();
            });

            prompt.querySelector('.sub-message').innerHTML = `<hr><p>${tr("PROMPT_SHADE_GROUP_LINK_CONFIRM")}</p></p><p>${tr("TXT_SHADE_GROUP_LINK_DONE")}</p>`;

        });
        getJSONSync(`/groupOptions?groupId=${groupId}`, (err, options) => {
            if (err) {
                div.remove();
                ui.serviceError(err);
            }
            else {
                console.log(options);
                if (options.availShades.length > 0) {
                    // Add in all the available shades.
                    let selAvail = div.querySelector('#selAvailShades');
                    let grpName = div.querySelector('#divGroupName');
                    if (grpName) grpName.innerHTML = options.name;
                    for (let i = 0; i < options.availShades.length; i++) {
                        let shade = options.availShades[i];
                        selAvail.options.add(new Option(shade.name, shade.shadeId));
                    }
                    let divWizShadeName = div.querySelector('#divWizShadeName');
                    if (divWizShadeName) divWizShadeName.innerHTML = options.availShades[0].name;
                }
                else {
                    div.remove();
                    ui.errorMessage(tr('ERR_NO_SHADE_AVAILABLE_FOR_GROUP'));
                }
            }
        });
        return div;
    }


    unlinkGroupShade(groupId, shadeId) {
        let div = document.createElement('div');
        let html = `<div id="divUnlinkGroup" class="inst-overlay wizard" data-type="link-shade" data-groupid="${groupId}" data-stepid="1">
        <div style="width:100%;text-align:center;font-weight:bold;"><div style="padding:10px;display:inline-block;width:100%;color:#43bbda;border-radius:5px;border-top-right-radius:17px;border-top-left-radius:17px;background:white;"><div>${tr("TITLE_UNLINK_SHADE_GROUP")}</div><div id="divGroupName" style="font-size:14px;"></div></div></div>



        <div class="wizard-step" data-stepid="1">
        <p style="font-size:14px;">${tr("TXT_UNLINK_WIZARD_INTRO_1")}</p>
        <p style="font-size:14px;">${tr("TXT_UNLINK_WIZARD_INTRO_2")}</p>
        <p style="font-size:14px;">${tr("TXT_UNLINK_WIZARD_INTRO_3")}</p><hr>
        </div>

        <div class="wizard-step" data-stepid="2">
        <p style="font-size:14px;">${tr("TXT_OPEN_MEMORY_STEP_1")}</p>
        <p style="font-size:14px;">${tr("TXT_OPEN_MEMORY_STEP_2")}</p>
        <hr>
        <div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>
        <div class="button-container"><button type="button" id="btnOpenMemory">${tr("BT_OPEN_MEMORY")}</button></div>
        <hr>
        </div>

        <div class="wizard-step" data-stepid="3">
        <p style="font-size:14px;">${tr("TXT_UNPAIR_GROUP_STEP_1")}</p>
        <p style="font-size:14px;">${tr("TXT_UNPAIR_GROUP_STEP_2")}</p>
        <hr>
        <div id="divWizShadeName" style="text-align:center;font-size:22px;"></div>
        <div class="button-container"><button type="button" id="btnUnpairFromGroup">${tr("BT_UNPAIR_GROUP")}</button></div>
        <hr>
        </div>
        <div class="button-container" style="text-align:center;"><button id="btnPrevStep" type="button" onclick="ui.wizSetPrevStep(document.getElementById('divUnlinkGroup'));">${tr("BT_GO_BACK")}</button><button id="btnNextStep" type="button" onclick="ui.wizSetNextStep(document.getElementById('divUnlinkGroup'));">${tr("BT_NEXT")}</button></div>
        <div class="button-container bouton" ><button id="btnStopLinking" class="bouton" type="button" onclick="document.getElementById('divUnlinkGroup').remove();">${tr("BT_CANCEL_1")}</button></div>
        </div>`
        div.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
        ui.wizSetStep(div, 1);
        let btnOpenMemory = div.querySelector('#btnOpenMemory');
        btnOpenMemory.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            console.log(obj);
            putJSONSync('/shadeCommand', { shadeId: shadeId, command: 'prog', repeat: 40 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage(tr('PROMPT_CONFIRM_MOTOR_RESPONSE'), () => {
                        ui.wizSetNextStep(document.getElementById('divUnlinkGroup'));
                        prompt.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr><p>${tr("PROMPT_SHADE_MOVE_CONFIRM")}</p>
                    <p>${tr("TXT_ALT_METHOD_1")}</p><p>${tr("TXT_ALT_METHOD_2")}</p>`;
                }
            });
        });
        let btnUnpairFromGroup = div.querySelector('#btnUnpairFromGroup');
        btnUnpairFromGroup.addEventListener('click', (evt) => {
            let obj = ui.fromElement(div);
            putJSONSync('/groupCommand', { groupId: groupId, command: 'prog', repeat: 1 }, (err, shade) => {
                if (err) ui.serviceError(err);
                else {
                    let prompt = ui.promptMessage(tr('PROMPT_CONFIRM_MOTOR_RESPONSE'), () => {
                        putJSONSync('/unlinkFromGroup', { groupId: groupId, shadeId: shadeId }, (err, group) => {
                            console.log(group);
                            somfy.setLinkedShadesList(group);
                            this.updateGroupList();
                        });
                        prompt.remove();
                        div.remove();
                    });
                    prompt.querySelector('.sub-message').innerHTML = `<hr><p>${tr("PROMPT_SHADE_MOVE_CONFIRM")}</p><p>${tr("PROMPT_SHADE_MOVE_DONE")}</p>`;
                }
            });
        });

        getJSONSync(`/group?groupId=${groupId}`, (err, group) => {
            if (err) {
                div.remove();
                ui.serviceError(err);
            }
            else {
                console.log(group);
                console.log(shadeId);
                let shade = group.linkedShades.find((x) => { return shadeId === x.shadeId; });
                if (typeof shade !== 'undefined') {
                    // Add in all the available shades.
                    let grpName = div.querySelector('#divGroupName');
                    if (grpName) grpName.innerHTML = group.name;
                    let divWizShadeName = div.querySelector('#divWizShadeName');
                    if (divWizShadeName) divWizShadeName.innerHTML = shade.name;
                }
                else {
                    div.remove();
                    ui.errorMessage(tr('ERR_SHADE_NOT_FOUND_IN_GROUP'));
                }
            }
        });
        return div;
    }

    unlinkRepeater(address) {
        let prompt = ui.promptMessage(tr('PROMPT_UNLINK_REPEATER'), () => {
            putJSONSync('/unlinkRepeater', { address: address }, (err, repeaters) => {
                if (err) ui.serviceError(err);
                else this.setRepeaterList(repeaters);
                prompt.remove();
            });

        });
    }

    unlinkRemote(shadeId, remoteAddress) {
        let prompt = ui.promptMessage(tr('PROMPT_UNLINK_REMOTE'), () => {
            let obj = {
                shadeId: shadeId,
                remoteAddress: remoteAddress
            };
            putJSONSync('/unlinkRemote', obj, (err, shade) => {

                console.log(shade);
                prompt.remove();
                this.setLinkedRemotesList(shade);
            });

        });
    }
    deviationChanged(el) {
        document.getElementById('spanDeviation').innerText = (el.value / 100).fmt('#,##0.00');
    }
    rxBandwidthChanged(el) {
        document.getElementById('spanRxBandwidth').innerText = (el.value / 100).fmt('#,##0.00');
    }
    frequencyChanged(el) {
        document.getElementById('spanFrequency').innerText = (el.value / 1000).fmt('#,##0.000');
    }
    txPowerChanged(el) {
        console.log(el.value);
        let lvls = [-30, -20, -15, -10, -6, 0, 5, 7, 10, 11, 12];
        document.getElementById('spanTxPower').innerText = lvls[el.value];
    }
    stepSizeChanged(el) {
        document.getElementById('spanStepSize').innerText = parseInt(el.value, 10).fmt('#,##0');
    }

    processShadeTarget(el, shadeId) {
        let positioner = document.querySelector(`.shade-positioner[data-shadeid="${shadeId}"]`);
        if (positioner) {
            positioner.querySelector(`.shade-target`).innerHTML = el.value;
            somfy.sendCommand(shadeId, el.value);
        }
    }
    processShadeTiltTarget(el, shadeId) {
        let positioner = document.querySelector(`.shade-positioner[data-shadeid="${shadeId}"]`);
        if (positioner) {
            positioner.querySelector(`.shade-tilt-target`).innerHTML = el.value;
            somfy.sendTiltCommand(shadeId, el.value);
        }
    }
    openSelectRoom() {
        this.closeShadePositioners();
        console.log('Opening rooms');
        let list = document.getElementById('divRoomSelector-list');
        list.style.display = 'block';
        document.body.addEventListener('click', () => {
            list.style.display = '';
        }, { once: true });

    }
    openSetPosition(shadeId) {
        console.log('Opening Shade Positioner');
        if (typeof shadeId === 'undefined') {
            return;
        }
        else {
            let shade = document.querySelector(`div.somfyShadeCtl[data-shadeid="${shadeId}"]`);
            if (shade) {
                let ctls = document.querySelectorAll('.shade-positioner');
                for (let i = 0; i < ctls.length; i++) {
                    console.log('Closing shade positioner');
                    ctls[i].remove();
                }
                switch (parseInt(shade.getAttribute('data-shadetype'), 10)) {
                    case 5:
                    case 9:
                    case 10:
                    case 14:
                    case 15:
                    case 16:
                        return;
                }

                let tiltType = parseInt(shade.getAttribute('data-tilt'), 10) || 0;
                let currPos = parseInt(shade.getAttribute('data-target'), 0);
                let elname = shade.querySelector(`.shadectl-name`);
                let shadeName = elname.innerHTML;
                let html = `<div class="shade-name">${shadeName}</div>`;
                let lbl = makeBool(shade.getAttribute('data-flipposition')) ? `% ${tr('TXT_OPEN')}` : `% ${tr('TXT_CLOSED')}`;
                if (tiltType !== 3) {
                    html += `<input id="slidShadeTarget" name="shadeTarget" type="range" min="0" max="100" step="1" value="${currPos}" onchange="somfy.processShadeTarget(this, ${shadeId});" oninput="document.getElementById('spanShadeTarget').innerHTML = this.value;" />`;
                    html += `<label for="slidShadeTarget"><span>${tr('TXT_TARGET_POSITION')}</span><span><span id="spanShadeTarget" class="shade-target">${currPos}</span><span>${lbl}</span></span></label>`;
                }
                if (tiltType > 0) {
                    let currTiltPos = parseInt(shade.getAttribute('data-tilttarget'), 10);
                    html += `<input id="slidShadeTiltTarget" name="shadeTarget" type="range" min="0" max="100" step="1" value="${currTiltPos}" onchange="somfy.processShadeTiltTarget(this, ${shadeId});" oninput="document.getElementById('spanShadeTiltTarget').innerHTML = this.value;" />`;
                    html += `<label for="slidShadeTiltTarget"><span>${tr('TXT_TARGET_TILT_POSITION')}</span><span><span id="spanShadeTiltTarget" class="shade-tilt-target">${currTiltPos}</span><span>${lbl}</span></span></label>`;
                }
                html += `</div>`;
                let div = document.createElement('div');
                div.setAttribute('class', 'shade-positioner');
                div.setAttribute('data-shadeid', shadeId);
                div.addEventListener('onclick', (event) => { event.stopPropagation(); });
                div.innerHTML = html;
                shade.appendChild(div);
                document.body.addEventListener('click', () => {
                    let ctls = document.querySelectorAll('.shade-positioner');
                    for (let i = 0; i < ctls.length; i++) {
                        console.log('Closing shade positioner');
                        ctls[i].remove();
                    }
                }, { once: true });
            }
        }
    }
}
var somfy = new Somfy();
class MQTT {
    initialized = false;
    init() { this.initialized = true; }
    async loadMQTT() {
        getJSONSync('/mqttsettings', (err, settings) => {
            if (err) 
                console.log(err);
            else {
                console.log(settings);
                ui.toElement(document.getElementById('divMQTT'), { mqtt: settings });
                document.getElementById('divDiscoveryTopic').style.display = settings.pubDisco ? '' : 'none';
                document.getElementById('hrIdDiscoveryTopic').style.display = settings.pubDisco ? '' : 'none';
            }
        });
    }
    connectMQTT() {
        let obj = ui.fromElement(document.getElementById('divMQTT'));
        console.log(obj);
        if (obj.mqtt.enabled) {
            if (typeof obj.mqtt.hostname !== 'string' || obj.mqtt.hostname.length === 0) {
                ui.errorMessage (tr('ERR_HOSTNAME')).querySelector('.sub-message').innerHTML = tr('ERR_MQTT_HOSTNAME_REQUIRED');
                return;
            }
            if (obj.mqtt.hostname.length > 64) {
                ui.errorMessage (tr('ERR_HOSTNAME')).querySelector('.sub-message').innerHTML = tr('ERR_HOSTNAME_MAX_LENGTH_64');
                return;
            }
            if (isNaN(obj.mqtt.port) || obj.mqtt.port < 0) {
                ui.errorMessage (tr('ERR_PORT_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_MQTT_PORT_HINT');
                return;
            }
            if (typeof obj.mqtt.username === 'string' && obj.mqtt.username.length > 32) {
                ui.errorMessage (tr('ERR_USERNAME_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_USERNAME_MAX_LENGTH_32');
                return;
            }
            if (typeof obj.mqtt.password === 'string' && obj.mqtt.password.length > 32) {
                ui.errorMessage (tr('ERR_PASSWORD_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_PASSWORD_MAX_LENGTH_32');
                return;
            }
            if (typeof obj.mqtt.rootTopic === 'string' && obj.mqtt.rootTopic.length > 64) {
                ui.errorMessage (tr('ERR_ROOT_TOPIC_INVALID')).querySelector('.sub-message').innerHTML = tr('ERR_ROOT_TOPIC_MAX_LENGTH_64');
                return;
            }
        }
        putJSONSync('/connectmqtt', obj.mqtt, (err, response) => {
            if (err) ui.serviceError(err);
            console.log(response);
        });
    }
}
var mqtt = new MQTT();
class Firmware {
    initialized = false;
    init() { this.initialized = true; }
    isMobile() {
        let agt = navigator.userAgent.toLowerCase();
        return /Android|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
    }
    async backup() {
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        return await new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onreadystatechange = (evt) => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let obj = window.URL.createObjectURL(xhr.response);
                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    let header = xhr.getResponseHeader('content-disposition');
                    let fname = 'backup';
                    if (typeof header !== 'undefined') {
                        let start = header.indexOf('filename="');
                        if (start >= 0) {
                            let length = header.length;
                            fname = header.substring(start + 10, length - 1);
                        }
                    }
                    console.log(fname);
                    link.setAttribute('download', fname);
                    link.setAttribute('href', obj);
                    link.click();
                    link.remove();
                    setTimeout(() => { window.URL.revokeObjectURL(obj); console.log('Revoked object'); }, 0);
                }
            };
            xhr.onload = (evt) => {
                if (typeof overlay !== 'undefined') overlay.remove();
                let status = xhr.status;
                if (status !== 200) {
                    let err = xhr.response || {};
                    err.htmlError = status;
                    err.service = `GET /backup`;
                    if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                    console.log('Done');
                    reject(err);
                }
                else {
                    resolve();
                }
            };
            xhr.onerror = (evt) => {
                if (typeof overlay !== 'undefined') overlay.remove();
                let err = {
                    htmlError: xhr.status || 500,
                    service: `GET /backup`
                };
                if (typeof err.desc === 'undefined') err.desc = xhr.statusText || httpStatusText[xhr.status || 500];
                console.log(err);
                reject(err);
            };
            xhr.onabort = (evt) => {
                if (typeof overlay !== 'undefined') overlay.remove();
                console.log('Aborted');
                if (typeof overlay !== 'undefined') overlay.remove();
                reject({ htmlError: status, service: 'GET /backup' });
            };
            xhr.open('GET', baseUrl.length > 0 ? `${baseUrl}/backup` : '/backup', true);
            xhr.send();
        });


    }


    restore() {
        let div = this.createFileUploader('/restore');
        let inst = div.querySelector('div[id=divInstText]');

        let html = `<div style="font-size:14px;">${tr('TXT_RESTORE_SELECT_FILE')}</div><hr>
        <div style="font-size:14px;">${tr('TXT_RESTORE_NETWORK_WARNING')}</div><hr>
        <div style="font-size:14px;margin-bottom:27px;text-align:left;margin-left:70px;">
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreShades" type="checkbox" data-bind="shades" checked="true">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreShades">${tr('TXT_RESTORE_SHADES_GROUPS')}</label>
        </div>
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreRepeaters" type="checkbox" data-bind="repeaters">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreRepeaters">${tr('TXT_RESTORE_REPEATERS')}</label>
        </div>
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreSystem" type="checkbox" data-bind="settings">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreSystem">${tr('TXT_RESTORE_SYSTEM_SETTINGS')}</label>
        </div>
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreNetwork" type="checkbox" data-bind="network">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreNetwork">${tr('TXT_RESTORE_NETWORK_SETTINGS')}</label>
        </div>
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreMQTT" type="checkbox" data-bind="mqtt">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreMQTT">${tr('TXT_RESTORE_MQTT_SETTINGS')}</label>
        </div>
        <div class="field-switch" style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <label class="switch" style="flex-shrink:0;">
        <input id="cbRestoreTransceiver" type="checkbox" data-bind="transceiver">
        <span class="sliderjs"></span>
        </label>
        <label for="cbRestoreTransceiver">${tr('TXT_RESTORE_RADIO_SETTINGS')}</label>
        </div>
        </div>`;

        inst.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
    }


    createFileUploader(service) {
        let div = document.createElement('div');
        div.setAttribute('id', 'divUploadFile');
        div.setAttribute('class', 'inst-overlay');
        div.style.width = '100%';
        div.style.alignContent = 'center';
        let html = `<div style="width:100%;text-align:center;"><form method="POST" action="#" enctype="multipart/form-data" id="frmUploadApp" style="">
        <div id="divInstText"></div>
        <input id="fileName" type="file" name="updateFS" style="display:none;" onchange="document.getElementById('span-selected-file').innerText = this.files[0].name;"/>
        <label for="fileName">
        <span id="span-selected-file" style="display:inline-block;width:calc(100% - 47px);border-bottom:solid 2px white;font-size:14px;white-space:nowrap;overflow:hidden;max-width:320px;text-overflow:ellipsis;"></span>
        <div id="btn-select-file" class="button-outline" style="font-size:.8em;padding: 11px 13px 9px 13px;background-color: #f8ab35"><i class="icss-upload" style="margin:0px;"></i></div>
        </label>
        <div class="progress-bar" id="progFileUpload" style="--progress:0%;margin-top:10px;display:none;"></div>
        <div class="button-container">
        <button id="btnBackupCfg" type="button" style="display:none;width:auto;padding-left:20px;padding-right:20px;margin-right:4px;" onclick="firmware.backup();">${tr('BT_SAVE')}</button>
        <button id="btnUploadFile" class="bouton" type="button" style="width:auto;padding-left:20px;padding-right:20px;margin-right:4px;display:inline-block;" onclick="firmware.uploadFile('${service}', document.getElementById('divUploadFile'), ui.fromElement(document.getElementById('divUploadFile')));">${tr('BT_UPLOAD_FILE')}</button>
        <button id="btnClose" class="bouton" type="button" style="width:auto;padding-left:20px;padding-right:20px;display:inline-block;" onclick="document.getElementById('divUploadFile').remove();">${tr('BT_CANCEL')}</button>
        </form><div>`;
        div.innerHTML = html;

        // Appliquer la traduction immédiatement après l'insertion
        div.querySelectorAll('[data-txt]').forEach(el => {
            el.innerHTML = tr(el.getAttribute('data-txt'));
        });

        return div;

    }
    procMemoryStatus(mem) {
        console.log(mem);
        let sp = document.getElementById('spanFreeMemory');
        if (sp) sp.innerHTML = mem.free.fmt("#,##0");
        sp = document.getElementById('spanMaxMemory');
        if (sp) sp.innerHTML = mem.max.fmt('#,##0');
        sp = document.getElementById('spanMinMemory');
        if (sp) sp.innerHTML = mem.min.fmt('#,##0');


    }


    procFwStatus(rel) {
        console.log(rel);
        let div = document.getElementById('divFirmwareUpdate');
        if (rel.available && rel.status === 0 && rel.checkForUpdate !== false) {
            div.style.color = 'black';
            div.innerHTML = `${tr('TXT_FW_INSTALLED').replace('%1', rel.fwVersion.name)}<span style="color:red"> ${tr('TXT_FW_AVAILABLE').replace('%1', rel.latest.name)}</span>`;
        }
        else {
            switch (rel.status) {
                case 2: // Awaiting update.
                    div.style.color = 'red';
                    div.innerHTML = tr('TXT_FW_PREPARING_UPDATE');
                    break;
                case 3: // Updating -- this will be set by the update progress.
                    break;
                case 4: // Complete
                    if (rel.error !== 0) {
                        div.style.color = 'red';
                        let e = errors.find(x => x.code === rel.error) || { code: rel.error, desc: tr('ERR_UNSPECIFIED') };
                        let inst = document.getElementById('divGitInstall');
                        if (inst) {
                            inst.remove();
                            ui.errorMessage(e.desc);
                        }
                        div.innerHTML = e.desc;
                    }
                    else {
                        div.innerHTML = tr('TXT_FW_UPDATE_DONE');
                        // Throw up a wait message this will be cleared on the reload.
                        ui.waitMessage(document.getElementById('divContainer'));
                    }
                    break;
                case 5:
                    div.style.color = 'red';
                    div.innerHTML = tr('TXT_FW_UPDATE_CANCELING');
                    break;
                case 6:
                    div.style.color = 'red';
                    div.innerHTML = tr('TXT_FW_UPDATE_CANCELED');
                    break;

                default:/*
                    div.style.color = 'green';
                    div.innerHTML = `Firmware ${rel.fwVersion.name} Installé - fr`;*/
                    break;
            }
        }
        /*div.style.display = '';*/
        div.style.display = 'none';
        div.innerHTML = '';
    }
    procUpdateProgress(prog) {
        let pct = Math.round((prog.loaded / prog.total) * 100);
        let file = prog.part === 100 ? 'Application' : 'Firmware';
        let div = document.getElementById('divFirmwareUpdate');
        if (div) {
            div.style.color = 'red';
            div.innerHTML = `Updating ${file} to ${prog.ver} ${pct}%`;
        }
        general.reloadApp = true;
        let git = document.getElementById('divGitInstall');
        if (git) {
            // Update the status on the client that started the install.
            if (pct >= 100 && prog.part === 100) git.remove();
            else {
                if (prog.part === 100) {
                    document.getElementById('btnCancelUpdate').style.display = 'none';
                }
                let p = prog.part === 100 ? document.getElementById('progApplicationDownload') : document.getElementById('progFirmwareDownload');
                if (p) {
                    p.style.setProperty('--progress', `${pct}%`);
                    p.setAttribute('data-progress', `${pct}%`);
                }
            }
        }

    }
    async installGitRelease(div) {
        if (!this.isMobile()) {
            console.log('Starting backup');
            try {
                await firmware.backup();
                console.log('Backup Complete');
            }
            catch (err) {
                ui.serviceError(el, err);
                return;
            }
        }

        let obj = ui.fromElement(div);
        console.log(obj);
        putJSONSync(`/downloadFirmware?ver=${obj.version}`, {}, (err, ver) => {
            if (err) ui.serviceError(err);
            else {
                general.reloadApp = true;
                // Change the display and allow the percentage to be shown when the socket emits the progress.
                let html  = `<div>${tr('TXT_INSTALLING_VERSION').replace('%1', ver.name)}</div>
                <div style="font-size:.7em;margin-top:4px;">${tr('TXT_INSTALL_WAIT_WARNING')}</div>
                <div class="progress-bar" id="progFirmwareDownload" style="--progress:0%;margin-top:10px;text-align:center;"></div>
                <label for="progFirmwareDownload" style="font-size:10pt;">${tr('LBL_FIRMWARE_INSTALL_PROGRESS')}</label>
                <div class="progress-bar" id="progApplicationDownload" style="--progress:0%;margin-top:10px;text-align:center;"></div>
                <label for="progApplicationDownload" style="font-size:10pt;">${tr('LBL_APPLICATION_INSTALL_PROGRESS')}</label>
                <hr><div class="button-container" style="text-align:center;">
                <button id="btnCancelUpdate" type="button" style="width:40%;padding-left:20px;padding-right:20px;display:inline-block;"
                onclick="firmware.cancelInstallGit(document.getElementById('divGitInstall'));">
                ${tr('BT_CANCEL_1')}
                </button>
                </div>`;

                div.innerHTML = html;

                div.querySelectorAll('[data-txt]').forEach(el => {
                    el.innerHTML = tr(el.getAttribute('data-txt'));
                });
            }
        });
    }
    cancelInstallGit(div) {
        putJSONSync(`/cancelFirmware`, {}, (err, ver) => {
            if (err) ui.serviceError(err);
            else console.log(ver);
            div.remove();
        });
    }

    updateGithub() {
        getJSONSync('/getReleases', (err, rel) => {
            if (err) ui.serviceError(err);
            else {
                console.log(rel);
                let div = document.createElement('div');
                let chip = document.getElementById('divContainer').getAttribute('data-chipmodel');
                div.setAttribute('id', 'divGitInstall');
                div.setAttribute('class', 'inst-overlay');
                div.style.width = '100%';
                div.style.alignContent = 'center';

                // Sort the releases so that pre-releases are at the bottom
                rel.releases.sort((a, b) => a.preRelease === b.preRelease && b.draft === a.draft ? 0 : a.preRelease ? 1 : -1);

                let html = `<div>${tr('TXT_WARNING')}</div><div style="font-size:.7em;margin-top:4px;">${tr('TXT_SELECT_MAIN_FOR_ALPHA')}</div>
                <div id="divPrereleaseWarning" style="display:none;width:100%;color:red;text-align:center;font-weight:bold;">
                <span style="margin-top:7px;width:100%;padding:3px;display:inline-block;border-radius:5px;background:white;">${tr('TXT_WARNING')}<span>
                <hr style="margin:0px">
                <div style="font-size:.7em;padding-left:1em;padding-right:1em;color:black;font-weight:normal;">${tr('TXT_PRE_RELEASE_DESC')}</div>
                </div>

                <div class="field-group" style="text-align:center;">
                <select id="selVersion" data-bind="version" style="width:70%;font-size:2em;color:white;text-align-last:center;" onchange="firmware.gitReleaseSelected(document.getElementById('divGitInstall'));">`;
                for (let i = 0; i < rel.releases.length; i++) {
                    if (rel.releases[i].hwVersions.length === 0 || rel.releases[i].hwVersions.indexOf(chip) >= 0)
                        html += `<option style="text-align:left;font-size:.5em;color:black;" data-prerelease="${rel.releases[i].preRelease}" value="${rel.releases[i].version.name}">${rel.releases[i].name}${rel.releases[i].preRelease ? ' - Pre' : ''}</option>`;
                }
                html += `</select><label for="selVersion">${tr('TXT_SELECT_VERSION')}</label></div>

                <div class="button-container" id="divReleaseNotes" style="text-align:center;margin-top:-20px;display:none;">
                <button type="button" onclick="firmware.showReleaseNotes(document.getElementById('selVersion').value);" style="display:inline-block;width:auto;padding-left:20px;padding-right:20px;">${tr('BT_RELEASE_NOTE')}</button>
                </div>`;

                if (this.isMobile()) {
                    html += `<div style="width:100%;color:red;text-align:center;font-weight:bold;">
                    <span style="margin-top:7px;width:100%;background:yellow;padding:3px;display:inline-block;border-radius:5px;background:white;">${tr('TXT_WARNING')}<span>
                    </div>`;
                    html += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_NO_AUTO_BACKUP')}</div>`;
                } else {
                    html += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_BACKUP_DOWNLOAD_UP')}</div>`;
                }

                html += `<hr></hr><div class="button-container" style="text-align:center;">`;
                if (this.isMobile()) {
                    html += `<button id="btnBackupCfg" type="button" style="display:inline-block;width:calc(80% + 7px);padding-left:20px;padding-right:20px;margin-right:4px;" onclick="firmware.backup();">${tr('BT_BACK_UP')}</button>`;
                }
                html += `<button id="btnUpdate" type="button" style="width:40%;padding-left:20px;padding-right:20px;display:inline-block;margin-right:7px;" onclick="firmware.installGitRelease(document.getElementById('divGitInstall'));" >${tr('BT_UPDATE')}</button>
                <button id="btnClose" type="button" style="width:40%;padding-left:20px;padding-right:20px;display:inline-block;" onclick="document.getElementById('divGitInstall').remove();">${tr('BT_CANCEL_1')}</button>
                </div></div>`;
                div.innerHTML = html;

                document.getElementById('divContainer').appendChild(div);
                this.gitReleaseSelected(div);
            }
        });
    }

    gitReleaseSelected(div) {
        let obj = ui.fromElement(div);
        let divNotes = div.querySelector('#divReleaseNotes');
        let divPre = div.querySelector('#divPrereleaseWarning');

        let sel = div.querySelector('#selVersion');
        if (sel && sel.selectedIndex !== -1 && makeBool(sel.options[sel.selectedIndex].getAttribute('data-prerelease'))) {
            if (divPre) divPre.style.display = '';
        }
        else
            if (divPre) divPre.style.display = 'none';

        if (divNotes) {
            if (!obj.version || obj.version === 'main' || obj.version === '') divNotes.style.display = 'none';
            else divNotes.style.display = '';
        }
    }
    async getReleaseInfo(tag) {
        let overlay = ui.waitMessage(document.getElementById('divContainer'));
        try {
            let ret = {};
            ret.resp = await fetch(`https://api.github.com/repos/rstrouse/espsomfy-rts/releases/tags/${tag}`);
            if (ret.resp.ok)
                ret.info = await ret.resp.json();
            return ret;
        }
        catch (err) {
            return { err: err };
        }
        finally { overlay.remove(); }
    }
    async showReleaseNotes(tagName) {
        console.log(tagName);
        let r = await this.getReleaseInfo(tagName);
        console.log(r);
        let fnToItem = (txt, tag) => {  }
        if (r.resp.ok) {
            // Convert this to html.
            let lines = r.info.body.split('\r\n');
            let ctx = { html: '', llvl: 0, lines: r.info.body.split('\r\n'), ndx: 0 };
            ctx.toHead = function (txt) {
                let num = txt.indexOf(' ');
                return `<h${num}>${txt.substring(num).trim()}</h${num}>`;
            };
            ctx.toUL = function () {
                let txt = this.lines[this.ndx++];
                let tok = this.token(txt);
                this.html += `<ul>${this.toLI(tok.txt)}`;
                while (this.ndx < this.lines.length) {
                    txt = this.lines[this.ndx];
                    let t = this.token(txt);
                    if (t.ch === '*') {
                        if (t.indent !== tok.indent) this.toUL();
                        else {
                            this.html += this.toLI(t.txt);
                            this.ndx++;
                        }
                    }
                    else break;
                }
                this.html += '</ul>';
            };
            ctx.toLI = function (txt) { return `<li>${txt.trim()}</li>`; }
            ctx.token = function (txt) {
                let tok = { ch: '', indent: 0, txt:'' }
                for (let i = 0; i < txt.length; i++) {
                    if (txt[i] === ' ') tok.indent++;
                    else {
                        tok.ch = txt[i];
                        let tmp = txt.substring(tok.indent);
                        tok.txt = tmp.substring(tmp.indexOf(' '));
                        break;
                    }
                }
                return tok;
            };
            ctx.next = function () {
                if (this.ndx >= this.lines.length) return false;
                let tok = this.token(this.lines[this.ndx]);
                switch (tok.ch) {
                    case '#':
                        this.html += this.toHead(this.lines[this.ndx]);
                        this.ndx++;
                        break;
                    case '*':
                        this.toUL();
                        break;
                    case '':
                        this.ndx++;
                        this.html += `<br/><div>${tok.txt}</div>`;
                        break;
                    default:
                        this.ndx++;
                        break;
                }
                return true;
            };
            while (ctx.next());
            console.log(ctx);
            ui.infoMessage(ctx.html);
        }
    }

    updateFirmware() {
        let div = this.createFileUploader('/updateFirmware');
        let inst = div.querySelector('div[id=divInstText]');

        let html = `<div style="font-size:14px;margin-bottom:20px;">${tr('TXT_UPLOAD_FIRMWARE_DESC')}</div>`;

        if (this.isMobile()) {
            html += `<div style="width:100%;color:red;text-align:center;font-weight:bold;">
            <span style="margin-top:7px;width:100%;background:yellow;padding:3px;display:inline-block;border-radius:5px;background:white;">
            ${tr('TXT_WARNING')}<span>
            </div>`;
            html += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_NO_AUTO_BACKUP')}</div>`;
        } else {
            html += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_BACKUP_DOWNLOAD_FIRMWARE')}</div>`;
        }

        inst.innerHTML = html;
        document.getElementById('divContainer').appendChild(div);
        if (this.isMobile()) document.getElementById('btnBackupCfg').style.display = 'inline-block';
    }

    updateApplication() {
        let div = this.createFileUploader('/updateApplication');
        general.reloadApp = true;
        let inst = div.querySelector('div[id=divInstText]');

        inst.innerHTML = `<div style="font-size:14px;">${tr('TXT_UPLOAD_LITTLEFS_DESC')}</div>`;

        if (this.isMobile()) {
            inst.innerHTML += `<div style="width:100%;color:red;text-align:center;font-weight:bold;">
            <span style="margin-top:7px;width:100%;background:yellow;padding:3px;display:inline-block;border-radius:5px;background:white;">
            ${tr('TXT_WARNING')}<span>
            </div>`;
            inst.innerHTML += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_NO_AUTO_BACKUP')}</div>`;
        } else {
            inst.innerHTML += `<hr><div style="font-size:14px;margin-bottom:10px;">${tr('TXT_BACKUP_DOWNLOAD')}</div>`;
        }

        document.getElementById('divContainer').appendChild(div);
        if (this.isMobile()) document.getElementById('btnBackupCfg').style.display = 'inline-block';
    }

    async uploadFile(service, el, data) {
        let field = el.querySelector('input[type="file"]');
        let filename = field.value;
        console.log(filename);
        let formData = new FormData();
        formData.append('file', field.files[0]);
        const title = tr('ERR_MSG');
        switch (service) {
            case '/updateApplication':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_NO_FILE_LITTLEFS_SELECTED');
                    return;
                }
                else if (filename.indexOf('.littlefs') === -1 || !filename.endsWith('.bin')) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_INVALID_FILE_LITTLEFS');
                    return;
                }
                if (!this.isMobile()) {
                    console.log('Starting backup');
                    try {
                        await firmware.backup();
                        console.log('Backup Complete');
                    }
                    catch (err) {
                        ui.serviceError(el, err);
                        return;
                    }
                }
                break;
            case '/updateFirmware':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_NO_FILE_FIRMWARE_SELECTED');
                    return;
                }
                else if (filename.indexOf('.ino.') === -1 || !filename.endsWith('.bin')) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_INVALID_FILE_FIRMWARE');
                    return;
                }
                if (!this.isMobile()) {
                    console.log('Starting backup');
                    try {
                        await firmware.backup();
                        console.log('Backup Complete');
                    }
                    catch(err) {
                        ui.serviceError(el, err);
                        return;
                    }
                }
                break;
            case '/restore':
                if (typeof filename !== 'string' || filename.length === 0) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_NO_FILE_BACKUP_SELECTED');
                    return;
                }
                else if (field.files[0].size > 20480) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_BACKUP_TOO_LARGE').replace('%s', field.files[0].size.fmt("#,##0"));
                    return;
                }
                else if (!filename.endsWith('.backup')) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_INVALID_FILE_BACKUP');
                    return;
                }
                if (!data.shades && !data.settings && !data.network && !data.transceiver && !data.repeaters && !data.mqtt) {
                    ui.errorMessage(title).querySelector('.sub-message').innerHTML = tr('ERR_NO_RESTORE_OPTION');
                    return;
                }
                console.log(data);
                formData.append('data', JSON.stringify(data));
                console.log(formData.get('data'));
                //return;
                break;
        }
        let btnUpload = el.querySelector('button[id="btnUploadFile"]');
        let btnCancel = el.querySelector('button[id="btnClose"]');
        let btnBackup = el.querySelector('button[id="btnBackupCfg"]');
        btnBackup.style.display = 'none';
        btnUpload.style.display = 'none';
        field.disabled = true;
        let btnSelectFile = el.querySelector('div[id="btn-select-file"]');
        let prog = el.querySelector('div[id="progFileUpload"]');
        prog.style.display = '';
        btnSelectFile.style.visibility = 'hidden';
        let xhr = new XMLHttpRequest();
        //xhr.open('POST', service, true);
        xhr.open('POST', baseUrl.length > 0 ? `${baseUrl}${service}` : service, true);
        xhr.upload.onprogress = function (evt) {
            let pct = evt.total ? Math.round((evt.loaded / evt.total) * 100) : 0;
            prog.style.setProperty('--progress', `${pct}%`);
            prog.setAttribute('data-progress', `${pct}%`);
            console.log(evt);
            
        };
        xhr.onerror = function (err) {
            console.log(err);
            ui.serviceError(el, err);
        };
        xhr.onload = function () {
            console.log('File upload load called');
            btnCancel.innerText = tr('BT_CLOSE');
            switch (service) {
                case '/restore':
                    (async () => {
                        await somfy.init();
                        if (document.getElementById('divUploadFile')) document.getElementById('divUploadFile').remove();
                    })();
                    break;
                case '/updateApplication':

                    break;
            }
        };
        xhr.send(formData);
        btnCancel.addEventListener('click', (e) => {
            console.log('Cancel clicked');
            xhr.abort();
        });

    }
}
var firmware = new Firmware();

