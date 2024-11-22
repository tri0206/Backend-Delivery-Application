module.exports = (io) => {

    const namespace = io.of('/orders/delivery');
    namespace.on('connection', function (socket) {

        console.log('USER CONNECTED TO SOCKET IO');

        socket.on('position', function (data) {
            console.log('IF I ISSUE', JSON.parse(data));

            const d = JSON.parse(data); // MUST BE SENT BY THE CUSTOMER (ID, LAT, LNG) double
            namespace.emit(`position/${d.id_order}`, { id_order: d.id_order, lat: d.lat, lng: d.lng }); // ISSUE TO KOTLIN

        })

        socket.on('disconnect', function (data) {
            console.log('USER DISCONNECTED FROM SOCKET IO');
        })

    })

}