import { Component, OnInit, ElementRef, ViewChild , AfterViewInit} from '@angular/core';
// import {} from 'google.maps';
@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.css']
})

export class MainComponentComponent implements OnInit, AfterViewInit {

  @ViewChild('mapElement') mapElement!: ElementRef;
  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  pickupLocation!: google.maps.places.PlaceResult;
  dropLocation!: google.maps.places.PlaceResult;

  constructor(){}
  ngOnInit() {
    this.initMap();
  }

  ngAfterViewInit() {
    this.initMap();
  }
  initMap() {
    // Initialize Map
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: 0, lng: 0 },
      zoom: 5,
    });

    // Initialize Directions API
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    // Set up Autocomplete for inputs
    const pickupInput = document.getElementById('pickup') as HTMLInputElement;
    const dropInput = document.getElementById('drop') as HTMLInputElement;

    const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInput);
    const dropAutocomplete = new google.maps.places.Autocomplete(dropInput);

    // Listen for place selection
    pickupAutocomplete.addListener('place_changed', () => {
      this.pickupLocation = pickupAutocomplete.getPlace();
    });

    dropAutocomplete.addListener('place_changed', () => {
      this.dropLocation = dropAutocomplete.getPlace();
    });
  }
  calculateRoute() {
    if (!this.pickupLocation || !this.dropLocation) {
      alert('Please select both pickup and drop locations.');
      return;
    }
  
    const pickupLocation = this.pickupLocation.geometry?.location;
    const dropLocation = this.dropLocation.geometry?.location;
  
    if (!pickupLocation || !dropLocation) {
      alert('Invalid location. Please select valid pickup and drop locations.');
      return;
    }
  
    const request: google.maps.DirectionsRequest = {
      origin: pickupLocation,
      destination: dropLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        this.directionsRenderer.setDirections(result);
  
        // Update distance in the UI
        const distance = result.routes[0].legs[0].distance?.text;
        const distanceContainer = document.getElementById('distance') as HTMLElement;
        distanceContainer.innerText = `Total Distance: ${distance}`;
      } else {
        alert('Could not calculate the route.');
      }
    });
  }
  
  
}
