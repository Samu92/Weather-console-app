const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?'.white,
        choices: [{
            value: 1,
            name: `${'1.'.green} Search city`
        },
        {
            value: 2,
            name: `${'2.'.green} History`
        },
        {
            value: 0,
            name: `${'0.'.green} Exit`
        }]
    }
];

const inquirerMenu = async() => {
    console.clear();
    console.log('========================'.green);
    console.log('   Select an option'.white);
    console.log('========================\n'.green);

    const { option } = await inquirer.prompt(questions);

    return option;
};

const pause = async() => {
    const pauseOptions = [
        {
            type: 'input',
            name: 'enter',
            message: `Press ${'ENTER'.green} to continue`
        }
    ];

    console.log('\n');
    await inquirer.prompt(pauseOptions);
};

const readInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Please enter a value'
                }
                return true;
            }
        }
    ];

    const {description} = await inquirer.prompt(question);
    return description;
}

const listPlaces = async(places = []) => {
    const choices = places.map((place, index) => {
        index = `${index + 1}`.green;

        return {
            value: place.id,
            name: `${index}. ${place.name}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.green + ' Exit'
    });

    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select place:',
            choices
        }
    ];

    const { id } = await inquirer.prompt(questions);
    return id;
}

module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
}