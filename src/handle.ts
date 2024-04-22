const scriptIronSource = `<script type = "text/javascript">function getScript(e, i) { var n = document.createElement("script"); n.type = "text/javascript", n.async = !0, i && (n.onload = i), n.src = e, document.head.appendChild(n) } function parseMessage(e) { var i = e.data, n = i.indexOf(DOLLAR_PREFIX + RECEIVE_MSG_PREFIX); return -1 !== n ? getMessageParams(i.slice(n + 2)) : {} } function getMessageParams(e) { var i, n = [], t = e.split("/"), a = t.length; if (-1 === e.indexOf(RECEIVE_MSG_PREFIX)) { if (a >= 2 && a % 2 == 0) for (i = 0; a > i; i += 2)n[t[i]] = t.length < i + 1 ? null : decodeURIComponent(t[i + 1]) } else { var o = e.split(RECEIVE_MSG_PREFIX); void 0 !== o[1] && (n = JSON && JSON.parse(o[1])) } return n } function getDapi(e) { var i = parseMessage(e); i && i.name !== GET_DAPI_URL_MSG_NAME || getScript(i.data, onDapiReceived) } function invokeDapiListeners() { for (var e in dapiEventsPool) dapiEventsPool.hasOwnProperty(e) && dapi.addEventListener(e, dapiEventsPool[e]) } function onDapiReceived() { dapi = window.dapi, window.removeEventListener("message", getDapi), invokeDapiListeners() } function init() { window.dapi.isDemoDapi && (window.parent.postMessage(DOLLAR_PREFIX + SEND_MSG_PREFIX + JSON.stringify({ state: "getDapiUrl" }), "*"), window.addEventListener("message", getDapi, !1)) } var DOLLAR_PREFIX = "$$", RECEIVE_MSG_PREFIX = "DAPI_SERVICE:", SEND_MSG_PREFIX = "DAPI_AD:", GET_DAPI_URL_MSG_NAME = "connection.getDapiUrl", dapiEventsPool = {}, dapi = window.dapi || { isReady: function () { return !1 }, addEventListener: function (e, i) { dapiEventsPool[e] = i }, removeEventListener: function (e) { delete dapiEventsPool[e] }, isDemoDapi: !0 }; init()</script>`;

export const handleChangeFile = (type: string, text: string, linkAndroid: string,
  linkIOS: string) => {
    
    if(linkAndroid){
      text = text.replace(/var androidLink = ".*"/, `var androidLink = "${linkAndroid}"`);
    }
    if(linkIOS){
      text = text.replace(/var iosLink = ".*"/, `var iosLink = "${linkIOS}"`);
    }
  if (type == "applovin") {
    return text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="applovin"');
  }
  if (type == "ironsource") {
    const textTmp = text.replace(/<\/script>/, `</script>${ironSourceCode}`);
    return textTmp.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="dapi_iron"');
  }
  if (type == "tiktok") {
    return text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="tiktok"');
  }
  if (type == "facebook") {
    return text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="fb"');
  }
  if (type == "google") {
    const textTmp = text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="google"');
    return textTmp.replace(
      "<head>",
      `<head><meta name="ad.orientation" content="portrait"><meta name="ad.size" content="width=320,height=480">`
    );
  }
  if (type == "unity") {
    return text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="unity"');
  }
  if (type == "mintegral") {
    const textTmp = text.replace(/var type=(?:'[^']*'|"[^"]*")/, 'var type="mintegral";');
    return replaceMetaTag(
      textTmp,
      '<meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0"/>'
    );
  }
  return text;
};

function replaceMetaTag(htmlContent: any, newMetaTag: string) {
  // log đoạn match /<meta[^>]*\/?>/gi
  console.log(htmlContent.match(/<meta[^>]*\/?>/gi));
  const text = htmlContent.match(/<meta[^>]*\/?>/gi)[1] ?? "";
  return htmlContent.replace(text, newMetaTag);
}


export const getUrlStore = (type: string, htmlContent: string) => {
  if(type == "android"){
    return htmlContent.match(/var androidLink = ".*"/)?.[0].replace('var androidLink = "', "").replace('"', "") ?? "";
  }
  return htmlContent.match(/var iosLink = ".*"/)?.[0].replace('var iosLink = "', "").replace('"', "") ?? "";
}

const netWorkType : any = {
  applovin: "ALV",
  facebook: "FB",
  google: "GG",
  ironsource: "IS",
  mintegral: "MTG",
  tiktok: "TT",
  unity: "Uni",
}
type Namefile = {
  network: string;
  idea: string;
  PA: string;
  version?: number;
  localize?: string;
}
export const generateNameFile = ({network,idea, PA, version, localize}: Namefile) => {
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear().toString().slice(2);
  //dd/mm/yy
  const dateUp = `linhtv${d < 10 ? "0" + d : d}${m < 10 ? "0" + m : m}${y}`;
  const nameNetWork = netWorkType[network] ?? network;

  return `Twisted${version == 2 ? '2' : ''}_inhouse_${nameNetWork}${localize ? "_" + localize : ""}_${idea.replace(" ", '')}_${PA ? "PA" + PA + "_" : ""}${dateUp}`;
}

const ironSourceCode = `
<script type="text/javascript">
function getScript(e, i) {
  var n = document.createElement("script");
  (n.type = "text/javascript"),
    (n.async = !0),
    i && (n.onload = i),
    (n.src = e),
    document.head.appendChild(n);
}
function parseMessage(e) {
  var e = e.data,
    i = e.indexOf(DOLLAR_PREFIX + RECEIVE_MSG_PREFIX);
  return -1 !== i ? getMessageParams(e.slice(i + 2)) : {};
}
function getMessageParams(e) {
  var i,
    n = [],
    t = e.split("/"),
    a = t.length;
  if (-1 === e.indexOf(RECEIVE_MSG_PREFIX)) {
    if (2 <= a && a % 2 == 0)
      for (i = 0; i < a; i += 2)
        n[t[i]] = t.length < i + 1 ? null : decodeURIComponent(t[i + 1]);
  } else {
    e = e.split(RECEIVE_MSG_PREFIX);
    void 0 !== e[1] && (n = JSON && JSON.parse(e[1]));
  }
  return n;
}
function getDapi(e) {
  e = parseMessage(e);
  (e && e.name !== GET_DAPI_URL_MSG_NAME) ||
    getScript(e.data, onDapiReceived);
}
function invokeDapiListeners() {
  for (var e in dapiEventsPool)
    dapiEventsPool.hasOwnProperty(e) &&
      dapi.addEventListener(e, dapiEventsPool[e]);
}
function onDapiReceived() {
  (dapi = window.dapi),
    window.removeEventListener("message", getDapi),
    invokeDapiListeners();
}
function init() {
  window.dapi.isDemoDapi &&
    (window.parent.postMessage(
      DOLLAR_PREFIX +
        SEND_MSG_PREFIX +
        JSON.stringify({ state: "getDapiUrl" }),
      "*"
    ),
    window.addEventListener("message", getDapi, !1));
}
var DOLLAR_PREFIX = "$$$",
  RECEIVE_MSG_PREFIX = "DAPI_SERVICE:",
  SEND_MSG_PREFIX = "DAPI_AD:",
  GET_DAPI_URL_MSG_NAME = "connection.getDapiUrl",
  dapiEventsPool = {},
  dapi = window.dapi || {
    isReady: function () {
      return !1;
    },
    addEventListener: function (e, i) {
      dapiEventsPool[e] = i;
    },
    removeEventListener: function (e) {
      delete dapiEventsPool[e];
    },
    isDemoDapi: !0,
  };
init();
</script>
`