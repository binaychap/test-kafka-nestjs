import { Injectable } from "@nestjs/common";

@Injectable()
export class SendSMSService{

   async sendSms(message: string){
    console.log({
        value: message.toString()
      });
   }
}