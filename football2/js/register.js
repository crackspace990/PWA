  //Register Service Worker
  if ("serviceWorker" in navigator){
    window.addEventListener("load", function(){
        navigator.serviceWorker
        .register("/sw.js")
        .then(function(){
            console.log("Pendaftaran Service Worker Berhasil");
        })
        .catch(function(){
            console.log("Pendaftaran Service Worker Gagal");
        });
    });
}else{
    console.log("Service Worker Belum Didukung Browser Ini.");
}

  
