module default {
    type Pet {
        required name: str {
            constraint exclusive;
        }
        required age: int16;
    }

    type User {
        required email: str;
        required password: str;
        age: int16;
        multi pets: Pet;
    }
}
