import { Injectable } from "@angular/core";

@Injectable()
export class MediaDevicesHelper {

    public mediaDevices: MediaDeviceInfo[];
    public cameras: any[];

    constructor() {
        this.mediaDevices = [];
        this.cameras = [];
    }

    async getMediaDevices() {
        return new Promise(async resolve => {
            try {
                this.mediaDevices = await window.navigator.mediaDevices.enumerateDevices();
                this.getCameras();
                resolve(true);
            } catch (error) {
                console.log("Ha ocurrido un error", error);
                resolve(false);
            }
        })
        

    }

    getCameras() {
        this.cameras = this.mediaDevices.filter(_cam => _cam.kind === "videoinput");
        
    }


    doesUserHaveCamera() {
        return !!this.cameras.length;
    }

    requestCameraPermissions() {
        return new Promise(resolve => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    resolve(true);
                })
                .catch(err => {
                    resolve(false);
                })
        });
    }


}