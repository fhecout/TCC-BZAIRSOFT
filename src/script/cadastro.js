function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function calcularDigitoVerificador(cpf) {
    const numeros = cpf.slice(0, 9).split('').map(Number);
    const primeiroDigito = calcularDigito(numeros, 10);
    numeros.push(primeiroDigito);
    const segundoDigito = calcularDigito(numeros, 11);
    return `${primeiroDigito}${segundoDigito}`;
}

function calcularDigito(numeros, peso) {
    const total = numeros.reduce((acc, num) => acc + num * peso--, 0);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
}

const cpfInput = document.getElementById('cpf');
const digitoVerificador = document.getElementById('digito-verificador');

cpfInput.addEventListener('input', () => {
    const cpf = cpfInput.value;
    const cpfFormatado = formatCPF(cpf);
    const digito = calcularDigitoVerificador(cpf);
    cpfInput.value = cpfFormatado;
});




