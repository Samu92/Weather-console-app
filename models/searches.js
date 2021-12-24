const fs = require('fs');
const axios = require('axios');

class Searches {
    history = [];
    dbPath = './db/database.json';

    constructor(){
        this.readDB();
    }

    get paramsMapBox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'en'
        }
    }

    get capitalisedHistory()
    {
        return this.history.map(place => {
            let places = place.split(' ');
            places = places.map(place => place[0].toUpperCase() + place.substring(1));
            return places.join(' ');
        });
    }

    loadHistoryFromArray(historyDB = []){
        historyDB.forEach(history => {
            this.history[history.name] = history;
        });
    }

    async searchCity(location = ''){
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json`,
                params: this.paramsMapBox
            });
            
            const response = await instance.get();
            return response.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                longitude: place.center[0],
                latitude: place.center[1]
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async getPlaceWeather(lat, lon){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}
            });

            const response = await instance.get();
            const {weather, main} = response.data;

            return {
                id: weather.id,
                description: weather[0].description,
                temperature: main.temp,
                min: main.temp_min,
                max: main.temp_max
            };
        } catch (error){
            console.log(error);
        }
    }

    saveHistory(place = ''){
        if(this.history.includes(place.toLowerCase()))
        {
            return;
        }
        this.history = this.history.splice(0,5);
        this.history.unshift(place.toLowerCase());
        this.saveDB();
    }

    saveDB(){
        const payload = {
            history: this.history
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB(){
        if(!fs.existsSync(this.dbPath)) return null;
        
        const data = JSON.parse(fs.readFileSync(this.dbPath, {encoding: 'utf-8'}));

        this.history = data.history;
    }
}

module.exports = Searches;