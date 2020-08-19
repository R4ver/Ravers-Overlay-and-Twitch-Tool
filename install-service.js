(function() {
    var path = require("path");
    var Service = require("node-windows").Service;
    
    // Create a new service object
    var svc = new Service({
        name: "R4vers Overlay Changer Service",
        description: "Express server to handle overlay changes for R4ver",
        nodeOptions: [
            "-r esm"
        ],
        script: path.resolve(__dirname, "./server/index.js"),
    });
    
    // Listen for the "install" event, which indicates the
    // process is available as a service.
    svc.on("install", function () {
        console.log("Service installed, starting...")
        svc.start();
    });
    
    svc.install();

}())

