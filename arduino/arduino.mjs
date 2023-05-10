import SerialPort from 'serialport';
import Readline from 'serialport/parser-readline';

const port = new SerialPort('/dev/cu.usbserial-0001');
const parser = new Readline();
port.pipe(parser);
parser.on('data', console.log);
