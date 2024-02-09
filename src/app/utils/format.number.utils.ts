export class FormatNumber {
    public static formatIntegerNumber(valueString: string){
        const valueInt = parseInt(valueString, 10);
        const valueFormatted = valueInt.toLocaleString('pt-BR');
        return valueFormatted;
    }
}