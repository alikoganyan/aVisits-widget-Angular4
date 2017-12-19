import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {SwitcherService} from '../../services/switcher.service';
import {Salon} from '../../models/salon';
import {CityService} from '../../services/city.service';
import {NavbarSwitcherService} from '../../services/navbar-switcher.service';
import {SidebarSwitcherService} from '../../services/sidebar-switcher.service';
import {SVariables} from '../../services/sVariables';
import {GetDataService} from '../../services/get-data.service';
import {Styling} from "../../services/styling";

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styles: ['@media (max-width: 614px) { .switcherMode {display: none;}}']
})
export class SelectAddressComponent implements OnInit, OnDestroy {

  interrapt = false;
  subInterrupt: Subscription;

  sequence: string[];
  index: number;
  subSequence: Subscription;

  selectedSalon: Salon;

  salons: Salon[] = [];
  switcherMode = false;

  cityLocation: { lat: number, lng: number } = {
    lat: 56.009657,
    lng: 37.9456611
  };
  zoom = 11;



  hover = false;

  constructor(private switcherService: SwitcherService,
              private cityService: CityService,
              private navbarSwitcherService: NavbarSwitcherService,
              private sidebarSwitcherService: SidebarSwitcherService,
              private getDataService: GetDataService) {
  }

  getSalons() {
    this.getDataService.getSalons().subscribe(response => {
        this.salons = response['data'].salons;
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message);  // A client-side or network error occurred. Handle it accordingly.
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // The backend returned an unsuccessful response code.
        }
      });
  }

  getCityLatLong() {
    this.cityService.getCityLatLong().subscribe(city => {
        if (city['status'] === 'OK') {
          this.cityLocation = city['results'][0].geometry.location;
        } else {
          console.log('Something went wrong!');
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('An error occurred:', err.error.message); // A client-side or network error occurred. Handle it accordingly.
        } else {
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`); // The backend returned an unsuccessful response code.
        }
      });
  }

  ngOnInit() {
    this.getSubscriptions();
    this.getSalons();
    this.getCityLatLong();
    this.navbarSwitcherService.changeCount(this.index);
  }

  switchMode(event) {
    this.switcherMode = event.target.checked;
  }

  goBack() {
    this.switcherService.onClickedStatus(this.sequence[this.index - 1]);
  }

  goNext() {
    console.log(this.selectedSalon.id);
    SVariables.salonId = this.selectedSalon.id;
    this.switcherService.onClickedStatus(this.sequence[this.index + 1]);
  }

  onClose() {
    this.interrapt = true;
  }

  getSubscriptions() {
    this.subInterrupt = this.navbarSwitcherService.interrupt.subscribe(interrapt => {
      this.interrapt = interrapt;
    });
    this.subSequence = this.switcherService.sequence.subscribe(sequence => {
      this.index = sequence.indexOf('address');
      this.sequence = sequence;
    });
  }

  ngOnDestroy() {
    this.subInterrupt.unsubscribe();
    this.subSequence.unsubscribe();
  }


  onSelectSalon(salon: any) {
    this.selectedSalon = salon;
    this.sidebarSwitcherService.selectAddress(salon.address);
  }

  /* STYLES FROM URL COLOR */
  selectStyle() {
    return Styling.globalWidgetsStyles.selectStyle;
  }

  radioStyle() {
    return Styling.globalWidgetsStyles.radioStyle;
  }



  changeHoverM(event, salon) {
    // if(this.selectedSalon === salon) return;
    salon.hover = event.type == 'mouseover' ? true : false;
  }

}
