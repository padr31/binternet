import { Component, OnInit } from '@angular/core';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { HTTP } from '@ionic-native/http/ngx';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  scannedData: any;
  scannedTrashData: any;
  encodedData: '';
  encodeData: any;

  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
    public barcodeCtrl: BarcodeScanner,
    private http: HTTP
   // private qrScanner: QRScanner
  ) {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ngOnInit() {

  }

  scanTrash = () => {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'EAN_8,EAN_13,PDF_417',
      orientation: 'portrait',
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      this.scannedTrashData = barcodeData
      alert(JSON.stringify(barcodeData))
      this.http.get(`http://pavoldrotar.com:5000/barcodes?barcode=${barcodeData.text}`, {}, {})
      .then(data => {
        this.scannedTrashData = JSON.parse(data.data)[0].type
        this.checkMatch()
      })
      .catch(err => {
        alert(err.error)
      })
    }).catch(err => {
        alert(err.error)
    });
  }

  scanBin = () => {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a QR code inside the scan area',
      resultDisplayDuration: 500,
      formats: 'QR_CODE,PDF_417',
      orientation: 'portrait',
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      this.scannedData = barcodeData.text
      this.checkMatch();
    }).catch(err => {
      console.log('Error', err);
    });

    /* this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted


        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);

          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
        });

      } else if (status.denied) {
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => console.log('Error is', e));*/

  }

  checkMatch = () => {
    if(!this.scannedData || !this.scannedTrashData) return;

    Swal.fire({
      title: this.scannedTrashData === this.scannedData ? 'Correct!' : 'Incorrect bin!',
      text: this.scannedTrashData === this.scannedData ? `You've each points` : `You wanted to toss ${this.scannedTrashData} into ${this.scannedData}`,
      icon: this.scannedTrashData === this.scannedData ? 'success' : 'error'
    })
  }

  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
