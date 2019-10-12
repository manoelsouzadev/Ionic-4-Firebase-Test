import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  protected uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public downloadURL: string;

  constructor(
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private afStorage: AngularFireStorage,
    private base64: Base64
  ) {}

  private path: string;
  protected fileImage: string;
  protected imgPath: string;
  protected fileUri: string;

  async openGalery() {
     const options: CameraOptions = await {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    try {
    await  this.camera.getPicture(options).then(
        imageData => {
          this.fileUri = /*'data:image/jpeg;base64,' +*/ imageData;
          //alert(base64Image);
          // let file: string;
          if (this.platform.is('ios')) {
            this.fileImage = this.fileUri.split('/').pop();
          } else {
            this.fileImage = this.fileUri.substring(
              this.fileUri.lastIndexOf('/') + 1,
              this.fileUri.indexOf('?')
            );
          }

          this.path =
            this.fileUri.substring(0, this.fileUri.lastIndexOf('/')) + '/';
          //alert( 'path: ' + path + ' file: ' + file );
          //  this.uploadPicture(path, file);
        },
        err => {
          alert(err);
        }
      );

      // this.uploadPicture(blob);
    } catch (error) {
      alert('erro: ' + error);
    }

    return await this.fileImage; 
  }

   async uploadPicture() {
    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(this.path, this.fileImage);
    const blob: Blob = await new Blob([buffer], { type: 'image/jpeg' });
    const ref =  await this.afStorage.ref(this.fileImage);
    const task = await ref.put(blob);
    
 // await this.uploadPercent =  task.percentageChanges().;
   await task.ref.getDownloadURL().then(urlDownload => {
    this.downloadURL = urlDownload;
   });/*then(up => {
      ref.getDownloadURL().subscribe(urlDownload => {
        this.downloadURL = urlDownload;
      });
    }).catch((err) => {
      alert(err);
    });
    /*task
      .snapshotChanges()
      .pipe(
        finalize(() =>
          ref
            .getDownloadURL()
            .subscribe(downURL => (this.downloadURL = downURL))
        )
      )
      .subscribe();

    // await this.downloadUrl.subscribe(url => this.downloadURL = url);*/
    //await alert(this.downloadURL);
     return await this.downloadURL;
  }
}
