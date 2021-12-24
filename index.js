require('dotenv').config();
const {readInput, inquirerMenu, listPlaces, pause} = require('./helpers/inquirer');
const Searches = require('./models/searches');

console.clear();

const main = async() => {
    const searches = new Searches();
    let option = '';

    do {
        option = await inquirerMenu();

        switch(option){
            case 1:
                const search = await readInput('City: ');
                const places = await searches.searchCity(search);
                const selectedId = await listPlaces(places);
                if(selectedId === 0)
                {
                    continue;
                }
                const selectedPlace = places.find(place => place.id === selectedId);
                searches.saveHistory(selectedPlace.name);
                const placeWeather = await searches.getPlaceWeather(selectedPlace.latitude, selectedPlace.longitude);

                console.log('\nCity information:\n'.green);
                console.log('City:', selectedPlace.name.green);
                console.log('Latitude:', selectedPlace.latitude);
                console.log('Longitude:', selectedPlace.longitude);
                console.log('Temperature:', placeWeather.temperature);
                console.log('Minimum:', placeWeather.min);
                console.log('Maximum:', placeWeather.max);
                console.log('Status:', placeWeather.description.green);
                break;
            case 2:
                searches.capitalisedHistory.forEach((place, index) => {
                    index = `${index + 1}.`.green;
                    console.log(`${index} ${place}`);
                });
                break;
            default:
                break;
        }

        if(option !== 0) await pause();
    } while(option !== 0);
}

main();
