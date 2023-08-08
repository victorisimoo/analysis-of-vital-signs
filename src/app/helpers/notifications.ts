import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable()


export class NotificationHelper {
    constructor() {

    }


    /**
     * 
     * @param title Modal title
     * @param text Modal text content
     * @param icon Modal icon success | info | warning | error | question
     */
    showModal(title: string, text: string, icon: any = 'info', confirmBtnText: string) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: confirmBtnText
        });
    }


      /**
     * 
     * @param title Modal title
     * @param html Modal html content
     * @param icon Modal icon success | info | warning | error | question
     */
       showHTMLModal(title: string, html: string, icon: any = 'info', confirmBtnText: string) {
        Swal.fire({
            title: title,
            html: html,
            icon: icon,
            customClass: {
                htmlContainer: 'text-start'
            },
            width: "53em",
            confirmButtonColor: "#0d6efd",
            confirmButtonText: confirmBtnText
        });
    }

    showConfirmation(title:string, text: string, icon: any, color: string = "#0d6efd", confirmBtnText: string, cancelBtnText: string) {
        return Swal.fire({
            title: title,
            text: text,
            icon:icon,
            confirmButtonText: confirmBtnText,
            confirmButtonColor: "#0d6efd",
            cancelButtonText: cancelBtnText,
            showCancelButton: true
        });
    }

    showLoading(title: string, text:string) {
        Swal.fire({
            title: title,
            text: text,
            timer: 10000,
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })
    }
}