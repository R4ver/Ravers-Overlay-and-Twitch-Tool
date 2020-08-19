
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

    // Listen for the "uninstall" event so we know when it's done.
    svc.on("uninstall", function () {
        console.log("Uninstall complete.");
        console.log("The service exists: ", svc.exists);
    });

    // Uninstall the service.
    svc.uninstall();
}());