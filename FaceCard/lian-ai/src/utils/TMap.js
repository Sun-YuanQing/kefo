export function TMap(key) {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(qq) //注意这里
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://map.qq.com/api/js?v=2.exp&callback=init&key="+key;
        script.onerror = reject;
        document.head.appendChild(script);

        var script2 = document.createElement("script");
        script2.type = "text/javascript";
        script2.src = "https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js";
        script2.onerror = reject;
        document.head.appendChild(script2);
    })
}