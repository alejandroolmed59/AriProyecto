export function CifrarDegenere(mensaje, clave) {
    const alf = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const ALF_SIZE = alf.length;
    const MSG_SIZE = mensaje.length;
    const KEY_SIZE = clave.length;

    var valores_clave = new Array();
    for (let i = 0; i < KEY_SIZE; i++) {
        for (let j = 0; j < ALF_SIZE; j++) {
            if (clave[i] == alf[j]) {
                valores_clave[i] = j;
            }
        }
    }

    // Cifrar
    var mensaje_cifrado = new Array();
    for (let i = 0; i < MSG_SIZE; i++) {
        var pos_letra;
        for (let j = 0; j < ALF_SIZE; j++) {
            if (mensaje[i] == alf[j]) {
                pos_letra = j;
            }
        }
        mensaje_cifrado[i] = alf[(valores_clave[i % KEY_SIZE] + pos_letra) % ALF_SIZE];
    }
    var cadena = "";
    for (let i = 0; i < MSG_SIZE; i++) {
        cadena += mensaje_cifrado[i];
    }
    //console.log(cadena);
    return cadena;
}

export function DescifrarDegenere(mensaje, clave) {

    const alf = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const ALF_SIZE = alf.length;
    const MSG_SIZE = mensaje.length;
    const KEY_SIZE = clave.length;

    // Guardar valores de la clave
    var valores_clave = new Array();
    for (let i = 0; i < KEY_SIZE; i++) {
        for (let j = 0; j < ALF_SIZE; j++) {
            if (clave[i] == alf[j]) {
                valores_clave[i] = j;
            }
        }
    }

    function modNeg(n1, n2) {
        var mod = n1;
        while (mod < 0) {
            mod += n2;
        }
        return mod;
    }

    // Descifrar
    var mensaje_descifrado = new Array();
    for (let i = 0; i < MSG_SIZE; i++) {
        var pos_letra;
        for (let j = 0; j < ALF_SIZE; j++) {
            if (mensaje[i] == alf[j]) {
                pos_letra = j;
            }
        }
        mensaje_descifrado[i] = alf[modNeg((pos_letra - valores_clave[i % KEY_SIZE]), ALF_SIZE)];
    }

    var cadena = "";
    for (let i = 0; i < MSG_SIZE; i++) {
        cadena += mensaje_descifrado[i];
    }

    return cadena; //console.log(cadena);
}

//console.log(CifrarDegenere('0123456789', 'lemon'));

//console.log(DescifrarDegenere(CifrarDegenere('0123456789', 'lemon'), 'lemon'));