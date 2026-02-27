import { validate } from 'bycontract';


export class TipoCombustivel {
    static tipoCombustivel() {
        return ['ALCOOL', 'GASOLINA', 'FLEX', 'DIESEL'];
    }


    static verificaTipoCombustivel(tipo) {
        validate(tipo, "string");
        tipo = tipo.toUpperCase();
        return TipoCombustivel.tipoCombustivel().includes(tipo);
    }
}


export class TanqueCombustivel {
    #tipoCombustivel; // Deve ser um 'TipoCombustivel'
    #capacidade;      // Em litros
    #combustivelDisponivel; // Em litros
    #ultimoAbastecimento; // Deve ser um 'TipoCombustivel'


    constructor(tipoCombustivel, capacidade) {
        validate(arguments, ["string", "number"]);
        if (!TipoCombustivel.verificaTipoCombustivel(tipoCombustivel) ||
            capacidade < 0) {
            throw new Error("Valor inválido");
        }
        this.#tipoCombustivel = tipoCombustivel;
        this.#capacidade = capacidade;
        this.#combustivelDisponivel = 0;
        this.#ultimoAbastecimento = 'Gasolina';
    }


    get ultimoAbastecimento() {
        return this.#ultimoAbastecimento;
    }


    get tipoCombustivel() {
        return this.#tipoCombustivel;
    }


    get capacidade() {
        return this.#capacidade;
    }


    get combustivelDisponivel() {
        return this.#combustivelDisponivel;
    }


    // Retorna false se o tipo de combustivel for incompativel ou se a quantidade
    // for maior que a capacidade livre
    abastece(tipoCombustivel, quantidade) {
        validate(arguments, ["string", "number"]);
        if (tipoCombustivel != this.tipoCombustivel) {
            if (this.tipoCombustivel == 'FLEX') {
                if (!(tipoCombustivel == 'GASOLINA' || tipoCombustivel == 'ALCOOL')) {
                    return false;
                }
            } else {
                return false;
            }
        }
        if (this.combustivelDisponivel + quantidade > this.capacidade) {
            return false;
        } else {
            this.#combustivelDisponivel += quantidade;
            this.#ultimoAbastecimento = tipoCombustivel;
            return true;
        }
    }


    // Decrementa do tanque a quantidade indicada
    gasta(quantidade) {
        validate(quantidade, "number");
        if (quantidade < 0 || this.combustivelDisponivel - quantidade < 0) {
            return false;
        } else {
            this.#combustivelDisponivel -= quantidade;
            return true;
        }
    }


    toString() {
        return "TanqueCombustivel [capacidade=" + this.capacidade +
            ", combustivelDisponivel=" + this.combustivelDisponivel +
            ", tipoCombustivel=" + this.tipoCombustivel + "]";
    }
}


export class Motor {
    #tipoMotor; // Deve ser um 'TipoCombustivel'
    #consumo;   // Em Km/litro
    #quilometragem // Quilometragem atual do motor


    constructor(tipoMotor, consumo) {
        validate(arguments, ["string", "number"]);
        if (!TipoCombustivel.verificaTipoCombustivel(tipoMotor) ||
            consumo < 0) {
            throw new Error("Valor inválido");
        }
        this.#tipoMotor = tipoMotor;
        this.#consumo = consumo;
        this.#quilometragem = 0;
    }


    get tipoMotor() {
        return this.#tipoMotor;
    }


    get consumo() {
        return this.#consumo;
    }


    get quilometragem() {
        return this.#quilometragem;
    }


    combustivelNecessario(distancia) {
        validate(distancia, "number");
        return distancia / this.consumo;
    }


    percorre(distancia) {
        validate(distancia, "number");
        this.#quilometragem += distancia;
    }


    toString() {
        return "Motor [consumo=" + this.consumo + ", quilometragem=" + this.quilometragem + ", tipoMotor=" + this.tipoMotor + "]";
    }
}


