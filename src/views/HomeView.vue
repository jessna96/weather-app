<template>
  <div class="home">
    <v-card elevation="2" class="weather_card">
      <v-container>
        <v-row align-items="center" justify="space-between">
          <v-icon>mdi-map-marker</v-icon>
          <v-col cols="8">
            <v-text-field
              @keypress="onInputEnter($event)"
              v-model="locationForWeatherData"
              placeholder="Enter a location"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-btn @click="getWeatherDataForLocation(locationForWeatherData.value)"
            >Search
            </v-btn
            >
          </v-col>
        </v-row>
        <div class="weather_card-data" v-if="!fetchError">
          <h1>{{ weatherData.city }}</h1>
          <span>{{ weatherData.weather_main }}</span>
          <span>{{ weatherData.weather_description }}</span>
          <v-img :src="weatherIconId ? weatherIconURL : ''" alt="Weather Icon" width="100px"></v-img>
          <span class="temperature">{{ weatherData.temp }} °{{ unit }}</span>
          <div class="min_max_temp">
            <div class="temp_min_max">
              min
              <span>{{ weatherData.temp_min }} °{{ unit }}</span>
            </div>
            <v-divider
              vertical
            ></v-divider>
            <div class="temp_min_max">
              max
              <span>{{ weatherData.temp_max }} °{{ unit }}</span>
            </div>
          </div>
          <v-switch
            v-model="isUnitCelsius"
            inset
            :label="`Change unit`"
            @change="toggleUnit"
          ></v-switch>
        </div>
        <div class="weather_card-error" v-else>{{ fetchError }}</div>
      </v-container>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  VBtn,
  VCard,
  VCol,
  VContainer,
  VDivider,
  VIcon,
  VImg,
  VRow,
  VSwitch,
  VTextField
} from "vuetify/lib/components";

const fetchError = ref(null);
const locationForWeatherData = ref();
const weatherIconId = ref(null);
const weatherData = reactive({
  city: null,
  temp: null,
  feels_like: null,
  temp_min: null,
  temp_max: null,
  weather_main: null,
  weather_description: null
});
const isUnitCelsius = ref(true);
const unit = ref('C');

const toggleUnit = () => {
  if (!isUnitCelsius.value) {
    weatherData.temp = celciusToFahrenheit(weatherData.temp);
    weatherData.feels_like = celciusToFahrenheit(weatherData.feels_like);
    weatherData.temp_min = celciusToFahrenheit(weatherData.temp_min);
    weatherData.temp_max = celciusToFahrenheit(weatherData.temp_max);
    unit.value = 'F';
  }
  else {
    weatherData.temp = fahrenheitToCelcius(weatherData.temp);
    weatherData.feels_like = fahrenheitToCelcius(weatherData.feels_like);
    weatherData.temp_min = fahrenheitToCelcius(weatherData.temp_min);
    weatherData.temp_max = fahrenheitToCelcius(weatherData.temp_max);
    unit.value = 'C';
  }
};

const celciusToFahrenheit = (temp) => ((temp * (9 / 5)) + 32).toFixed(1);
const fahrenheitToCelcius = (temp) => ((temp - 32) * (5/9)).toFixed(1);

const weatherIconURL = computed(
  () => `http://openweathermap.org/img/wn/${weatherIconId.value}@2x.png`
);

const onInputEnter = (event) => {
  if (event.key === "Enter") {
    getWeatherDataForLocation(locationForWeatherData.value);
  }
};

const getWeatherDataForLocation = (location) => {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=5c94f84e9a1da27164e9df663180d5af`
  )
    .then((res) => {
      return res.json();
    })
    .then((jsonRes) => {
      if (jsonRes.cod === 200) {
        fetchError.value = null;
        setWeatherData(jsonRes);
      } else {
        fetchError.value = jsonRes.message;
      }
    });
};

const setWeatherData = (data) => {
  weatherIconId.value = data.weather[0].icon;
  weatherData.city = data.name;
  weatherData.temp = data.main.temp;
  weatherData.feels_like = data.main.feels_like;
  weatherData.temp_min = data.main.temp_max;
  weatherData.temp_max = data.main.temp_min;
  weatherData.weather_main = data.weather[0].main;
  weatherData.weather_description = data.weather[0].description;
};

onMounted(() => {
  getWeatherDataForLocation("Berlin");
});

</script>

<style scoped>
.weather_card {
  width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgb(255, 255, 255, 0.5);
}

.v-text-field {
  padding: 0;
  margin: 0;
}

.weather_card-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.weather_card-error {
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-variant: small-caps;
  font-size: 22px;
}

.temperature {
  font-size: 48px;
}

.min_max_temp {
  display: flex;
  gap: 1em;
}

.temp_min_max {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
