class First {
    hello() {
        console.log('Привет я метод родителя!');
    }
}

class Second extends First{
    hello() {
        super.hello();
        console.log('А я наследуемый метод!');
    }
}

let message1 = new First();
let message2 = new Second();

message1.hello();
message2.hello();