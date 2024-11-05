import { Request, Response } from 'express';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline'
import 'dotenv/config'


export const getScale = (req: Request, res: Response) => {
   const serialPort = new SerialPort({
      path: process.env.SCALE_PORT as string,
      baudRate: 2400,
      dataBits: 7,
      parity: 'none',
      stopBits: 1,
      autoOpen: false
   });

   const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

   serialPort.open((err) => {
      if (err) {
         console.error('Error opening port:', err.message);
         return;
      }
      console.log('Port opened successfully! Waiting for data...');
   });

   let weightData = '';

   parser.on('data', (data) => {
      console.log('Data received:', data);
      weightData = data;
   });

   serialPort.on('error', (err) => {
      console.error('Serial port error:', err.message);
   });

   serialPort.on('close', () => {
      console.log('Port closed');
   });

   if (weightData !== '') {
      res.json({ data: { weight: weightData } })
   } else {
      res.status(500).json({ message: "No data provided!" })
   }
};
