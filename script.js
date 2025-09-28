document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    let currentInput = '0';
    let isRadian = true;
    let history = [];
 
    // Use a safe evaluation function
    const safeEval = (expression) => {
        try {
            // Sanitize the expression to prevent security risks
            const sanitized = expression.replace(/[^-()\d/*+.]/g, '');
            // Using Function constructor is safer than direct eval
            return new Function('return ' + expression)();
        } catch (error) {
            return 'Error';
        }
    };

    const factorial = (n) => {
        if (n < 0) return 'Error';
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    const handleTrig = (func, value) => {
        if (!isRadian) {
            // Convert degrees to radians
            value = value * (Math.PI / 180);
        }
        return func(value);
    };

    const updateHistoryView = () => {
        historyList.innerHTML = '';
        // Show the most recent history first
        [...history].reverse().forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = `${item.expression} = ${item.result}`;
            historyList.appendChild(historyItem);
        });
    };

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        updateHistoryView();
    });

    buttons.addEventListener('click', (event) => {
        if (!event.target.matches('.btn')) return;

        const value = event.target.dataset.value;

        if (value === '=') {
            const expressionForHistory = currentInput;
            if (currentInput.includes('Error')) {
                currentInput = '0';
            } else {
                try {
                    // Handle factorial
                    currentInput = currentInput.replace(/factorial\((\d+)\)/g, (_, n) => factorial(parseInt(n)));

                    // Handle trig functions
                    currentInput = currentInput.replace(/(Math\.sin|Math\.cos|Math\.tan)\((\d+(\.\d+)?)\)/g, (match, funcStr, num) => {
                        const func = eval(funcStr); // e.g., Math.sin
                        return handleTrig(func, parseFloat(num));
                    });

                    let result = safeEval(currentInput);
                    // Round to a reasonable number of decimal places
                    const roundedResult = Math.round(result * 1e10) / 1e10;
                    
                    // Add to history
                    history.push({ expression: expressionForHistory, result: roundedResult });
                    updateHistoryView();
                    currentInput = String(roundedResult);
                } catch (error) {
                    currentInput = 'Error';
                }
            }
        } else if (value === 'C') {
            currentInput = '0';
        } else if (value === 'backspace') {
            currentInput = currentInput.slice(0, -1) || '0';
        } else if (value === 'rad') {
            isRadian = true;
            // You could add a visual indicator for Rad/Deg mode
        } else if (value === 'deg') {
            isRadian = false;
        } else {
            if (currentInput === '0' && !'./*+-'.includes(value)) {
                currentInput = value;
            } else if (currentInput === 'Error') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }

        display.value = currentInput;
    });
});
