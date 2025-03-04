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

    updateNumber(number, area) {
        if (number in this.numbers) {
            this.numbers[number].area = area;
        } else {
            this.numbers[number] = new PhoneNumber(number, area, null);
        }
    }

    addAddress(address) {
        this.addresses[address.name] = address;
    }

    importTable(table) {
        for (const row of table) {
            if (!row['Area']) continue;

            this.updateNumber(row['Phone'], row['Area']);

            const area = new Area(
                row['Area'],
                row['District'],
                row['Zone']
            );
            this.addArea(area);

            const person = new Person(
                row['Missionary'],
                row['ID'],
                row['Type'],
                row['Assignment'],
                row['Status'],
                row['Arrival Date'],
                row['Release Date'],
                area
            );
            this.addPerson(person);
        }
    }
}

class Area {
    constructor(name, district, zone) {
        this.name = name;
        this.district = district;
        this.zone = zone;

        this.people = [];
    }
}

class Person {
    constructor(name, ID, type, assignment, status, arrivalDate, releaseDate, area) {
        this.name = name;
        this.ID = ID;
        this.type = type;
        this.assignment = assignment;
        this.status = status;
        this.arrivalDate = arrivalDate;
        this.releaseDate = releaseDate;
        this.area = area;
    }
}

class PhoneNumber {
    constructor(number, area, lineAssignment) {
        this.number = number;
        this.area = area;
        this.lineAssignment = lineAssignment;
    }
}

class Address {
    constructor(name, areas, englishAddress, japaneseAddress) {
        this.name = name;
        this.areas = areas;
        this.englishAddress = englishAddress;
        this.japaneseAddress = japaneseAddress;
    }
}