class MotorFlex extends Motor {
    #consumo2;
    #tanqueCombustivel;


    constructor(consumo1, consumo2, tanqueCombustivel) {
        validate(arguments, ['number', 'number', TanqueCombustivel]);
        super('FLEX', consumo1);
        this.#consumo2 = consumo2;
        this.#tanqueCombustivel = tanqueCombustivel;
    }


    combustivelNecessario(distancia) {
        validate(distancia, "number");
        var consumoInstantaneo = 0;
        if (this.#tanqueCombustivel.ultimoAbastecimento == "GASOLINA") {
            consumoInstantaneo = this.consumo;
        } else {
            consumoInstantaneo = this.#consumo2;
        }
        return distancia / consumoInstantaneo;
    }
}


export class Carro {
    #modelo;
    #motor;
    #tanque;


    constructor(modelo, motor, tanque) {
        validate(arguments, ["string", Motor, TanqueCombustivel]);
        this.#modelo = modelo;
        this.#motor = motor;
        this.#tanque = tanque;
    }


    get modelo() {
        return this.#modelo;
    }


    get combustivelDisponivel() {
        return this.#tanque.combustivelDisponivel;
    }


    // Retorna a quantidade efetivamente abastecida
    abastece(tipoCombustivel, quantidade) {
        validate(arguments, ["string", "number"]);
        var capacidadeLivre = this.#tanque.capacidade - this.#tanque.combustivelDisponivel;
        if (capacidadeLivre < quantidade) {
            this.#tanque.abastece(tipoCombustivel, capacidadeLivre);
            return capacidadeLivre;
        } else {
            this.#tanque.abastece(tipoCombustivel, quantidade);
            return quantidade;
        }
    }


    // Retorna a distancia que consegue viajar com o combustivel remanescente
    verificaSePodeViajar(distancia) {
        validate(distancia, "number");
        var combustivelNecessario = this.#motor.combustivelNecessario(distancia);
        if (this.#tanque.combustivelDisponivel >= combustivelNecessario) {
            return distancia;
        } else {
            return this.#tanque.combustivelDisponivel * this.#motor.consumo;
        }
    }


    // Retorna true se conseguiu viajar
    viaja(distancia) {
        validate(distancia, "number");
        if (this.verificaSePodeViajar(distancia) >= distancia) {
            this.#motor.percorre(distancia);
            this.#tanque.gasta(this.#motor.combustivelNecessario(distancia));
            return true;
        }
        return false;
    }


    toString() {
        return "Carro:\n  Modelo=" + this.#modelo +
            "\n  Motor=" + this.#motor.toString() +
            "\n  Tanque=" + this.#tanque.toString();
    }
}


// Testes
var t1 = new TanqueCombustivel('GASOLINA', 45);
var m1 = new Motor('GASOLINA', 6);
var c1 = new Carro('Basico', m1, t1);
c1.abastece('GASOLINA', 40);
c1.viaja(100);
console.log(c1.toString());
console.log("------------------");


var t2 = new TanqueCombustivel('DIESEL', 70);
var m2 = new Motor('DIESEL', 5);
var c2 = new Carro('Utilitario', m2, t2);
c2.abastece('DIESEL', 40);
c2.viaja(100);
console.log(c2.toString());
console.log("------------------");


var t3 = new TanqueCombustivel('FLEX', 55);
var m3 = new Motor('GASOLINA', 8);
var c3 = new Carro('SUV', m3, t3);
c3.abastece('GASOLINA', 40);
c3.viaja(100);
console.log(c3.toString());
console.log("------------------");


var t4 = new TanqueCombustivel('FLEX', 65);
var m4 = new MotorFlex(8, 6, t4);
var c4 = new Carro('SUVFlex', m4, t4);
c4.abastece('GASOLINA', 40);
c4.viaja(100);
console.log(c4.toString());
console.log("------------------");


