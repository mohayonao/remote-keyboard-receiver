var dgram = require("dgram");
var OscMessage = require("osc-msg");
var config = require("../config");
var oscSocket = dgram.createSocket("udp4");
var notes = [ 60, 64, 67, 71 ];
var index = 0;

function hex(value) {
  return "0x" + ("00" + value.toString(16)).slice(-2);
}

setInterval(function() {
  var st = index % 2 ? 0x80 : 0x90;
  var d1 = notes[(index >> 1) % notes.length];
  var d2 = index % 2 ? 0x00 : 48 + Math.abs(Math.cos(index) * 64)|0;
  var buffer = OscMessage.toBuffer({
    address: "/midi",
    args: [
      { type: "integer", value: st },
      { type: "integer", value: d1 },
      { type: "integer", value: d2 },
    ],
  });

  oscSocket.send(buffer, 0, buffer.length, config.PORT, "127.0.0.1", function() {
    console.log("< %s %s %s", hex(st), hex(d1), hex(d2));
  });

  index += 1;
}, 250);
