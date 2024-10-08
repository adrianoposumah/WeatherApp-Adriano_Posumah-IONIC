import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  localDate: string = '';
  localTime: string = '';
  searchTerm: string = '';
  city: string = 'Manado';
  suggestions: any[] = [];

  constructor(private http: HttpClient, private menu: MenuController) {}

  ngOnInit() {
    if (this.city) {
      this.getWeather();
    }
  }

  openMenu() {
    this.menu.open('first');
  }

  getWeather() {
    const apiKey = 'e84754d5446e436bb80134249241809';
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.city}&aqi=no`;

    this.http.get(apiUrl).subscribe((data) => {
      this.weatherData = data;
      this.updateLocalTime();
      console.log(this.weatherData);
    });
  }

  updateLocalTime() {
    if (this.weatherData && this.weatherData.location.localtime) {
      const localTime = this.weatherData.location.localtime;
      const [date, time] = localTime.split(' ');

      const [year, month, day] = date.split('-').map(Number);
      const dateObject = new Date(year, month - 1, day);

      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const weekday = weekdays[dateObject.getDay()];
      const monthName = months[dateObject.getMonth()];

      this.localDate = `${weekday}, ${day} ${monthName} ${year}`;
      this.localTime = time;
    }
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm && searchTerm.length > 2) {
      this.getCitySuggestions(searchTerm);
    } else {
      this.suggestions = []; // Kosongkan daftar saran jika input kurang dari 3 karakter
    }
  }

  getCitySuggestions(searchTerm: string) {
    const apiKey = 'e84754d5446e436bb80134249241809';
    const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchTerm}`;

    this.http.get(apiUrl).subscribe((data: any) => {
      this.suggestions = data;
    });
  }

  // Fungsi untuk menangani pemilihan kota dari dropdown
  onCitySelected() {
    this.getWeather(); // Panggil cuaca baru setelah kota dipilih
  }

  getWeatherIcon(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return 'assets/img/sun.png';
      case 'partly cloudy':
        return 'assets/img/cloudy-day.png';
      case 'cloudy':
        return 'assets/img/cloudy.png';
      case 'rain':
      case 'light rain':
        return 'assets/img/rainy.png';
      case 'heavy rain':
        return 'assets/img/heavy-rainy.png';
      case 'snow':
      case 'light snow':
        return 'assets/img/snowy.png';
      case 'storm':
        return 'assets/img/storm.png';
      case 'fog':
        return 'assets/img/foog.png';
      case 'windy':
        return 'assets/img/windy.png';
      case 'night':
        return 'assets/img/night.png';
      case 'night rain':
        return 'assets/img/night-rain.png';
      case 'patchy light rain with thunder':
        return 'assets/img/storm.png';
      default:
        return 'assets/img/cloud.png';
    }
  }
  onCityChange() {
    this.getWeather(); // Fetch new weather data when the city changes
  }
}
