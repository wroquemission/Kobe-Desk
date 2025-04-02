const { ipcRenderer } = require("electron");

class Database {
    constructor() {
        this.areas = {};
        this.people = {};
        this.numbers = {};
        this.addresses = {};
    }

    addArea(area) {
        this.areas[area.name] = area;
    }

    addPerson(person) {
        this.people[person.name] = person;
    }

    addNumber(number) {
        this.numbers[number.number] = number;
    }

    updateNumber(number, area, group) {
        number = PhoneNumber.normalize(number);

        if (number in this.numbers) {
            this.numbers[number].name = area;
            this.numbers[number].group = group;
        } else {
            this.numbers[number] = new PhoneNumber(
                number,
                area,
                group,
                null
            );
        }
    }

    addAddress(address) {
        this.addresses[address.name] = address;
    }

    importTable(table) {
        this.areas = {};
        this.people = {};

        for (const row of table) {
            if (row['Phone']) {
                for (const phone of row['Phone'].split(', ')) {
                    this.updateNumber(phone, row['Area'], row['Zone']);
                }
            }

            if (row['Area']) {
                if (row['Area'] in this.areas) {
                    this.areas[row['Area']].addPerson(
                        row['Missionary']
                    );
                } else {
                    const area = new Area(
                        row['Area'],
                        row['District'],
                        row['Zone'],
                        [row['Missionary']]
                    );
                    this.addArea(area);
                }
            }

            if (row['Missionary']) {
                const person = new Person(
                    row['Missionary'],
                    row['ID'],
                    row['Type'],
                    row['Assignment'],
                    row['Status'],
                    row['Arrival Date'],
                    row['Release Date']
                );
                this.addPerson(person);
            }
        }

        this.saveData();
    }

    importAddresses(table) {
        for (const row of table) {
            const fields = ['Name', 'Postal Code', 'English Address', 'Japanese Address'];

            if (fields.every(x => x in row && row[x])) {
                this.addAddress(new Address(
                    row['Name'],
                    row['Postal Code'],
                    row['English Address'],
                    row['Japanese Address'],
                    []
                ));
            }
        }

        this.saveData();
    }

    importAddressKey(table) {
        for (const row of table) {
            const fields = ['Areas', 'Apartment'];

            if (fields.every(x => x in row && row[x])) {
                const area = row['Areas'];
                const apartmentName = row['Apartment'];

                if (area in this.areas && apartmentName in this.addresses) {
                    this.addresses[apartmentName].areas.push(area);
                }
            }
        }

        this.saveData();
    }

    saveData() {
        ipcRenderer.sendSync('save-data', [
            this.areas,
            this.people,
            this.numbers,
            this.addresses
        ]);
    }

    loadData() {
        const data = ipcRenderer.sendSync('load-data');

        if (Array.isArray(data) && data.length === 4) {
            const [areas, people, numbers, addresses] = data;

            for (const area of Object.values(areas)) {
                this.addArea(
                    new Area(
                        area.name,
                        area.district,
                        area.zone,
                        area.people
                    )
                );
            }

            for (const person of Object.values(people)) {
                this.addPerson(
                    new Person(
                        person.name,
                        person.ID,
                        person.type,
                        person.assignment,
                        person.status,
                        person.arrivalDate,
                        person.releaseDate
                    )
                );
            }

            for (const number of Object.values(numbers)) {
                this.addNumber(
                    new PhoneNumber(
                        number.number,
                        number.name,
                        number.group,
                        number.lineAssignment
                    )
                );
            }

            for (const address of Object.values(addresses)) {
                this.addAddress(
                    new Address(
                        address.name,
                        address.postalCode,
                        address.englishAddress,
                        address.japaneseAddress,
                        address.areas
                    )
                );
            }
        }
    }

    getZoneAreas() {
        let zones = {};

        for (const areaName in this.areas) {
            const area = this.areas[areaName];

            if (area.zone in zones) {
                zones[area.zone].push(area.name);
            } else {
                zones[area.zone] = [area.name];
            }
        }

        return zones;
    }

    getAreaNumber(area) {
        return Object.values(this.numbers).find(number => {
            return number.area === area
        });
    }
}

class Area {
    constructor(name, district, zone, people) {
        this.name = name;
        this.district = district;
        this.zone = zone;
        this.people = people;
    }

    addPerson(name) {
        this.people.push(name);
    }
}

class Person {
    constructor(name, ID, type, assignment, status, arrivalDate, releaseDate) {
        this.name = name;
        this.ID = ID;
        this.type = type;
        this.assignment = assignment;
        this.status = status;
        this.arrivalDate = arrivalDate;
        this.releaseDate = releaseDate;
    }
}

class PhoneNumber {
    constructor(number, name, group, lineAssignment) {
        this.number = PhoneNumber.normalize(number);
        this.name = name;
        this.group = group;
        this.lineAssignment = lineAssignment;
    }

    static normalize(number) {
        const plain = number.replace(/\D/g, '');

        return `+${plain.slice(0, 2)} ${plain.slice(2, 5)}-${plain.slice(5, 9)}-${plain.slice(9)}`;
    }
}

class Address {
    constructor(name, postalCode, englishAddress, japaneseAddress, areas) {
        this.name = name;
        this.postalCode = postalCode;
        this.englishAddress = englishAddress;
        this.japaneseAddress = japaneseAddress;
        this.areas = areas;
    }
}