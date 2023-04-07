export function getOperatorSymbols(operationType) {
    const operatorSymbolString = operationType === "addition" ? "+" :
        operationType === "soustraction" ? "-" :
            operationType === "multiplication" ? "×" :
                operationType === "division" ? "÷" : "*";

    const operatorSymbol = operationType === "addition" ? "+" :
        operationType === "soustraction" ? "-" :
            operationType === "multiplication" ? "*" :
                operationType === "division" ? "/" : "*";

    return { operatorSymbolString, operatorSymbol };
}
export function getTextSymbols(operationType) {
    const operatorSymbolText = operationType === "addition" ? "d'adition" :
        operationType === "soustraction" ? "de soustraction" :
            operationType === "multiplication" ? "de multiplication" :
                operationType === "division" ? "de division" : "de multiplication";

    return operatorSymbolText;
}