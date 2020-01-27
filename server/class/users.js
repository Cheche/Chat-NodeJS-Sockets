
class Users {

    constructor() {

        this.persons = [];              // Persons on chat system

    }


    addPerson(id, name, room) {
        let person = { id, name, room };
        this.persons.push(person);
        
        return this.persons;
    }

    getPersonByID(id) {
        let person = this.persons.find( p => p.id === id );
        
        return person;
    }

    getAllPeople() {
        return this.persons;
    }

    getPersonsByRoom(room) {
        let personsOnRoom = this.persons.filter(p => p.room === room);
        return personsOnRoom;
    }

    deletePerson(id) {
        let personDeleted = this.getPersonByID(id);
        this.persons = this.persons.filter( p => p.id !== id );

        return personDeleted;        
    }

}


module.exports = {
    Users
}