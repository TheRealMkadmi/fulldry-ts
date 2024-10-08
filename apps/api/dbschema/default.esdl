using extension auth;
using extension ai;

module default {
    type Pet {
        required name: str {
            constraint exclusive;
        }
    }

    type User {
        required email: str;
        required password: str;
        multi pets: Pet;
    }
}
