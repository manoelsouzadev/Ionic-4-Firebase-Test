import { finalize } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

export class Firebase {

  protected uploadPercent: Observable<number>;
  public downloadUrl: Observable<string>;
  public downloadURL: string;
  
  constructor(
    private camera: Camera,
    private platform: Platform,
    private file: File,
    private afStorage: AngularFireStorage
  ) {}

  private path: string;
protected fileImage: string;
protected imgPath: string;
protected fileUri: string;

  async openGalery() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };

    try {
    
      this.camera.getPicture(options).then(
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

      this.path = this.fileUri.substring(0, this.fileUri.lastIndexOf('/')) + '/';
     //alert( 'path: ' + path + ' file: ' + file );
   //  this.uploadPicture(path, file);
        },
        err => {
          alert(err);
        }
      );
      
      //const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(path, file);
      // const blob: Blob = new Blob([buffer], { type: 'image/jpeg'});

      // this.uploadPicture(blob);
    } catch (error) {
      alert('erro: ' + error);
    }
  }

async uploadPicture(){
    //alert('uploadPicture: ' + path + file ); 
    const buffer: ArrayBuffer = await this.file.readAsArrayBuffer(this.path, this.fileImage);
    const blob: Blob = new Blob([buffer], { type: 'image/jpeg'});

    const ref = this.afStorage.ref(this.fileImage);
    const task = ref.put(blob);

    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => this.downloadUrl = ref.getDownloadURL())
    ).subscribe();

   this.downloadUrl.subscribe(url => this.downloadURL = url);
    return this.downloadURL;
  }
}
