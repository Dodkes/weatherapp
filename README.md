# Weather app API
App started as my first job interview task.
After 3 years I decided to fix it and customize for me and my family.
Check it here [Weather App by Dodkes](https://dodkes.github.io/weatherapp/)

## How it works?
All weather data fetched from external API.
I have chosen regions where my relatives lives, in this case:
- Slovakia - Bratislava, Modra, Michalovce
- Italy - Rome
- United Kingdom - Leeds
- Australia - Gold Coast

Rendered to interactive table which includes: `time zone`, `temperature`, `sky condition`, `wind speed`, `humidity`.
Also color of the table row and icons depends on `temperature`.

*Example*:
| CITY       | TIME               | TEMPERATURE | SKY         | WIND SPEED | HUMIDITY |
|------------|--------------------|-------------|-------------|------------|----------|
| Gold Coast | 29. 9. - 20:18 h   | 19.98°C     | clear sky   | 4.63 m/s   | 84%      |


## Technologies used
- Design: [Bootstrap](https://getbootstrap.com/)
- Weather API: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [FontAwesome](https://fontawesome.com/)
- Chart: [Chart.js](https://www.chartjs.org/)
- Heat index formula & other stuff: Interview task
